import os

file_path = '../Backend/Backend/settings.py'
with open(file_path, 'r') as f:
    content = f.read()

# Update CSRF_TRUSTED_ORIGINS
content = content.replace(
    "'http://localhost:3000',",
    "'http://localhost:3000',\n    'http://localhost:3001',\n    'http://127.0.0.1:3001',"
)

# Update CORS_ALLOWED_ORIGINS
content = content.replace(
    "\"http://localhost:3000\",",
    "\"http://localhost:3000\",\n    \"http://localhost:3001\",\n    \"http://127.0.0.1:3001\","
)

with open(file_path, 'w') as f:
    f.write(content)
