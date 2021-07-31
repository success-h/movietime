import React, { Component } from "react";
import format from "date-fns/format";
import axios from "axios";
import VideoFrame from "../VideoFrame";
// import { Redirect, history } from "react-router-dom";
import PaystackButton from "react-paystack";
import { Consumer } from "../../Context";

import {differenceInCalendarDays} from 'date-fns'

class SingleMovie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      apiKey: `618b753712ed0a388d986c9e485d9a7c`,
      imageBaseURL: "https://image.tmdb.org/t/p/",
      imageSize: "w154/",
      trailerLink: "",
      key: "pk_test_fa8cde05629cb0c2cb5e2e1daddd6d01a8b2bdf3", //PAYSTACK PUBLIC KEY
      email: "francis.udejiofficial@gmail.com", // customer email
      amount: 100000, //equals NGN100,
      prefferedDate: new Date().toDateString().split('T')[0],
      prefferedTime: "",
      title: "",
      poster_path: "",
      runtime: "",
      release_date: "",
      overview: "",
      movie: "",
      index: null
    };
  }

  callback = response => {
    console.log(response); // card charged successfully, get reference here
  };

  close = () => {
    console.log("Payment closed");
  };

  getReference = () => {
    //you can put any unique reference implementation code here
    let text = "";
    let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=";

    for (let i = 0; i < 15; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  };

  getTrailer = movieId => {
    /* Fetch single or multiple movie trailers via the TMDB API */
    const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${
      this.state.apiKey
    }`;

    axios
      .get(url)
      .then(res => {
        //console.log(res.data);
        this.setState({
          trailerLink:
            "https://www.youtube.com/embed/" + res.data.results[0].key
        });
      })
      .catch(err => console.log(err));
  };

  componentDidMount() {
    const { id, title, index } = this.props.match.params;
    this.getTrailer(id);

    this.setState({
      id,
      title,
      index
    });
  }

  minuteToHour = timeInMins => {
    const mins = timeInMins;
    let h, m;
    if (mins > 60 && mins < 3600) {
      h = Math.floor(mins / 60);
      m = Math.round(mins % 60);
    }

    if (h === 1) h = h + "hr ";
    else h = h + "hrs ";

    if (m === 1) m = m + "min ";
    else m = m + "mins ";

    const runtime = h + m;
    return runtime;
  };

  onInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  sendToBookingPage = (dispatch, movie, index) => {
    return event => {
      event.preventDefault();

      const diff = differenceInCalendarDays(new Date().toISOString(), this.state.prefferedDate)

      console.log(diff)

      if(diff > 0) {
        alert("You cannot go back in time")
        return
      }

      if(diff < -30) {
        alert("You can only book tickets for on or before 30 days interval")
        return
      }

      const title = String(movie.title)
        .toLowerCase()
        .split(" ")
        .join("-");
      const { prefferedDate, prefferedTime } = this.state;
      const editMovie = {
        ...movie,
        booked: { preffered_date: prefferedDate, preffered_time: prefferedTime }
      };
      localStorage.setItem(movie.id, JSON.stringify({prefferedDate, prefferedTime}));
      dispatch({
        type: "SET_CURRENT_MOVIE",
        payload: editMovie
      });
      this.props.history.push(`/movie/${title}/${movie.id}/${index}/book`);
    };
  };

  findMovieById = movies => {
    const { id, title } = this.state;
    let movie = {};

    const allMovies = [...movies];
    setTimeout(() => {
      allMovies.forEach(m => {
        //console.log(m.id, parseInt(id))
        if (m.id === id) {
          movie = { ...m };
        }
      });
    }, 3000);

    return {
      id,
      title,
      movie
    };
  };

  render() {
    //console.log(this.props);
    const { imageBaseURL, imageSize, trailerLink } = this.state;
    const { title, id } = this.props.match.params;

    return (
      <>
        <header>
          <div className="container">
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

            <div className="video-player mt-2">
              {trailerLink === null ? (
                <p className="lead mx-auto text-center my-5 text-white">
                  Loading Trailer...
                </p>
              ) : (
                <VideoFrame src={trailerLink} />
              )}
            </div>

            <Consumer>
              {value => {
                const { imageBaseURL, imageSize, dispatch } = value;
                const movie = value.movies[this.props.match.params.index];

                return (
                  <div className="content">
                    {movie !== undefined ? (
                      <div className="content_movie-info">
                        <div className="row text-white mt-5">
                          <div className="col-xs-12 col-sm-2 col-md-2 col-lg-2">
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
                            <h3 className="text-white">{movie.title}</h3>

                            <p
                              className="lead text-white"
                              style={{ fontSize: "1rem", fontWeight: 500 }}
                            >
                              {" "}
                              <span
                                style={{
                                  color: "#ccc",
                                  fontWeight: 400,
                                  fontSize: "0.95rem"
                                }}
                              >
                                {movie.overview}
                              </span>
                            </p>

                            <p
                              className="lead text-white"
                              style={{ fontSize: "1rem", fontWeight: 500 }}
                            >
                              {" "}
                              Release Date
                              <br />
                              <span
                                style={{
                                  color: "#ccc",
                                  fontWeight: 400,
                                  fontSize: "0.95rem"
                                }}
                              >
                                {format(movie.release_date, "DD MMMM YYYY")}
                              </span>
                            </p>

                            <p
                              className="lead text-white"
                              style={{ fontSize: "1rem", fontWeight: 500 }}
                            >
                              Runtime
                              <br />
                              <span
                                style={{
                                  color: "#ccc",
                                  fontWeight: 400,
                                  fontSize: "0.95rem"
                                }}
                              >
                                {this.minuteToHour(movie.runtime)}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="row my-5">
                          <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8 mx-auto">
                            <form
                              className="form"
                              onSubmit={this.sendToBookingPage(
                                dispatch,
                                movie,
                                this.props.match.params.index
                              )}
                            >
                              <div className="form-group">
                                <label
                                  htmlFor="exampleFormControlSelect1"
                                  style={{
                                    color: "#ccc",
                                    fontWeight: 400,
                                    fontSize: "1rem"
                                  }}
                                >
                                  Choose a preffered date now
                                </label>
                                <input
                                  type="date"
                                  name="prefferedDate"
                                  id="exampleFormControlSelect1" className="form-control form-control-lg"
                                  onChange={this.onInputChange}
                                  required
                                />

                              </div>

                              <div className="form-group">
                                <label
                                  htmlFor="exampleFormControlSelect1"
                                  style={{
                                    color: "#ccc",
                                    fontWeight: 400,
                                    fontSize: "1rem"
                                  }}
                                >
                                  Choose a preffered time
                                </label>
                                <select
                                  className="form-control form-control-lg"
                                  id="exampleFormControlSelect1"
                                  name="prefferedTime"
                                  onChange={this.onInputChange}
                                  required
                                >
                                  <option>Choose a preffered time</option>
                                  <option>10:00 AM</option>
                                  <option>2:00 PM</option>
                                  <option>6:00 PM</option>
                                </select>
                              </div>
                              <input
                                type="submit"
                                value="Continue"
                                className="btn btn-danger btn-lg btn-block"
                                onClick={this.sendToBookingPage}
                              />
                            </form>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="lead text-white mx-auto text-center">
                        LOADING...
                      </p>
                    )}
                  </div>
                );
              }}
            </Consumer>
          </div>
        </header>
      </>
    );
  }
}

export default SingleMovie;
