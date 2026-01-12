# ==========================================================
# HealthSense AI Pro
# End-to-End Health Analytics & Prediction Platform
# Pure Python | Streamlit | ML | Statistics | PDF
# ==========================================================

import streamlit as st
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import plotly.express as px
import kagglehub
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from scipy import stats
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime

# ---------------- PAGE CONFIG ----------------
st.set_page_config(
    page_title="HealthSense AI Pro",
    page_icon="🩺",
    layout="wide"
)

# ---------------- CUSTOM CSS ----------------
st.markdown("""
<style>
body {background-color:#0e1117;}
.card {
    background-color:#1c1f26;
    padding:18px;
    border-radius:14px;
    text-align:center;
}
.card-title {color:#9aa4b2;font-size:14px;}
.card-value {color:white;font-size:28px;font-weight:bold;}
</style>
""", unsafe_allow_html=True)

# ---------------- TITLE ----------------
st.markdown("## 🩺 HealthSense AI Pro")
st.markdown("### Fast Food & Lifestyle Health Risk Analytics Platform")

# ---------------- LOAD DATA ----------------
@st.cache_data
def load_data():
    path = kagglehub.dataset_download(
        "prince7489/fast-food-consumption-and-health-impact-dataset"
    )
    csv_path = os.path.join(
        path, "fast_food_consumption_health_impact_dataset.csv"
    )
    return pd.read_csv(csv_path)

df = load_data()

# ---------------- TARGET CREATION ----------------
def health_risk(score):
    if score <= 3:
        return "High"
    elif score <= 6:
        return "Medium"
    else:
        return "Low"

df["Health_Risk"] = df["Overall_Health_Score"].apply(health_risk)

# ---------------- FEATURES ----------------
features = [
    'Age',
    'Fast_Food_Meals_Per_Week',
    'Average_Daily_Calories',
    'BMI',
    'Physical_Activity_Hours_Per_Week',
    'Sleep_Hours_Per_Day',
    'Energy_Level_Score',
    'Doctor_Visits_Per_Year'
]

X = df[features]
y = df["Health_Risk"]

# ---------------- ENCODING & SCALING ----------------
le = LabelEncoder()
y_enc = le.fit_transform(y)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ---------------- TRAIN / TEST ----------------
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y_enc,
    test_size=0.2,
    random_state=42,
    stratify=y_enc
)

# ---------------- ML MODELS ----------------
ml_model = GradientBoostingClassifier(
    n_estimators=250,
    learning_rate=0.05,
    max_depth=3,
    random_state=42
)
ml_model.fit(X_train, y_train)

prob_model = LogisticRegression(max_iter=1000)
prob_model.fit(X_train, y_train)

accuracy = accuracy_score(y_test, ml_model.predict(X_test))

# ---------------- METRIC CARDS ----------------
c1, c2, c3, c4 = st.columns(4)

with c1:
    st.markdown(f"""
    <div class="card">
        <div class="card-title">Dataset Size</div>
        <div class="card-value">{df.shape[0]}</div>
    </div>
    """, unsafe_allow_html=True)

with c2:
    st.markdown(f"""
    <div class="card">
        <div class="card-title">Features</div>
        <div class="card-value">{len(features)}</div>
    </div>
    """, unsafe_allow_html=True)

with c3:
    st.markdown(f"""
    <div class="card">
        <div class="card-title">ML Model</div>
        <div class="card-value">GBM</div>
    </div>
    """, unsafe_allow_html=True)

with c4:
    st.markdown(f"""
    <div class="card">
        <div class="card-title">Accuracy</div>
        <div class="card-value">{accuracy*100:.1f}%</div>
    </div>
    """, unsafe_allow_html=True)

# ---------------- TABS ----------------
tab1, tab2, tab3, tab4, tab5 = st.tabs(
    ["📊 Overview", "📈 EDA", "🤖 ML Model", "📐 Statistics", "🧪 Prediction"]
)

# ---------------- OVERVIEW ----------------
with tab1:
    st.subheader("Dataset Preview")
    st.dataframe(df.head())
    st.markdown("""
    **Goal:**  
    Predict health risk using lifestyle & dietary habits.

    **Outputs:**  
    - Risk Category  
    - Probability (%)  
    - Statistical justification  
    - PDF health report
    """)

# ---------------- EDA ----------------
with tab2:
    col1, col2 = st.columns(2)

    with col1:
        fig = px.scatter(
            df,
            x="Fast_Food_Meals_Per_Week",
            y="BMI",
            color="Health_Risk",
            title="Fast Food vs BMI"
        )
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        fig = px.scatter(
            df,
            x="Sleep_Hours_Per_Day",
            y="Energy_Level_Score",
            trendline="ols",
            title="Sleep vs Energy"
        )
        st.plotly_chart(fig, use_container_width=True)

    st.subheader("Correlation Heatmap")
    corr = df.select_dtypes(include="number").corr()
    plt.figure(figsize=(10,5))
    sns.heatmap(corr, cmap="coolwarm")
    st.pyplot(plt)

