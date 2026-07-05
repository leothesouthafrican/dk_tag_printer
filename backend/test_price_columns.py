"""Self-check: price columns are filtered to numeric ones, and a non-numeric
selection returns a clean 400 instead of a 500.

Run: `python test_price_columns.py` (or `pytest test_price_columns.py`).
"""
import asyncio

import pandas as pd
from fastapi import HTTPException

from app.api.routes import generate_pdf, numeric_price_columns
from app.models.schemas import PDFGenerateRequest, TagConfig

# CSV shaped like a DEAR export: two text "Price" columns + one numeric one.
CSV_ROWS = [
    {"ProductCode": "P1", "Name": "Alpha", "Default Price Tier": "Standard",
     "Retail Price": 45.99, "Price Regime": "Standard"},
    {"ProductCode": "P2", "Name": "Beta", "Default Price Tier": "Premium",
     "Retail Price": 12.50, "Price Regime": "Premium"},
]


def _request(price_column: str) -> PDFGenerateRequest:
    return PDFGenerateRequest(
        csv_data=CSV_ROWS,
        selected_products=["P1", "P2"],
        price_column=price_column,
        config=TagConfig(
            portrait_landscape="P", tag_height=39.5, tag_width=65,
            font_size=8, max_characters=40, auto_max_characters=False,
        ),
    )


def test_only_numeric_price_columns_offered():
    cols = numeric_price_columns(pd.DataFrame(CSV_ROWS))
    assert cols == ["Retail Price"], cols  # text "Price" columns excluded


def test_numeric_column_generates_pdf():
    resp = asyncio.run(generate_pdf(_request("Retail Price")))
    assert resp.media_type == "application/pdf"


def test_text_column_is_clean_400_not_500():
    try:
        asyncio.run(generate_pdf(_request("Price Regime")))
    except HTTPException as exc:
        assert exc.status_code == 400, exc.status_code
    else:
        raise AssertionError("expected HTTPException 400 for a non-numeric price column")


if __name__ == "__main__":
    test_only_numeric_price_columns_offered()
    test_numeric_column_generates_pdf()
    test_text_column_is_clean_400_not_500()
    print("OK: numeric-only price columns + clean 400 guard")
