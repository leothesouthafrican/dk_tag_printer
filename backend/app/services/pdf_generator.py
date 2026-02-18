import pandas as pd
from fpdf import FPDF
from io import BytesIO
from typing import List
from app.models.schemas import TagConfig


class PDFGenerator:
    def __init__(self, config: TagConfig):
        self.config = config
        
    def generate_tags(self, df: pd.DataFrame, price_column: str) -> bytes:
        """Generate PDF with price tags based on configuration"""
        
        # Apply max characters limit to product names
        df["Name"] = df["Name"].str[:self.config.max_characters]
        
        # Convert tag height (divide by 3 as in original)
        tag_height = self.config.tag_height / 3
        tag_width = self.config.tag_width
        font_size = self.config.font_size
        orientation = self.config.portrait_landscape
        
        # Create PDF
        pdf = FPDF(unit="mm", format="A4", orientation=orientation)
        pdf.add_page(orientation)
        pdf.set_font('Arial', 'B', font_size)
        
        x_initial = pdf.get_x()
        
        for index in df.index:
            # Check if current x position is within useable width
            if pdf.get_x() < (pdf.w - pdf.l_margin - tag_width):
                # Create tag cells: Product Code, Name, Price
                pdf.cell(w=tag_width, h=tag_height, txt=str(df.iloc[index, 0]), border=0)
                pdf.set_xy(pdf.get_x() - tag_width, pdf.get_y() + tag_height)
                pdf.cell(w=tag_width, h=tag_height, txt=str(df.iloc[index, 1]), border=0)
                pdf.set_xy(pdf.get_x() - tag_width, pdf.get_y() + tag_height)
                pdf.cell(w=tag_width, h=tag_height, txt="R" + "{:0.2f}".format(df.at[index, price_column] * 1.15), border=0)
                pdf.set_xy(pdf.get_x(), pdf.get_y() - 2 * tag_height)
                # Create border around all three cells
                pdf.rect(pdf.get_x() - tag_width, pdf.get_y(), tag_width, 3 * tag_height)
            else:
                # Create tags on new line
                pdf.set_xy(x_initial, pdf.get_y() + tag_height * 3)
                pdf.cell(w=tag_width, h=tag_height, txt=str(df.iloc[index, 0]), border=0)
                pdf.set_xy(pdf.get_x() - tag_width, pdf.get_y() + tag_height)
                pdf.cell(w=tag_width, h=tag_height, txt=str(df.iloc[index, 1]), border=0)
                pdf.set_xy(pdf.get_x() - tag_width, pdf.get_y() + tag_height)
                pdf.cell(w=tag_width, h=tag_height, txt="R" + "{:0.2f}".format(df.at[index, price_column] * 1.15), border=0)
                pdf.set_xy(pdf.get_x(), pdf.get_y() - 2 * tag_height)
                # Create border around all three cells
                pdf.rect(pdf.get_x() - tag_width, pdf.get_y(), tag_width, 3 * tag_height)
        
        # Return PDF as bytes
        return pdf.output(dest='S').encode('latin-1')
