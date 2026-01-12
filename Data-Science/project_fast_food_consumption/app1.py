# ==========================================================
# HealthSense AI Pro
# Professional Health Analytics Web App
# Streamlit | ML | Stats | Visualization | PDF
# ==========================================================

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import seaborn as sns
import matplotlib.pyplot as plt
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix
from scipy import stats
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime

# ----------------------------------------------------------
# PAGE CONFIG
# ----------------------------------------------------------
st.set_page_config(
    page_title="HealthSense AI Pro",
    page_icon="🩺",
    layout="wide"
)

# ----------------------------------------------------------
# PREMIUM DARK UI
# ----------------------------------------------------------
st.markdown("""
<style>
/* ---------- THEME VARIABLES ---------- */
:root {
    --bg-main: linear-gradient(120deg, #0f2027, #203a43, #2c5364);
    --card-bg: #161b22;
    --text-main: white;
}

/* ---------- BODY ---------- */
body {
    background: var(--bg-main);
}

/* ---------- CARD ---------- */
.card {
    background: var(--card-bg);
    padding:20px;
    border-radius:16px;
    text-align:center;
    box-shadow:0 0 20px rgba(0,0,0,0.5);
}
.card-title {color:#9aa4b2;font-size:14px;}
.card-value {color:var(--text-main);font-size:30px;font-weight:bold;}

/* ---------- ANIMATED PROGRESS ---------- */
.progress-wrap {
    background:#0d1117;
    border-radius:10px;
    overflow:hidden;
    height:14px;
    margin-top:8px;
}
.progress-bar {
    height:14px;
    width:0%;
    background: linear-gradient(90deg, #00f2ff, #00ff88);
    animation: loadbar 1.6s ease-out forwards;
}
@keyframes loadbar {
    from { width: 0%; }
    to { width: var(--value); }
}

/* ---------- BUBBLES ---------- */
.bubble {
    position: fixed;
    width: 160px;
    height: 160px;
    background: rgba(0,255,255,0.08);
    border-radius: 50%;
    animation: float 20s infinite ease-in-out;
    z-index:-1;
}
@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-80px); }
    100% { transform: translateY(0px); }
}

/* ---------- SIDEBAR ---------- */
section[data-testid="stSidebar"] {
    background: linear-gradient(180deg, #0b1220, #111827);
}

/* ---------- HOVER EFFECTS ---------- */
div[data-testid="stPlotlyChart"] {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
div[data-testid="stPlotlyChart"]:hover {
    transform: scale(1.02);
    box-shadow: 0 0 25px rgba(0,255,255,0.3);
}
</style>

<div class="bubble" style="top:10%; left:5%;"></div>
<div class="bubble" style="top:65%; left:85%;"></div>
<div class="bubble" style="top:40%; left:45%;"></div>
""", unsafe_allow_html=True)

# ----------------------------------------------------------
# TITLE
# ----------------------------------------------------------
st.markdown("## 🩺 **HealthSense AI Pro**")
st.markdown("### Fast Food & Lifestyle Health Risk Analytics Platform")

# ----------------------------------------------------------
# LOAD STATIC DATASET (SAFE)
# ----------------------------------------------------------
@st.cache_data
def load_data():
    base_dir = Path(__file__).parent
    return pd.read_csv(
        base_dir / "fast_food_consumption_health_impact_dataset.csv"
    )

df = load_data()

# ----------------------------------------------------------
# TARGET CREATION
# ----------------------------------------------------------
def health_risk(score):
    if score <= 3:
        return "High"
    elif score <= 6:
        return "Medium"
    else:
        return "Low"

df["Health_Risk"] = df["Overall_Health_Score"].apply(health_risk)

# ----------------------------------------------------------
# FEATURES
# ----------------------------------------------------------
features = [
    "Age",
    "Fast_Food_Meals_Per_Week",
    "Average_Daily_Calories",
    "BMI",
    "Physical_Activity_Hours_Per_Week",
    "Sleep_Hours_Per_Day",
    "Energy_Level_Score",
    "Doctor_Visits_Per_Year"
]

X = df[features]
y = df["Health_Risk"]

# ----------------------------------------------------------
# ENCODING & SCALING
# ----------------------------------------------------------
le = LabelEncoder()
y_enc = le.fit_transform(y)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ----------------------------------------------------------
# TRAIN / TEST SPLIT
# ----------------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y_enc,
    test_size=0.2,
    random_state=42,
    stratify=y_enc
)

