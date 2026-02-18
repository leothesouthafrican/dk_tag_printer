# DasKasas Tag Tool v2.0

A modernized application for creating custom price tags from DEAR Inventory CSV exports.

## Architecture

This application consists of:
- **FastAPI Backend** - RESTful API for CSV processing and PDF generation
- **Next.js Frontend** - Modern React-based user interface
- **Docker Compose** - Orchestration for both services

## Getting Started

### Prerequisites
- Docker and Docker Compose installed
- Or Node.js 20+ and Python 3.11+ for local development

### Running with Docker Compose

1. Build and start the services:
```bash
docker-compose up --build
```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

3. Test with sample data:
   - Upload the `sample_inventory.csv` file from the root directory
   - Select products and configure tag settings
   - Generate and download the PDF

### Local Development

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features

- **CSV Upload** - Parse DEAR Inventory CSV exports
- **Tag Configuration** - Customize dimensions, font size, orientation
- **Product Selection** - Multi-select with live preview
- **PDF Generation** - Professional price tags with 15% markup
- **Modern UI** - Responsive design with Tailwind CSS

## API Endpoints

- `POST /api/upload-csv` - Upload and parse CSV file
- `POST /api/generate-pdf` - Generate PDF with selected products

## Original Version

The original Streamlit version is available in `main.py` on the `main` branch.
