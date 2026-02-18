from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
import pandas as pd
from io import BytesIO, StringIO
from app.models.schemas import CSVUploadResponse, PDFGenerateRequest
from app.services.pdf_generator import PDFGenerator

router = APIRouter()


@router.post("/upload-csv", response_model=CSVUploadResponse)
async def upload_csv(file: UploadFile = File(...)):
    """
    Upload CSV file and return parsed data with available price columns
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    try:
        # Read CSV file
        contents = await file.read()
        df = pd.read_csv(StringIO(contents.decode('utf-8')))
        
        # Get price columns
        price_columns = df.filter(regex='Price').columns.tolist()
        
        # Get unique product codes
        product_codes = df['ProductCode'].unique().tolist() if 'ProductCode' in df.columns else []
        
        # Convert dataframe to list of dicts
        data = df.to_dict('records')
        
        return CSVUploadResponse(
            data=data,
            price_columns=price_columns,
            product_codes=product_codes
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing CSV: {str(e)}")


@router.post("/generate-pdf")
async def generate_pdf(request: PDFGenerateRequest):
    """
    Generate PDF with price tags based on configuration and selected products
    """
    try:
        # Convert data to DataFrame
        df = pd.DataFrame(request.csv_data)
        
        # Filter by selected products
        if request.selected_products:
            df = df[df['ProductCode'].isin(request.selected_products)]
        
        if df.empty:
            raise HTTPException(status_code=400, detail="No products selected or found")
        
        # Reset index
        df = df.reset_index(drop=True)
        
        # Generate PDF
        generator = PDFGenerator(request.config)
        pdf_bytes = generator.generate_tags(df, request.price_column)
        
        # Return PDF as streaming response
        return StreamingResponse(
            BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=PriceTags.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")
