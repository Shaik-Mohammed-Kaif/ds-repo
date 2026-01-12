import pickle
import streamlit as st
import requests

# -------------------------------
# CONFIG
# -------------------------------
st.set_page_config(
    page_title="Movie Recommender",
    page_icon="🎬",
    layout="wide"
)

# -------------------------------
# TMDB POSTER FETCH
# -------------------------------
API_KEY = "8265bd1679663a7ea12ac168da84d2e8"

def fetch_poster(movie_id):
    try:
        url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={API_KEY}&language=en-US"
        response = requests.get(url, timeout=5).json()
        poster_path = response.get("poster_path")

        if poster_path:
            return "https://image.tmdb.org/t/p/w500/" + poster_path
        else:
            return "https://via.placeholder.com/500x750?text=No+Image"
    except:
        return "https://via.placeholder.com/500x750?text=Error"

# -------------------------------
# RECOMMENDATION FUNCTION
# -------------------------------
def recommend(movie_title):
    try:
        index = movies[movies["title"] == movie_title].index[0]
    except IndexError:
        return [], []

    distances = sorted(
        list(enumerate(similarity[index])),
        reverse=True,
        key=lambda x: x[1]
    )

    recommended_names = []
    recommended_posters = []

    for i in distances[1:6]:
        movie_id = movies.iloc[i[0]].movie_id
        recommended_names.append(movies.iloc[i[0]].title)
        recommended_posters.append(fetch_poster(movie_id))

    return recommended_names, recommended_posters

# -------------------------------
# LOAD DATA
# -------------------------------
@st.cache_data
def load_data():
    movies = pickle.load(open("movie_list.pkl", "rb"))
    similarity = pickle.load(open("similarity.pkl", "rb"))
    return movies, similarity

movies, similarity = load_data()

# -------------------------------
# UI
# -------------------------------
st.title("🎬 Movie Recommender System")
st.markdown("Get **movie recommendations** based on similarity using **Machine Learning**.")

movie_list = movies["title"].values
selected_movie = st.selectbox(
    "🎥 Select a movie",
    movie_list
)

# -------------------------------
# BUTTON ACTION
# -------------------------------
if st.button("🚀 Show Recommendation"):
    names, posters = recommend(selected_movie)

    if len(names) == 0:
        st.error("Movie not found!")
    else:
        cols = st.columns(5)
        for i in range(5):
            with cols[i]:
                st.text(names[i])
                st.image(posters[i])