# ----------------------------------------------------------
# ML MODELS
# ----------------------------------------------------------
gbm = GradientBoostingClassifier(
    n_estimators=300,
    learning_rate=0.05,
    random_state=42
)
gbm.fit(X_train, y_train)

logit = LogisticRegression(max_iter=1000)
logit.fit(X_train, y_train)

accuracy = accuracy_score(y_test, gbm.predict(X_test))

# ----------------------------------------------------------
# METRIC CARDS
# ----------------------------------------------------------
c1, c2, c3, c4 = st.columns(4)

with c1:
    st.markdown(f"<div class='card'><div class='card-title'>Records</div><div class='card-value'>{df.shape[0]}</div></div>", unsafe_allow_html=True)
with c2:
    st.markdown(f"<div class='card'><div class='card-title'>Features</div><div class='card-value'>{len(features)}</div></div>", unsafe_allow_html=True)
with c3:
    st.markdown("<div class='card'><div class='card-title'>ML Model</div><div class='card-value'>GBM</div></div>", unsafe_allow_html=True)
with c4:
    st.markdown(f"<div class='card'><div class='card-title'>Accuracy</div><div class='card-value'>{accuracy*100:.1f}%</div></div>", unsafe_allow_html=True)

# ----------------------------------------------------------
# TABS
# ----------------------------------------------------------
tab1, tab2, tab3, tab4, tab5 = st.tabs(
    ["📊 Overview", "📈 Visual Insights", "🤖 ML Model", "📐 Statistics", "🧪 Prediction"]
)

# ----------------------------------------------------------
# OVERVIEW
# ----------------------------------------------------------
with tab1:
    st.dataframe(df.head())
    st.markdown("""
    **This platform provides:**
    - Health risk classification
    - Lifestyle & diet analytics
    - Machine learning predictions
    - Statistical validation
    - Automated PDF health report
    """)

# ----------------------------------------------------------
# VISUAL INSIGHTS (HEAVY)
# ----------------------------------------------------------
with tab2:
    st.plotly_chart(
        px.scatter(
            df,
            x="Fast_Food_Meals_Per_Week",
            y="BMI",
            color="Health_Risk",
            size="Average_Daily_Calories",
            title="Fast Food vs BMI vs Calories"
        ),
        use_container_width=True
    )

    st.plotly_chart(
        px.scatter(
            df,
            x="Sleep_Hours_Per_Day",
            y="Energy_Level_Score",
            trendline="ols",
            title="Sleep vs Energy Level"
        ),
        use_container_width=True
    )

    st.plotly_chart(
        px.box(
            df,
            x="Health_Risk",
            y="Doctor_Visits_Per_Year",
            title="Doctor Visits by Health Risk"
        ),
        use_container_width=True
    )

    corr = df.select_dtypes("number").corr()
    fig, ax = plt.subplots(figsize=(10,5))
    sns.heatmap(corr, cmap="coolwarm", ax=ax)
    st.pyplot(fig)

# ----------------------------------------------------------
# ML MODEL TAB
# ----------------------------------------------------------
with tab3:
    st.metric("GBM Accuracy", f"{accuracy*100:.2f}%")

    importance = pd.Series(
        gbm.feature_importances_,
        index=features
    ).sort_values()

    st.subheader("Feature Importance")
    st.bar_chart(importance)

    cm = confusion_matrix(y_test, gbm.predict(X_test))
    fig, ax = plt.subplots()
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=le.classes_,
        yticklabels=le.classes_,
        ax=ax
    )
    st.pyplot(fig)

