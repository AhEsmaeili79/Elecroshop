// src/components/Category/ModelList.jsx
import React, { useEffect, useState } from 'react';
import { fetchModels, addModel, deleteModel } from './api';

const ModelList = () => {
  const [models, setModels] = useState([]);
  const [newModel, setNewModel] = useState('');

  useEffect(() => {
    const getModels = async () => {
      const data = await fetchModels();
      setModels(data);
    };
    getModels();
  }, []);

  const handleAddModel = async () => {
    if (!newModel) return;
    try {
      const addedModel = await addModel({ name: newModel });
      setModels([...models, addedModel]);
      setNewModel('');
    } catch (error) {
      console.error('Error adding model:', error);
    }
  };

  const handleDeleteModel = async (modelId) => {
    try {
      await deleteModel(modelId);
      setModels(models.filter((model) => model.id !== modelId));
    } catch (error) {
      console.error('Error deleting model:', error);
    }
  };

  return (
    <div>
      <h2>Models</h2>
      <ul>
        {models.map((model) => (
          <li key={model.id}>
            {model.name}
            <button onClick={() => handleDeleteModel(model.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newModel}
        onChange={(e) => setNewModel(e.target.value)}
        placeholder="New model name"
      />
      <button onClick={handleAddModel}>Add Model</button>
    </div>
  );
};

export default ModelList;
