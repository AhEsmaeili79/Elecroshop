const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const SCHEMA_URL = process.env.SCHEMA_URL || 'http://95.216.121.250:8006/schema/';
const SCHEMA_FILE = path.join(__dirname, '../openapi-schema.json');

/**
 * Fetch OpenAPI schema from the remote URL
 */
async function fetchSchema() {
  return new Promise((resolve, reject) => {
    const url = new URL(SCHEMA_URL);
    const client = url.protocol === 'https:' ? https : http;

    console.log(`Fetching schema from ${SCHEMA_URL}...`);

    client
      .get(SCHEMA_URL, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to fetch schema: ${res.statusCode}`));
          return;
        }

        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            // Try to parse as JSON first
            const jsonData = JSON.parse(data);
            fs.writeFileSync(SCHEMA_FILE, JSON.stringify(jsonData, null, 2));
            console.log('✓ Schema fetched and saved as JSON');
            resolve(SCHEMA_FILE);
          } catch (e) {
            // If not JSON, try to save as YAML
            const yamlFile = SCHEMA_FILE.replace('.json', '.yaml');
            fs.writeFileSync(yamlFile, data);
            console.log('✓ Schema fetched and saved as YAML');
            resolve(yamlFile);
          }
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

/**
 * Organize generated files into one folder per tag with models:
 *   e.g. src/api/authentication/index.ts, src/api/authentication/models/
 *        src/api/users/index.ts, src/api/users/models/
 */
function organizeByTags() {
  const apiDir = path.join(__dirname, '../src/api');
  const modelsDir = path.join(apiDir, 'models');

  if (!fs.existsSync(apiDir)) {
    console.log('⚠ API directory does not exist yet.');
    return;
  }

  console.log('Organizing API files and models by tags...');

  // Read schema to map schemas to tags
  let schemaTagMap = new Map(); // Map<schemaName, tagName>
  
  try {
    const schemaPath = fs.existsSync(SCHEMA_FILE) 
      ? SCHEMA_FILE 
      : SCHEMA_FILE.replace('.json', '.yaml');
    
    if (fs.existsSync(schemaPath)) {
      const schemaContent = fs.readFileSync(schemaPath, 'utf8');
      let schema;
      if (schemaPath.endsWith('.json')) {
        schema = JSON.parse(schemaContent);
      } else {
        // Try to parse as YAML, fallback to JSON
        try {
          // Try JSON first in case it's actually JSON
          schema = JSON.parse(schemaContent);
        } catch (e) {
          // If JSON parsing fails, try YAML (requires js-yaml package)
          try {
            const yaml = require('js-yaml');
            schema = yaml.load(schemaContent);
          } catch (yamlError) {
            console.log('⚠ Could not parse schema as JSON or YAML');
            schema = {};
          }
        }
      }

      // Map schemas to tags based on which endpoints use them
      if (schema.paths) {
        Object.entries(schema.paths).forEach(([path, methods]) => {
          Object.entries(methods).forEach(([method, operation]) => {
            if (operation.tags && operation.tags.length > 0) {
              const tag = operation.tags[0].toLowerCase();
              
              // Extract schema references from request/response
              const extractSchemas = (obj) => {
                if (!obj || typeof obj !== 'object') return;
                
                if (obj.$ref) {
                  const schemaName = obj.$ref.split('/').pop();
                  if (schemaName && !schemaTagMap.has(schemaName)) {
                    schemaTagMap.set(schemaName, tag);
                  }
                }
                
                if (obj.schema && obj.schema.$ref) {
                  const schemaName = obj.schema.$ref.split('/').pop();
                  if (schemaName && !schemaTagMap.has(schemaName)) {
                    schemaTagMap.set(schemaName, tag);
                  }
                }
                
                Object.values(obj).forEach(val => {
                  if (typeof val === 'object' && val !== null) {
                    extractSchemas(val);
                  }
                });
              };

              if (operation.requestBody) extractSchemas(operation.requestBody);
              if (operation.responses) extractSchemas(operation.responses);
            }
          });
        });
      }
    }
  } catch (e) {
    console.log('⚠ Could not parse schema for model mapping, using file-based approach');
  }

  // Move API files to tag folders
  const files = fs.readdirSync(apiDir);

  files
    .filter(
      (f) =>
        f.endsWith('.ts') &&
        f !== 'index.ts' &&
        f !== 'models' &&
        f !== 'mutator.ts' &&
        f !== 'config.ts' &&
        !fs.statSync(path.join(apiDir, f)).isDirectory()
    )
    .forEach((file) => {
      const baseName = file.replace(/\.ts$/, ''); // e.g. authentication, users
      const tagFolder = path.join(apiDir, baseName);
      const sourcePath = path.join(apiDir, file);
      const destPath = path.join(tagFolder, 'index.ts');

      if (!fs.existsSync(tagFolder)) {
        fs.mkdirSync(tagFolder, { recursive: true });
      }

      let content = fs.readFileSync(sourcePath, 'utf8');

      // Update imports to point to tag-specific models
      // First, try to find which tag the imported model belongs to
      content = content.replace(
        /from\s+['"]\.\.\/models\/([^'"]+)['"]/g,
        (match, modelName) => {
          // Check if model exists in this tag's models folder
          const tagModelsDir = path.join(apiDir, baseName, 'models');
          const modelFile = `${modelName}.ts`;
          
          if (fs.existsSync(path.join(tagModelsDir, modelFile))) {
            return `from './models/${modelName}'`;
          } else {
            // Model might be in another tag's folder - check common locations
            // For now, assume it's in the same tag (will be fixed when models are moved)
            return `from './models/${modelName}'`;
          }
        }
      );
      content = content.replace(
        /from\s+['"]\.\.\/mutator['"]/g,
        "from '../../mutator'"
      );

      fs.writeFileSync(destPath, content);
      fs.unlinkSync(sourcePath);
      console.log(`  ✓ Moved ${file} → ${baseName}/index.ts`);
    });

  // Organize models by tag
  if (fs.existsSync(modelsDir)) {
    const modelFiles = fs.readdirSync(modelsDir).filter(f => f.endsWith('.ts'));
    
    modelFiles.forEach((modelFile) => {
      const modelName = modelFile.replace(/\.ts$/, '');
      
      // Try to determine tag from schema map, or infer from model name
      let tag = schemaTagMap.get(modelName);
      
      if (!tag) {
        // Fallback: infer tag from model name patterns
        const modelLower = modelName.toLowerCase();
        
        // Users tag models (prioritize user-related models)
        if (modelLower === 'user' || modelLower.startsWith('user') || 
            modelLower.includes('passwordupdate') || modelLower.includes('patcheduser')) {
          tag = 'users';
        }
        // Authentication tag models
        else if (modelLower.includes('login') || modelLower.includes('register') || 
            modelLower.includes('auth') || modelLower.includes('otp') || 
            modelLower.includes('token') || modelLower.includes('logout') ||
            modelLower.includes('refresh') || modelLower.includes('jwt')) {
          tag = 'authentication';
        } 
        // Default to users for user-related, authentication for auth-related
        else if (modelLower.includes('user')) {
          tag = 'users';
        } else {
          // Default to authentication if we can't determine
          tag = 'authentication';
        }
      }

      const tagFolder = path.join(apiDir, tag);
      const tagModelsDir = path.join(tagFolder, 'models');
      const sourceModelPath = path.join(modelsDir, modelFile);
      const destModelPath = path.join(tagModelsDir, modelFile);

      if (!fs.existsSync(tagModelsDir)) {
        fs.mkdirSync(tagModelsDir, { recursive: true });
      }

      // Read model file and update internal imports
      let modelContent = fs.readFileSync(sourceModelPath, 'utf8');
      
      // Update imports within models (they might reference other models)
      // Models in the same folder use relative imports
      modelContent = modelContent.replace(
        /from\s+['"]\.\.\/\.\.\/models\/([^'"]+)['"]/g,
        (match, importedModel) => {
          // Determine which tag the imported model belongs to
          let importedTag = schemaTagMap.get(importedModel);
          
          if (!importedTag) {
            // Infer tag from model name
            const importedModelLower = importedModel.toLowerCase();
            if (importedModelLower === 'user' || importedModelLower.startsWith('user')) {
              importedTag = 'users';
            } else if (importedModelLower.includes('login') || importedModelLower.includes('register') ||
                       importedModelLower.includes('auth') || importedModelLower.includes('otp') ||
                       importedModelLower.includes('token') || importedModelLower.includes('jwt')) {
              importedTag = 'authentication';
            } else {
              importedTag = tag; // Default to same tag
            }
          }
          
          if (importedTag === tag) {
            // Same tag - use relative import
            return `from './${importedModel}'`;
          } else {
            // Cross-tag import - use absolute path from api root
            return `from '../../${importedTag}/models/${importedModel}'`;
          }
        }
      );

      fs.writeFileSync(destModelPath, modelContent);
      fs.unlinkSync(sourceModelPath);
      console.log(`  ✓ Moved model ${modelFile} → ${tag}/models/`);
    });

    // Remove empty models directory
    try {
      const remainingFiles = fs.readdirSync(modelsDir);
      if (remainingFiles.length === 0) {
        fs.rmdirSync(modelsDir);
      }
    } catch (e) {
      // Ignore if directory not empty or can't be removed
    }
  }

  // Final pass: Fix imports in API files to correctly reference models
  const tagFolders = fs.readdirSync(apiDir)
    .filter(f => fs.statSync(path.join(apiDir, f)).isDirectory() && f !== 'models');
  
  tagFolders.forEach((tagFolder) => {
    const apiIndexPath = path.join(apiDir, tagFolder, 'index.ts');
    if (fs.existsSync(apiIndexPath)) {
      let content = fs.readFileSync(apiIndexPath, 'utf8');
      let modified = false;
      
      // Fix model imports to point to correct tag folders
      content = content.replace(
        /from\s+['"]\.\/models\/([^'"]+)['"]/g,
        (match, modelName) => {
          // Check if model exists in this tag's models folder
          const tagModelsDir = path.join(apiDir, tagFolder, 'models');
          const modelFile = `${modelName}.ts`;
          
          if (fs.existsSync(path.join(tagModelsDir, modelFile))) {
            return match; // Already correct
          } else {
            // Model is in another tag - find which one
            let foundTag = null;
            for (const otherTag of tagFolders) {
              if (otherTag !== tagFolder) {
                const otherModelsDir = path.join(apiDir, otherTag, 'models');
                if (fs.existsSync(path.join(otherModelsDir, modelFile))) {
                  foundTag = otherTag;
                  break;
                }
              }
            }
            
            if (foundTag) {
              modified = true;
              return `from '../../${foundTag}/models/${modelName}'`;
            }
            return match;
          }
        }
      );
      
      if (modified) {
        fs.writeFileSync(apiIndexPath, content);
        console.log(`  ✓ Fixed imports in ${tagFolder}/index.ts`);
      }
    }
  });

  console.log('✓ Tag folders with models created under src/api');
}

/**
 * Generate API client using Orval
 */
function generateApi(schemaPath) {
  console.log('Generating API client with Orval...');

  try {
    // Run orval with the config
    execSync(`npx orval`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });
    console.log('✓ API client generated successfully!');
  } catch (error) {
    console.error('✗ Error generating API client:', error.message);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    // Fetch schema
    const schemaPath = await fetchSchema();
    
    // Update orval config to use the fetched schema
    const orvalConfigPath = path.join(__dirname, '../orval.config.ts');
    let orvalConfig = fs.readFileSync(orvalConfigPath, 'utf8');
    
    const relativeSchemaPath = path.relative(
      path.join(__dirname, '..'),
      schemaPath
    ).replace(/\\/g, '/');
    
    orvalConfig = orvalConfig.replace(
      /target:\s*['"][^'"]*['"]/,
      `target: '${relativeSchemaPath}'`
    );
    
    fs.writeFileSync(orvalConfigPath, orvalConfig);
    
    // Generate API
    generateApi(schemaPath);
    
    // Organize by tags into directories
    organizeByTags();
    
    console.log('\n✓ API generation complete!');
    
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { fetchSchema, generateApi, organizeByTags };

