# ======================================================
# NETFLIX-STYLE MOVIE RECOMMENDER SYSTEM (STREAMLIT)
# Author: Mohammed Kaif
# ======================================================

import pickle
import streamlit as st
import requests
from pathlib import Path

# ------------------------------------------------------
# PAGE CONFIG
# ------------------------------------------------------
st.set_page_config(
    page_title="Netflix AI Movie Recommender",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ------------------------------------------------------
# CUSTOM CSS (NETFLIX UI)
# ------------------------------------------------------
st.markdown("""
<style>
body {
    background-color: #0f0f0f;
}
.movie-title {
    font-size: 15px;
    font-weight: bold;
    text-align: center;
    margin-top: 6px;
}
.netflix-btn {
    background-color: #e50914;
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    text-align: center;
    display: inline-block;
    margin-top: 6px;
    text-decoration: none;
}
.netflix-btn:hover {
    background-color: #b20710;
}
progress {
    width: 100%;
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
# LOAD DATA (PKL FILES)
# ------------------------------------------------------
@st.cache_data(show_spinner=True)
def load_data():
    base_dir = Path(__file__).parent

    with open(base_dir / "movie_list.pkl", "rb") as f:
        movies = pickle.load(f)

    with open(base_dir / "similarity.pkl", "rb") as f:
        similarity = pickle.load(f)

    return movies, similarity

movies, similarity = load_data()

# ------------------------------------------------------
# FETCH POSTER (SAFE & STABLE)
# ------------------------------------------------------
@st.cache_data(show_spinner=False)
def fetch_poster(movie_id):
    try:
        url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}"
        response = requests.get(url, timeout=5)

        if response.status_code != 200:
            return "https://via.placeholder.com/500x750?text=No+Poster"

        data = response.json()
        poster_path = data.get("poster_path")

        if poster_path:
            return POSTER_BASE + poster_path
    except:
        pass

    return "https://via.placeholder.com/500x750?text=No+Poster"

# ------------------------------------------------------
# RECOMMENDATION ENGINE (CONTENT-BASED ML)
# ------------------------------------------------------
def recommend(movie_title, top_n=5):
    matches = movies[movies["title"] == movie_title]

    if matches.empty:
        return []

    index = matches.index[0]
    similarity_scores = list(enumerate(similarity[index]))
    similarity_scores = sorted(
        similarity_scores, key=lambda x: x[1], reverse=True
    )[1: top_n + 1]

    recommendations = []
    for i, score in similarity_scores:
        row = movies.iloc[i]
        recommendations.append({
            "title": row.title,
            "movie_id": row.movie_id,
            "poster": fetch_poster(row.movie_id),
            "match": int(score * 100)
        })

    return recommendations

# ------------------------------------------------------
# SIDEBAR UI
# ------------------------------------------------------
st.sidebar.markdown("## 🎥 Netflix AI Recommender")
st.sidebar.markdown("Content-Based Machine Learning Engine")
st.sidebar.markdown("---")

search_query = st.sidebar.text_input("🔍 Search Movie")

filtered_titles = movies["title"]

if search_query:
    filtered_titles = movies[
        movies["title"].str.contains(search_query, case=False, na=False)
    ]["title"]

if filtered_titles.empty:
    st.sidebar.warning("No movies found")
    st.stop()

selected_movie = st.sidebar.selectbox(
    "🎬 Select a movie",
    filtered_titles
)

top_n = st.sidebar.slider(
    "Number of recommendations",
    min_value=3,
    max_value=10,
    value=5
)

# ------------------------------------------------------
# MAIN HEADER
# ------------------------------------------------------
st.markdown("""
<h1 style='color:#E50914;text-align:center;'>🎬 Netflix-Style Movie Recommender</h1>
<p style='text-align:center;font-size:18px;'>
Powered by Machine Learning & Cosine Similarity
</p>
""", unsafe_allow_html=True)

# ------------------------------------------------------
# RECOMMEND BUTTON
# ------------------------------------------------------
if st.button("🍿 Recommend Movies"):
    with st.spinner("Finding similar movies..."):
        recommendations = recommend(selected_movie, top_n)

    if not recommendations:
        st.error("No recommendations found.")
        st.stop()

    st.subheader("✨ Because you watched:")
    st.markdown(f"### 🎥 **{selected_movie}**")

    cols = st.columns(len(recommendations))

    for idx, rec in enumerate(recommendations):
        with cols[idx]:
            st.image(rec["poster"], use_container_width=True)
            st.markdown(f"<div class='movie-title'>{rec['title']}</div>", unsafe_allow_html=True)
            st.progress(rec["match"] / 100)
            st.markdown(f"<div style='text-align:center;'>{rec['match']}% Match</div>", unsafe_allow_html=True)
            st.markdown(
                f"<a href='{TMDB_LINK}{rec['movie_id']}' target='_blank' class='netflix-btn'>View on TMDB</a>",
                unsafe_allow_html=True
            )

# ------------------------------------------------------
# FOOTER
# ------------------------------------------------------
st.markdown("""
<hr>
<p style='text-align:center;color:gray;'>
Netflix-Style AI Recommender | Streamlit + Machine Learning<br>
Built by Mohammed Kaif
</p>
""", unsafe_allow_html=True)
