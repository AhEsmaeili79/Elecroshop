#!/bin/sh
set -e

echo "Waiting for database to be ready..."
until python -c "import os,psycopg2;conn=psycopg2.connect(dbname=os.environ.get('DB_NAME','electroshop'),user=os.environ.get('DB_USER','postgres'),password=os.environ.get('DB_PASSWORD','postgres'),host=os.environ.get('DB_HOST','db'),port=os.environ.get('DB_PORT','5432'));conn.close();print('Database ready')" 2>/dev/null; do
  echo "Database not ready, waiting..."
  sleep 2
done

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "Setup completed successfully"
exit 0
