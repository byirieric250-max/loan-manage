import os

file_path = '../Backend/Backend/settings.py'
with open(file_path, 'r') as f:
    content = f.read()

# Use CORS_ALLOW_ALL_ORIGINS for easier development
if "CORS_ALLOW_ALL_ORIGINS" not in content:
    content = content.replace(
        "CORS_ALLOWED_ORIGINS = [",
        "CORS_ALLOW_ALL_ORIGINS = True\nCORS_ALLOWED_ORIGINS = ["
    )

with open(file_path, 'w') as f:
    f.write(content)
