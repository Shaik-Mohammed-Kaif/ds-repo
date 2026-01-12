import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import numpy as np
from datetime import datetime
from io import BytesIO
import base64
import PyPDF2
import docx

# --- Page Config ---
st.set_page_config(page_title="360° Interactive Dashboard", layout="wide", initial_sidebar_state="expanded")

# --- CSS Styling ---
st.markdown("""
<style>
.main {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px;
    border-radius: 10px;
}
.stButton>button {
    background: linear-gradient(45deg, #4b6cb7, #182848);
    color: white;
    border-radius: 8px;
    padding: 10px 20px;
    transition: all 0.3s ease;
}
.stButton>button:hover {
    background: linear-gradient(45deg, #182848, #4b6cb7);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transform: translateY(-2px);
}
.kpi-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    padding: 15px;
    margin: 10px;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}
.kpi-card:hover { transform: scale(1.05); }
.sidebar .sidebar-content { background: #2c3e50; color: white; border-radius: 10px; }
</style>
""", unsafe_allow_html=True)

# --- Session State Initialization ---
for key in ['dataframes', 'filtered_df', 'numeric_cols', 'categorical_cols', 'date_cols']:
    if key not in st.session_state:
        st.session_state[key] = [] if 'cols' in key or key=='dataframes' else None

# --- Utility Functions ---
def extract_text_from_pdf(file):
    pdf_reader = PyPDF2.PdfReader(file)
    text = "".join([page.extract_text() or "" for page in pdf_reader.pages])
    return text

def extract_text_from_docx(file):
    doc = docx.Document(file)
    return "\n".join([para.text for para in doc.paragraphs])

def text_to_dataframe(text):
    lines = text.split("\n")
    data = [line.split() for line in lines if line.strip()]
    return pd.DataFrame(data) if data else pd.DataFrame()

def detect_data_types(df):
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    date_cols = []
    for col in categorical_cols.copy():
        try:
            df[col] = pd.to_datetime(df[col])
            date_cols.append(col)
            categorical_cols.remove(col)
        except:
            continue
    return numeric_cols, categorical_cols, date_cols

def clean_data(df):
    df = df.dropna(how='all').fillna(0)
    return df

def create_kpi_card(title, value, delta=None):
    delta_str = f" ({delta:+.2%})" if delta else ""
    st.markdown(f"""
        <div class="kpi-card">
            <h4>{title}</h4>
            <h2>{value:,.2f}{delta_str}</h2>
        </div>
    """, unsafe_allow_html=True)

def get_image_download_link(fig, filename, text):
    buf = BytesIO()
    fig.write_image(buf, format="png")
    b64 = base64.b64encode(buf.getvalue()).decode()
    return f'<a href="data:image/png;base64,{b64}" download="{filename}">{text}</a>'

def get_html_download_link(fig, filename, text):
    buf = BytesIO()
    fig.write_html(buf, include_plotlyjs="cdn")
    b64 = base64.b64encode(buf.getvalue()).decode()
    return f'<a href="data:text/html;base64,{b64}" download="{filename}">{text}</a>'

# --- Sidebar: File Upload & Filters ---
with st.sidebar:
    st.header("Controls")
    uploaded_files = st.file_uploader("Upload Files (CSV, Excel, PDF, DOCX)", accept_multiple_files=True, type=['csv','xlsx','xls','pdf','docx'])

    if uploaded_files:
        dfs = []
        for f in uploaded_files:
            ext = f.name.split('.')[-1].lower()
            try:
                if ext=='csv': dfs.append(pd.read_csv(f))
                elif ext in ['xls','xlsx']: dfs.append(pd.read_excel(f))
                elif ext=='pdf': dfs.append(text_to_dataframe(extract_text_from_pdf(f)))
                elif ext=='docx': dfs.append(text_to_dataframe(extract_text_from_docx(f)))
            except Exception as e: st.error(f"Error {f.name}: {str(e)}")
        if dfs:
            df = pd.concat(dfs, ignore_index=True)
            df = clean_data(df)
            st.session_state.dataframes = [df]
            st.session_state.filtered_df = df.copy()
            st.session_state.numeric_cols, st.session_state.categorical_cols, st.session_state.date_cols = detect_data_types(df)

    if st.session_state.dataframes:
        st.subheader("Filters")
        df = st.session_state.filtered_df
        # Numeric filters
        for col in st.session_state.numeric_cols:
            min_val, max_val = float(df[col].min()), float(df[col].max())
            rng = st.slider(f"{col} Range", min_val, max_val, (min_val,max_val))
            df = df[(df[col]>=rng[0]) & (df[col]<=rng[1])]
        # Categorical filters
        for col in st.session_state.categorical_cols:
            opts = st.session_state.dataframes[0][col].unique()
            sel = st.multiselect(f"{col}", opts, default=opts)
            df = df[df[col].isin(sel)]
        # Date filters
        for col in st.session_state.date_cols:
            min_date = pd.to_datetime(st.session_state.dataframes[0][col].min()).date()
            max_date = pd.to_datetime(st.session_state.dataframes[0][col].max()).date()
            date_rng = st.date_input(f"{col} Range", [min_date,max_date])
            if len(date_rng)==2:
                df = df[(pd.to_datetime(df[col]).dt.date>=date_rng[0]) & (pd.to_datetime(df[col]).dt.date<=date_rng[1])]
        st.session_state.filtered_df = df

        if st.button("Reset Filters"):
            st.session_state.filtered_df = st.session_state.dataframes[0].copy()

