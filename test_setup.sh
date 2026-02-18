#!/bin/bash

echo "===== Testing DasKasas Tag Tool Setup ====="
echo ""

# Test Python syntax
echo "1. Testing backend Python syntax..."
cd backend
python3 -m py_compile app/main.py app/api/routes.py app/services/pdf_generator.py app/models/schemas.py
if [ $? -eq 0 ]; then
    echo "✓ Backend Python syntax is valid"
else
    echo "✗ Backend Python syntax errors found"
    exit 1
fi
cd ..

# Test TypeScript/JSON configs
echo ""
echo "2. Testing frontend configuration..."
cd frontend
cat tsconfig.json | python3 -m json.tool > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ TypeScript config is valid"
else
    echo "✗ TypeScript config has errors"
    exit 1
fi

cat package.json | python3 -m json.tool > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Package.json is valid"
else
    echo "✗ Package.json has errors"
    exit 1
fi
cd ..

# Test Docker files exist
echo ""
echo "3. Checking Docker configuration..."
if [ -f "docker-compose.yml" ]; then
    echo "✓ docker-compose.yml exists"
else
    echo "✗ docker-compose.yml not found"
    exit 1
fi

if [ -f "backend/Dockerfile" ]; then
    echo "✓ backend/Dockerfile exists"
else
    echo "✗ backend/Dockerfile not found"
    exit 1
fi

if [ -f "frontend/Dockerfile" ]; then
    echo "✓ frontend/Dockerfile exists"
else
    echo "✗ frontend/Dockerfile not found"
    exit 1
fi

# Test sample data
echo ""
echo "4. Checking sample data..."
if [ -f "sample_inventory.csv" ]; then
    echo "✓ sample_inventory.csv exists"
else
    echo "✗ sample_inventory.csv not found"
    exit 1
fi

echo ""
echo "===== All tests passed! ====="
echo ""
echo "To run the application:"
echo "1. Start Docker Desktop"
echo "2. Run: docker-compose up --build"
echo "3. Access frontend at http://localhost:3000"
echo "4. Access backend API at http://localhost:8000/docs"
