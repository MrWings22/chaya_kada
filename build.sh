#!/usr/bin/env bash
# exit on error
set -o errexit

# Install system dependencies for Pillow
apt-get update && apt-get install -y libjpeg-dev zlib1g-dev

# Install Python dependencies
pip install -r requirements.txt

# Add any other build steps here (e.g., running Django migrations)
# python manage.py migrate