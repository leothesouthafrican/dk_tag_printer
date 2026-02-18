# Quick Start Guide

## Prerequisites
- Docker Desktop installed and running
- Or Node.js 20+ and Python 3.11+ for local development

## Option 1: Docker (Recommended)

### Start the application
```bash
# Make sure Docker Desktop is running
docker-compose up --build
```

### Access the application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Test the application
1. Open http://localhost:3000 in your browser
2. Upload the `sample_inventory.csv` file
3. Select products from the list
4. Configure tag settings (or use defaults)
5. Click "Generate & Download PDF"

### Stop the application
```bash
docker-compose down
```

## Option 2: Local Development

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```

Access the application at http://localhost:3000

## Troubleshooting

### Docker not running
```
Error: Cannot connect to the Docker daemon
```
**Solution**: Start Docker Desktop application

### Port already in use
```
Error: Bind for 0.0.0.0:3000 failed: port is already allocated
```
**Solution**: Stop other services using ports 3000 or 8000, or modify ports in docker-compose.yml

### Frontend can't connect to backend
**Solution**: Ensure backend is running and accessible at http://localhost:8000

## Architecture

```
dk_tag_printer/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── models/      # Pydantic models
│   │   └── services/    # Business logic (PDF generation)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/            # Next.js frontend
│   ├── app/            # Next.js app directory
│   ├── components/     # React components
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml  # Orchestration
└── sample_inventory.csv # Test data
```