# ----------------------------------------------------------
# STATISTICS (ENHANCED)
# ----------------------------------------------------------
with tab4:
    st.subheader("📐 Statistical Analysis & Model Insights")

    # -----------------------------
    # BASIC DESCRIPTIVE STATS
    # -----------------------------
    st.markdown("### 📊 Descriptive Statistics")
    st.dataframe(df[features + ["Overall_Health_Score"]].describe().T)

    st.markdown("### Correlation with Overall Health Score")
    corr_health = df[features + ['Overall_Health_Score']].corr()['Overall_Health_Score']
    st.dataframe(corr_health.sort_values(ascending=False))

    # -----------------------------
    # GROUP STATISTICS
    # -----------------------------
    st.markdown("### 📊 Mean Feature Values by Health Risk")
    group_stats = df.groupby("Health_Risk")[features].mean()
    st.dataframe(group_stats.round(2))

    fig = px.bar(
        group_stats.reset_index(),
        x="Health_Risk",
        y="BMI",
        title="Average BMI by Health Risk",
        color="Health_Risk"
    )
    st.plotly_chart(fig, use_container_width=True)

    # -----------------------------
    # MODEL STATISTICS
    # -----------------------------
    st.markdown("### 🤖 Model Performance Statistics")

    col1, col2, col3 = st.columns(3)

    with col1:
        st.metric("Model Used", "Gradient Boosting")

    with col2:
        st.metric("Test Accuracy", f"{accuracy*100:.2f}%")

    with col3:
        st.metric("Total Samples", df.shape[0])

    # Class distribution
    st.markdown("### 🎯 Class Distribution")
    class_dist = df["Health_Risk"].value_counts()
    st.plotly_chart(
        px.pie(
            values=class_dist.values,
            names=class_dist.index,
            title="Health Risk Distribution"
        ),
        use_container_width=True
    )

    # -----------------------------
    # HYPOTHESIS TEST
    # -----------------------------
    st.markdown("### 🧪 Hypothesis Test: Fast Food Impact")

    low_ff = df[df["Fast_Food_Meals_Per_Week"] <= 3]["Overall_Health_Score"]
    high_ff = df[df["Fast_Food_Meals_Per_Week"] >= 10]["Overall_Health_Score"]

    t_stat, p_val = stats.ttest_ind(low_ff, high_ff)

    st.write(f"**T-Statistic:** {t_stat:.3f}")
    st.write(f"**P-Value:** {p_val:.5f}")

    if p_val < 0.05:
        st.success("✅ Statistically significant impact of fast food on health")
    else:
        st.info("ℹ️ No statistically significant difference detected")

    # -----------------------------
    # DISTRIBUTION VISUALS
    # -----------------------------
    st.markdown("### 📈 Distribution Analysis")

    fig = px.histogram(
        df,
        x="Overall_Health_Score",
        color="Health_Risk",
        nbins=20,
        title="Overall Health Score Distribution"
    )
    st.plotly_chart(fig, use_container_width=True)

    fig = px.box(
        df,
        x="Health_Risk",
        y="Overall_Health_Score",
        title="Health Score Distribution by Risk Level"
    )
    st.plotly_chart(fig, use_container_width=True)

# ----------------------------------------------------------
# PDF REPORT
# ----------------------------------------------------------
def generate_pdf(data, risk, prob):
    c = canvas.Canvas("Health_Report.pdf", pagesize=A4)
    y = 800

    c.setFont("Helvetica-Bold", 16)
    c.drawString(40, y, "HealthSense AI – Health Risk Report")
    y -= 40

    c.setFont("Helvetica", 11)
    for k, v in data.items():
        c.drawString(40, y, f"{k}: {v}")
        y -= 18

    y -= 20
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, y, f"Predicted Risk: {risk}")
    c.drawString(40, y-18, f"Probability: {prob:.1f}%")
    c.drawString(40, y-60, f"Generated: {datetime.now()}")

    c.save()

# ----------------------------------------------------------
# PREDICTION
# ----------------------------------------------------------
with tab5:
    age = st.slider("Age", 18, 60, 30)
    ff = st.slider("Fast Food / Week", 0, 14, 5)
    cal = st.slider("Daily Calories", 1600, 3500, 2500)
    bmi = st.slider("BMI", 18.0, 35.0, 25.0)
    act = st.slider("Activity Hours / Week", 0.0, 10.0, 4.0)
    slp = st.slider("Sleep Hours / Day", 4.0, 9.0, 6.5)
    eng = st.slider("Energy Level", 1, 9, 5)
    doc = st.slider("Doctor Visits / Year", 0, 12, 5)

    if st.button("🔍 Predict Health Risk"):
        sample = scaler.transform([[age, ff, cal, bmi, act, slp, eng, doc]])
        pred = gbm.predict(sample)
        prob = gbm.predict_proba(sample).max() * 100
        label = le.inverse_transform(pred)[0]

        st.success(f"**{label} Risk** ({prob:.1f}%)")

        generate_pdf(
            {"Age": age, "Fast Food": ff, "BMI": bmi, "Sleep": slp},
            label, prob
        )

        with open("Health_Report.pdf", "rb") as f:
            st.download_button("📄 Download PDF Report", f)

# ----------------------------------------------------------
# FOOTER
# ----------------------------------------------------------
st.caption("HealthSense AI Pro | Streamlit • Machine Learning • Statistics • Visualization")
