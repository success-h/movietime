import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import VideoFrame from "../VideoFrame";
import Counter from "../Counter";
import { Consumer } from "../../Context";

class Home extends Component {
  state = {
    apiKey: `618b753712ed0a388d986c9e485d9a7c`,
    trailerLink: null
  };

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  setTrailer = (dispatch, movieId) => {
    console.log(dispatch, movieId)
    /* Fetch single or multiple movie trailers via the TMDB API */
    const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${
      this.state.apiKey
    }`;

    axios
      .get(url)
      .then(res => {
        //console.log(res.data);
        dispatch({
          type: "SET_TRAILER_LINK",
          payload: "https://www.youtube.com/embed/" + res.data.results[0].key
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Consumer>
        {value => {
          const { movies, imageBaseURL, imageSize, dispatch, trailerLink } = value;
          return (
            <div>
              <div
                className="modal"
                tabIndex="-1"
                role="dialog"
                id="exampleModal"
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Movie Trailer</h5>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      {trailerLink === null ? (
                        <p className="lead mx-auto text-center my-5 text-white">
                          Loading Trailer...
                        </p>
                      ) : (
                        <VideoFrame src={trailerLink} />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <header className="header-top">
                <nav
                  className="navbar navbar-expand-lg navbar-dark"
                  style={{ zIndex: "100", background: "transparent" }}
                >
                  <div className="text-center mx-auto">
                    <a className="navbar-brand" href="/">
                      <h2 className="logo">Movie Time</h2>
                    </a>
                  </div>
                </nav>
                <div className="overlay">
                  <div className="container">
                    <h1>Watch What's Next</h1>
                    <h3>BOOK NOW. WATCH ANYTIME</h3>
                    <div className="btn-group">
                      <a href="#now-showing" className="btn btn-danger btn-lg">
                        Get Started
                      </a>
                      <Link to="/tickets/download" className="btn btn-light btn-lg">Get Ticket</Link>
                    </div>

                    <br />
                  </div>
                </div>
              </header>

              <main>
                <section className="section section-3">
                  <div className="header-title">
                    <h2 className="text-white text-danger text-center py-4" id="now-showing">
                      NOW SHOWING
                    </h2>
                    <hr />
                  </div>
                  <div className="container">
                    <div className="row">
                      {movies.length > 0 ? (
                        movies.map((movie, index) => (
                          <div className="col-12" key={movie.id}>
                            <div
                              className="row mb-3"
                              style={{ background: "#000000" }}
                            >
                              <div className="col-xs-12 col-sm-2 col-md-2 col-lg-2ss">
                                <img
                                  src={`${imageBaseURL}${imageSize}${
                                    movie.poster_path
                                  }`}
                                  alt={movie.title}
                                  style={{ borderRadius: "10px" }}
                                  className="img-responsive mx-auto d-block text-center w-100"
                                />
                              </div>
                              <div className="col-xs-12 col-sm-10 col-md-10 col-lg-10">
                                <h6 className="text-danger mt-3">
                                  {movie.genres.map(genre => (
                                    <span key={genre.id}>
                                      | {String(genre.name).toUpperCase()} |{" "}
                                    </span>
                                  ))}
                                </h6>
                                <Link
                                  to={`/movie/${movie.title}/${
                                    movie.id
                                    }/view`}
                                  className="h3 text-white movie-link"
                                  style={{
                                    textDecoration: "none"
                                  }}
                                >
                                  {movie.title}
                                </Link>
                                <p
                                  className="lead text-white"
                                  style={{ fontSize: "1rem" }}
                                >
                                  {String(movie.overview)
                                    .slice(0, 200)
                                    .concat("...")}
                                </p>
                                <p
                                  className="lead text-white"
                                  style={{ fontSize: "1rem", fontWeight: 500 }}
                                >
                                  {}
                                  {movie.runtime} MINS | {movie.vote_average}
                                  /10
                                </p>

                                <div className="cta">
                                  <button
                                    className="float-left btn btn-outline-secondary"
                                    data-toggle="modal"
                                    data-target="#exampleModal"
                                    onClick={
                                      this.setTrailer.bind(
                                        this,
                                        dispatch,
                                        movie.id
                                      )
                                    }
                                  >
                                    WATCH TRAILER
                                  </button>
                                  <Link
                                    to={`/movie/${String(movie.title).toLowerCase().split(" ").join("-")}/${
                                      movie.id
                                    }/${index}/view`}
                                    className="btn btn-outline-danger float-right"
                                  >
                                    BOOK NOW
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="lead mx-auto text-center my-5 text-white">
                          Loading...
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              </main>
            </div>
          );
        }}
      </Consumer>
    );
  }
}

export default Home;
