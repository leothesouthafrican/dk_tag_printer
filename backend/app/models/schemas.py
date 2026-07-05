from pydantic import BaseModel
from typing import List, Optional


class TagConfig(BaseModel):
    portrait_landscape: str
    tag_height: float
    tag_width: float
    font_size: int
    max_characters: int
    auto_max_characters: bool
    left_margin: float = 7.5    # NEW: page left margin (mm)
    top_margin: float = 10.0    # NEW: page top margin (mm)
    inner_padding: float = 2.0  # NEW: horizontal inset of content within each tag (mm)


class CSVUploadResponse(BaseModel):
    data: List[dict]
    price_columns: List[str]
    product_codes: List[str]


class PDFGenerateRequest(BaseModel):
    csv_data: List[dict]
    selected_products: List[str]
    price_column: str
    config: TagConfig
