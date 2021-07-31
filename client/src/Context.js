import React, { Component } from "react";
import axios from "axios";
import { reducer } from "./reducer";

const Context = React.createContext();

export class AppProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiKey: `618b753712ed0a388d986c9e485d9a7c`,
      movies: [],
      status: "",
      apiBaseURL: "https://api.themoviedb.org/3/movie/",
      imageBaseURL: "https://image.tmdb.org/t/p/",
      imageSize: "w154",
      currentPage: 1,
      totalPages: null,
      totalMovies: null,
      isLoading: true,
      trailerLink: null,
      count: 0,
      currentMovie: {},
      dispatch: action => this.setState(state => reducer(state, action))
    };
  }

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


  getPopularMovies = () => {
    const { apiKey, currentPage, movies } = this.state;
    const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${currentPage}`;
    const popularMovies = [...movies];
    let totalPages, totalMovies;

    axios
      .get(apiUrl)
      .then(res => {
        //console.log(`DISPATCHING FIRST REQUEST...`);
        const data = res.data;
        let newMovies = data.results;
        totalPages = data.total_pages;
        totalMovies = data.total_results;

        let movieObj = {};
        newMovies.forEach(movie => {
          let movieId = movie.id;
          return axios
            .get(
              `https://api.themoviedb.org/3/movie/${movieId}?api_key=618b753712ed0a388d986c9e485d9a7c`
            )
            .then(response => {
              this.state.dispatch({
                type: "FETCHED",
                payload: "FETCHED"
              });
              //console.log(`DISPATCHING SECOND REQUEST...`);
              const movieData = response.data;
              const runtime = movieData.runtime;
              const genres = movieData.genres;
              movieObj = { ...movie };

              movieObj.runtime = runtime;
              movieObj.genres = genres;

              popularMovies.push(movieObj);

              //if (this.state.status === 'FETCHED') {

                //console.log(`DISPATCHING THIRD REQUEST...COMPLETE`);
                //console.log(this.state)

                this.setState(
                  {
                    totalPages,
                    totalMovies,
                    movies: popularMovies
                  },
                  () => {
                    //console.log(`DISPATCHING THIRD REQUEST...COMPLETE`);
                    //console.log(this.state)
                  }
                );
              //}

            });
        });



      })
      .catch(err => {});





  };

  componentDidMount() {
    this.getPopularMovies()
  }

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const Consumer = Context.Consumer;
