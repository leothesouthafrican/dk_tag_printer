import streamlit as st
import pandas as pd
from fpdf import FPDF
import base64
import webbrowser

st.header("DasKasas Tag Tool")

test_list = ["Leo", "Luis", "Luisa", "Luisito", "Luisito Jr", "Jason", "Bobby", "Woody", "Buzz", "Jake","Luca", "John"]
test_list2 = ["Leo", "Luis", "Luisa", "Luisito", "Luisito Jr", "Jason", "Bobby"]

with st.sidebar:
    csv = st.file_uploader("Please Upload Updated CSV Export from DEAR Inventory.")
    tag_height = st.number_input("Tag Height (mm)", min_value=0, max_value=100, value=34)/3
    tag_width = st.number_input("Tag Width (mm)", min_value=0, max_value=100, value=60)

if csv:
    st.subheader("CSV file uploaded, please confirm below:")
    df = pd.read_csv(csv)
    st.dataframe(df)

    #Getting list of price columns
    price_columns = df.filter(regex='Price').columns

    with st.sidebar:
        price_chosen = st.selectbox("Select Price Regime", price_columns,4)

    #Search box for filtering by item name
    selected_products = st.multiselect("Select Products", df.ProductCode.unique())
    
    #Creating and displaying a df with only selected products
    df = df.loc[df["ProductCode"].isin(selected_products)]
    df = df.reset_index(drop=True)
    st.dataframe(df)

    button = st.button("Process Tags")

    if button:

        #Creating pdf object

        # Instantiation of inherited class
        pdf = FPDF(unit= "mm", format = "A4")
        pdf.add_page("L")
        pdf.set_font('Arial', 'B', 8)

        #Adding horizontal lines to pdf
        pdf.line(pdf.l_margin - 2, 0, pdf.l_margin - 2, pdf.h)
        pdf.line(tag_width + 8, 0, tag_width + 8, pdf.h)
        pdf.line(tag_width *2 + 8, 0, tag_width * 2 + 8, pdf.h)
        pdf.line(tag_width *3 + 8, 0, tag_width * 3 + 8, pdf.h)
        pdf.line(tag_width *4 + 8, 0, tag_width * 4 + 8, pdf.h)

        #Adding vertical lines to pdf
        pdf.line(0, tag_height, pdf.w, tag_height)
        pdf.line(0, tag_height *4, pdf.w, tag_height * 4)
        pdf.line(0, tag_height *7, pdf.w, tag_height * 7)
        pdf.line(0, tag_height *10, pdf.w, tag_height * 10)
        pdf.line(0, tag_height *13, pdf.w, tag_height * 13)
        pdf.line(0, tag_height *16, pdf.w, tag_height * 16)

        #Getting initial x and y coordinates
        y_initial = pdf.get_y()
        x_initial = pdf.get_x()
        offset = pdf.x + tag_width
        effective_page_width = pdf.w - 2*pdf.l_margin
        effective_page_height = pdf.h - 2*pdf.t_margin

        print("df shape:", df.shape)
        print("effective page width:", effective_page_width)
        print("inital x:", pdf.w)
        print("inital y:", pdf.h)
        
        for index in df.index:
            if pdf.get_x() < (pdf.w - pdf.l_margin - tag_width):
                pdf.cell(w = tag_width, h = tag_height, txt = df.iloc[index, 0], border = 0)
                pdf.set_xy(pdf.get_x()-tag_width, pdf.get_y() + tag_height)
                pdf.cell(w = tag_width, h = tag_height, txt = df.iloc[index, 1], border = 0)
                pdf.set_xy(pdf.get_x()-tag_width, pdf.get_y() + tag_height)
                pdf.cell(w = tag_width, h = tag_height, txt = "R" + "{:0.2f}".format(df.at[index, price_chosen]*1.15), border = 0)
                pdf.set_xy(pdf.get_x(),pdf.get_y()-2*tag_height)
            #pdf.ln()
            else:
                pdf.set_xy(x_initial, pdf.get_y() + tag_height*3)
                pdf.cell(w = tag_width, h = tag_height, txt = df.iloc[index, 0], border = 0)
                pdf.set_xy(pdf.get_x()-tag_width, pdf.get_y() + tag_height)
                pdf.cell(w = tag_width, h = tag_height, txt = df.iloc[index, 1], border = 0)
                pdf.set_xy(pdf.get_x()-tag_width, pdf.get_y() + tag_height)
                pdf.cell(w = tag_width, h = tag_height, txt = "R" + "{:0.2f}".format(df.at[index, price_chosen]*1.15), border = 0)
                pdf.set_xy(pdf.get_x(),pdf.get_y()-2*tag_height)
    

        final_pdf = pdf.output("test.pdf")

        def show_pdf(file_path):
            with open(file_path,"rb") as f:
                base64_pdf = base64.b64encode(f.read()).decode('utf-8')
            pdf_display = f'<iframe src="data:application/pdf;base64,{base64_pdf}" width="800" height="800" type="application/pdf"></iframe>'
            st.markdown(pdf_display, unsafe_allow_html=True)

        show_pdf("test.pdf")


        with open("test.pdf", "rb") as pdf_file:
            PDFbyte = pdf_file.read()

        st.download_button(label="Download Printable PDF", 
                data=PDFbyte,
                file_name="PriceTags.pdf",
                mime='application/octet-stream')


