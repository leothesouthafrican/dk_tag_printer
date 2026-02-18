from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(
    title="DasKasas Tag Tool API",
    description="API for generating price tags from DEAR Inventory CSV exports",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000", "http://localhost:3001", "https://tags.leo-figueiredo.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api", tags=["tags"])


@app.get("/")
async def root():
    return {"message": "DasKasas Tag Tool API", "version": "2.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
