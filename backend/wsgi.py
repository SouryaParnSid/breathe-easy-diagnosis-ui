#!/usr/bin/env python3
"""
WSGI entry point for Render deployment
"""
from main import app

if __name__ == "__main__":
    app.run() 