# ---------------- ML MODEL ----------------
with tab3:
    st.subheader("Machine Learning Model")
    st.metric("Model Accuracy", f"{accuracy*100:.2f}%")

    importance = pd.Series(
        ml_model.feature_importances_,
        index=features
    ).sort_values()

    st.subheader("Feature Importance")
    st.bar_chart(importance)

# ---------------- STATISTICS ----------------
with tab4:
    st.subheader("Statistical Analysis")

    st.markdown("### Correlation with Overall Health Score")
    corr_health = df[features + ['Overall_Health_Score']].corr()['Overall_Health_Score']
    st.dataframe(corr_health.sort_values(ascending=False))

    st.markdown("### Hypothesis Test: Fast Food Impact")
    low_ff = df[df['Fast_Food_Meals_Per_Week'] <= 3]['Overall_Health_Score']
    high_ff = df[df['Fast_Food_Meals_Per_Week'] >= 10]['Overall_Health_Score']

    t_stat, p_val = stats.ttest_ind(low_ff, high_ff)

    st.write(f"T-Statistic: **{t_stat:.2f}**")
    st.write(f"P-Value: **{p_val:.4f}**")

    if p_val < 0.05:
        st.success("Statistically significant difference detected")
    else:
        st.info("No statistically significant difference detected")

# ---------------- PDF REPORT FUNCTION ----------------
def generate_pdf(user_data, risk, prob):
    file_name = "Health_Risk_Report.pdf"
    c = canvas.Canvas(file_name, pagesize=A4)
    w, h = A4
    y = h - 40

    c.setFont("Helvetica-Bold", 16)
    c.drawString(40, y, "HealthSense AI – Health Risk Report")
    y -= 30

    c.setFont("Helvetica", 11)
    for k, v in user_data.items():
        c.drawString(40, y, f"{k}: {v}")
        y -= 15

    y -= 20
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, y, f"Predicted Risk Level: {risk}")
    y -= 15
    c.drawString(40, y, f"Risk Probability: {prob:.1f}%")

    y -= 30
    c.setFont("Helvetica", 10)
    c.drawString(
        40, y,
        "Disclaimer: This report is AI-generated for educational purposes only."
    )

    c.drawString(40, y-20, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M')}")

    c.save()
    return file_name

# ---------------- PREDICTION ----------------
with tab5:
    st.subheader("Predict Health Risk")

    col1, col2 = st.columns(2)

    with col1:
        age = st.slider("Age", 18, 60, 30)
        fast_food = st.slider("Fast Food Meals / Week", 0, 14, 5)
        calories = st.slider("Daily Calories", 1600, 3500, 2500)
        bmi = st.slider("BMI", 18.0, 35.0, 25.0)

    with col2:
        activity = st.slider("Physical Activity (hrs/week)", 0.0, 10.0, 4.0)
        sleep = st.slider("Sleep Hours / Day", 4.0, 9.0, 6.5)
        energy = st.slider("Energy Level (1–9)", 1, 9, 5)
        doctor = st.slider("Doctor Visits / Year", 0, 12, 5)

    if st.button("🔍 Predict"):
        sample = [[
            age, fast_food, calories, bmi,
            activity, sleep, energy, doctor
        ]]

        sample_scaled = scaler.transform(sample)
        pred = ml_model.predict(sample_scaled)
        proba = prob_model.predict_proba(sample_scaled)[0]

        risk_label = le.inverse_transform(pred)[0]
        risk_percent = np.max(proba) * 100

        if risk_label == "High":
            st.error(f"⚠️ High Health Risk ({risk_percent:.1f}%)")
        elif risk_label == "Medium":
            st.warning(f"⚠️ Medium Health Risk ({risk_percent:.1f}%)")
        else:
            st.success(f"✅ Low Health Risk ({risk_percent:.1f}%)")

        user_info = {
            "Age": age,
            "Fast Food Meals / Week": fast_food,
            "BMI": bmi,
            "Physical Activity": activity,
            "Sleep Hours": sleep
        }

        pdf_file = generate_pdf(user_info, risk_label, risk_percent)

        with open(pdf_file, "rb") as f:
            st.download_button(
                "📄 Download PDF Health Report",
                f,
                file_name="Health_Risk_Report.pdf",
                mime="application/pdf"
            )

# ---------------- FOOTER ----------------
st.markdown("---")
st.caption("HealthSense AI Pro | Streamlit • ML • Statistics • PDF | Pure Python")
