#importing necessary packages
import streamlit as st
import pandas as pd
from fpdf import FPDF
import base64

#setting page header
st.header("DasKasas Tag Tool")

#requesting tag sizes and csv file from user in the sidebar
with st.sidebar:
    csv = st.file_uploader("Please Upload Updated CSV Export from DEAR Inventory.")
    tag_height = st.number_input("Tag Height (mm)", min_value=0, max_value=100, value=34)/3
    tag_width = st.number_input("Tag Width (mm)", min_value=0, max_value=100, value=60)
    font_size = st.number_input("Font Size", min_value=8, max_value=100, value=8)
    max_characters = st.number_input("Max Characters", min_value=37, max_value=60, value=37)

#if a csv has been uploaded load the csv as a pandas df and display it for verification by user
if csv:
    st.subheader("CSV file uploaded, please confirm below:")
    df = pd.read_csv(csv)
    st.dataframe(df)

    #getting list of price columns
    price_columns = df.filter(regex='Price').columns

    #allowing the user to change the price columns to be used for the tag if need be
    with st.sidebar:
        price_chosen = st.selectbox("Select Price Regime", price_columns,4)

    #search box for filtering by item name and including only those in the pdf to be printed
    selected_products = st.multiselect("Select Products", df.ProductCode.unique())
    
    #creating and displaying a df with only selected products (filter)
    df = df.loc[df["ProductCode"].isin(selected_products)]
    df = df.reset_index(drop=True)
    #Allow the description to only have a length of 40 characters
    df["Name"] = df["Name"].str[:max_characters]
    
    #displaying the new dataframe with only selected products for verification by user
    st.dataframe(df)

    #button to go ahead and create the pdf with the tags
    button = st.button("Process Tags")

    if button:
        # instantiation of inherited class 
        pdf = FPDF(unit= "mm", format = "A4")

        #creating a blank page and setting font
        pdf.add_page("L")
        pdf.set_font('Arial', 'B', font_size)

        #Creating the cells

        #getting initial x coordinate
        x_initial = pdf.get_x()
        
        for index in df.index:
            #if current x position is within the useable width of the page create new tags
            if pdf.get_x() < (pdf.w - pdf.l_margin - tag_width):
                pdf.cell(w = tag_width, h = tag_height, txt = df.iloc[index, 0], border = 0)
                pdf.set_xy(pdf.get_x()-tag_width, pdf.get_y() + tag_height)
                pdf.cell(w = tag_width, h = tag_height, txt = df.iloc[index, 1], border = 0)
                pdf.set_xy(pdf.get_x()-tag_width, pdf.get_y() + tag_height)
                pdf.cell(w = tag_width, h = tag_height, txt = "R" + "{:0.2f}".format(df.at[index, price_chosen]*1.15), border = 0)
                pdf.set_xy(pdf.get_x(),pdf.get_y()-2*tag_height)
                #create border around all three cells
                pdf.rect(pdf.get_x()-tag_width, pdf.get_y(), tag_width, 3*tag_height)
        
            else:
            #if not create new tags on new full tag line (tag_height * 3)
                pdf.set_xy(x_initial, pdf.get_y() + tag_height*3)
                pdf.cell(w = tag_width, h = tag_height, txt = df.iloc[index, 0], border = 0)
                pdf.set_xy(pdf.get_x()-tag_width, pdf.get_y() + tag_height)
                pdf.cell(w = tag_width, h = tag_height, txt = df.iloc[index, 1], border = 0)
                pdf.set_xy(pdf.get_x()-tag_width, pdf.get_y() + tag_height)
                pdf.cell(w = tag_width, h = tag_height, txt = "R" + "{:0.2f}".format(df.at[index, price_chosen]*1.15), border = 0)
                pdf.set_xy(pdf.get_x(),pdf.get_y()-2*tag_height)
                #create border around all three cells
                pdf.rect(pdf.get_x()-tag_width, pdf.get_y(), tag_width, 3*tag_height)
    
        #store output pdf in memory
        final_pdf = pdf.output("test.pdf")

        #reading the saved pdf file and storing it as PDFbyte
        with open("test.pdf", "rb") as pdf_file:
            PDFbyte = pdf_file.read()

        #creating a download button to download above pdf
        st.download_button(label="Download Printable PDF", 
                data=PDFbyte,
                file_name="PriceTags.pdf",
                mime='application/octet-stream')


