import pickle
import streamlit as st
import numpy as np
import requests

# ------------------------------------------------------
# PAGE CONFIG
# ------------------------------------------------------
st.set_page_config(
    page_title="Netflix AI Recommender",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ------------------------------------------------------
# CUSTOM CSS (NETFLIX STYLE)
# ------------------------------------------------------
st.markdown("""
<style>
body {
    background-color: #0f0f0f;
}
.movie-title {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
}
.netflix-btn {
    background-color: #e50914;
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    text-align: center;
    display: inline-block;
    margin-top: 6px;
}
</style>
""", unsafe_allow_html=True)

# ------------------------------------------------------
# CONSTANTS
# ------------------------------------------------------
TMDB_API_KEY = "8265bd1679663a7ea12ac168da84d2e8"
POSTER_BASE = "https://image.tmdb.org/t/p/w500/"
TMDB_LINK = "https://www.themoviedb.org/movie/"

# ------------------------------------------------------
# LOAD PICKLE FILES (ONLY TWO)
# ------------------------------------------------------
@st.cache_data
def load_data():
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    movies = pickle.load(open(os.path.join(BASE_DIR, "movie_list.pkl"), "rb"))
    similarity = pickle.load(open(os.path.join(BASE_DIR, "similarity.pkl"), "rb"))
    return movies, similarity


movies, similarity = load_models()

# ------------------------------------------------------
# POSTER FETCH (SAFE)
# ------------------------------------------------------
def fetch_poster(movie_id):
    try:
        url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}"
        data = requests.get(url, timeout=5).json()
        if data.get("poster_path"):
            return POSTER_BASE + data["poster_path"]
    except:
        pass
    return "https://via.placeholder.com/500x750?text=No+Poster"

# ------------------------------------------------------
# CORE RECOMMENDER (NETFLIX STYLE)
# ------------------------------------------------------
def recommend(movie_title, top_n=5):
    index = movies[movies["title"] == movie_title].index[0]

    scores = list(enumerate(similarity[index]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)[1:top_n+1]

    results = []
    for i, score in scores:
        row = movies.iloc[i]
        results.append({
            "title": row.title,
            "movie_id": row.movie_id,
            "poster": fetch_poster(row.movie_id),
            "match": int(score * 100)
        })

    return results

# ------------------------------------------------------
# SIDEBAR (NETFLIX FEEL)
# ------------------------------------------------------
st.sidebar.markdown("## 🎥 Netflix AI Recommender")
st.sidebar.markdown("Content-based ML engine")
st.sidebar.markdown("---")

search = st.sidebar.text_input("🔍 Search Movie")

filtered_titles = movies["title"]
if search:
    filtered_titles = movies[movies["title"].str.contains(search, case=False)]["title"]

selected_movie = st.sidebar.selectbox(
    "Select a movie",
    filtered_titles
)

# ------------------------------------------------------
# MAIN HEADER
# ------------------------------------------------------
st.markdown("""
<h1 style='color:#E50914;text-align:center;'>🎬 Netflix-Style Movie Recommender</h1>
<p style='text-align:center;font-size:18px;'>Powered by Machine Learning & NLP</p>
""", unsafe_allow_html=True)

# ------------------------------------------------------
# RECOMMEND BUTTON
# ------------------------------------------------------
if st.button("🍿 Recommend Movies"):
    recommendations = recommend(selected_movie)

    st.subheader("✨ Because you watched:")
    st.markdown(f"### 🎥 **{selected_movie}**")

    cols = st.columns(5)

    for idx, rec in enumerate(recommendations):
        with cols[idx]:
            st.image(rec["poster"], width=220)
            st.markdown(
                f"""
                <div class="movie-title">{rec['title']}</div>
                <progress value="{rec['match']}" max="100"></progress>
                <div style="text-align:center;">{rec['match']}% Match</div>
                <a href="{TMDB_LINK}{rec['movie_id']}" target="_blank" class="netflix-btn">
                    View on TMDB
                </a>
                """,
                unsafe_allow_html=True
            )

# ------------------------------------------------------
# FOOTER
# ------------------------------------------------------
st.markdown("""
<hr>
<p style='text-align:center;color:gray;'>
Netflix-style recommender | Built with Streamlit & Machine Learning
</p>
""", unsafe_allow_html=True)