# --- Main Dashboard ---
st.title("360° Interactive Dashboard")
st.markdown("Upload datasets and explore interactive insights.")

if st.session_state.dataframes:
    df = st.session_state.filtered_df

    # KPI Cards (middle-aligned)
    st.header("Key Metrics")
    kpi_cols = st.columns(min(4,len(st.session_state.numeric_cols)))
    for i, col in enumerate(st.session_state.numeric_cols[:4]):
        with kpi_cols[i]:
            create_kpi_card(f"Sum of {col}", df[col].sum())
            create_kpi_card(f"Avg of {col}", df[col].mean())

    # Tabs for visualizations
    tab1, tab2, tab3, tab4 = st.tabs(["Charts","Correlation","Table","Insights"])

    with tab1:
        st.header("Interactive Charts")
        chart_types = ["Line","Bar","Scatter","Pie","Histogram","Area","Heatmap"]
        selected_chart = st.selectbox("Chart Type", chart_types)
        if st.session_state.numeric_cols:
            x_axis = st.selectbox("X-Axis", st.session_state.numeric_cols + st.session_state.categorical_cols + st.session_state.date_cols)
            y_axis = st.selectbox("Y-Axis", st.session_state.numeric_cols)
            fig = None
            if selected_chart=="Line": fig = px.line(df, x=x_axis, y=y_axis, title=f"{y_axis} vs {x_axis}")
            elif selected_chart=="Bar": fig = px.bar(df, x=x_axis, y=y_axis, title=f"{y_axis} vs {x_axis}")
            elif selected_chart=="Scatter": fig = px.scatter(df, x=x_axis, y=y_axis, title=f"{y_axis} vs {x_axis}")
            elif selected_chart=="Pie": fig = px.pie(df, names=x_axis, values=y_axis, title=f"{y_axis} Distribution")
            elif selected_chart=="Histogram": fig = px.histogram(df, x=x_axis, y=y_axis, title=f"{y_axis} Histogram")
            elif selected_chart=="Area": fig = px.area(df, x=x_axis, y=y_axis, title=f"{y_axis} vs {x_axis}")
            elif selected_chart=="Heatmap" and len(st.session_state.numeric_cols)>=2:
                corr = df[st.session_state.numeric_cols].corr()
                fig = px.imshow(corr, text_auto=True, title="Correlation Heatmap")
            if fig:
                fig.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
                st.plotly_chart(fig, use_container_width=True)
                st.markdown(get_image_download_link(fig,"chart.png","Download PNG"),unsafe_allow_html=True)
                st.markdown(get_html_download_link(fig,"chart.html","Download HTML"),unsafe_allow_html=True)

    with tab2:
        st.header("Correlation Matrix")
        if st.session_state.numeric_cols:
            corr = df[st.session_state.numeric_cols].corr()
            fig = px.imshow(corr, text_auto=True, color_continuous_scale="RdBu", title="Correlation Heatmap")
            st.plotly_chart(fig, use_container_width=True)

    with tab3:
        st.header("Data Table")
        st.dataframe(df,use_container_width=True)

    with tab4:
        st.header("Insights")
        for col in st.session_state.numeric_cols[:3]:
            st.markdown(f"**{col}** - Max: {df[col].max():,.2f}, Min: {df[col].min():,.2f}, Avg: {df[col].mean():,.2f}")
else:
    st.info("Please upload a dataset to start exploring.")

# --- Refresh Dashboard ---
if st.button("Refresh Dashboard"):
    for key in ['dataframes','filtered_df','numeric_cols','categorical_cols','date_cols']:
        st.session_state[key] = [] if 'cols' in key or key=='dataframes' else None
    st.experimental_rerun()
