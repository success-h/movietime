import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Consumer } from "../../Context";
import axios from "axios";

class Booking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      prefferedDate: "",
      prefferedTime: "",
      runtime: "",
      numberOfTickets: "",
      count: 1,
      priceInKobo: 10000,
      priceInNaira: 1000,
      basePrice: 1000,
      screen: "bookscreen",
      firstname: "",
      lastname: "",
      email: "",
      phone: ""
    };
  }

  componentDidMount() {
    const {
      title,
      prefferedDate,
      prefferedTime,
      runtime
    } = this.props.match.params;

    this.setState({
      title,
      prefferedDate,
      prefferedTime,
      runtime
    });
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 }, () => this.setPrice());
  };

  decrement = () => {
    if (this.state.count === 0) return;
    else this.setState({ count: this.state.count - 1 }, () => this.setPrice());
  };

  setPrice = () => {
    this.setState({
      priceInNaira: this.state.basePrice * this.state.count,
      priceInKobo: this.state.basePrice * 10 * this.state.count
    });
  };

  bookTicket = e => {
    e.preventDefault();
    this.setState({
      screen: "payscreen"
    });
  };

  onInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  payForTicket = (title, id, runtime, dispatch) => {
    return event => {
      event.preventDefault();
      axios({
        method: "post",
        url: "/api/movies/create",
        data: {
          title,
          id,
          runtime
        }
      })
        .then(res => {
          console.log(res.data);
          if (res.data.status === "ok") {
            const { firstname, lastname, email, phone } = this.state;
            return axios({
              method: "post",
              url: "/api/users/create",
              data: {
                firstname,
                lastname,
                email,
                phone,
                prefferedDate: JSON.parse(localStorage.getItem(id))
                  .prefferedDate,
                prefferedTime: JSON.parse(localStorage.getItem(id))
                  .prefferedTime,
                tickets: this.state.count,
                movieId: res.data.movie.id
              }
            })
              .then(res => {
                console.log(res.data);
                this.setState(
                  {
                    firstname: "",
                    lastname: "",
                    email: "",
                    phone: ""
                  },
                  () => {
                    dispatch({
                      type: "SET_CURRENT_USER",
                      payload: res.data.user
                    });

                    localStorage.setItem('currentuser', JSON.stringify(res.data.user))
                    this.props.history.push(
                      `/movie/payment`
                    );

                  }
                );
              })
              .catch(err => console.log("inner http req", err));
          }
        })
        .catch(err => console.log(err));
    };
  };

  render() {
    //const { title, prefferedDate, prefferedTime, runtime } = this.state;

    return (
      <Consumer>
        {value => {
          const { firstname, lastname, email, phone } = this.state;
          const { dispatch } = value;
          return (
            <div className="dividdd">
              <div className="lead text-white">
                {value.movies.map(
                  m =>
                    m.id === parseFloat(this.props.match.params.id) ? (
                      <div key={m.id}>
                        <div className="container">
                          <div className="row">
                            <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8 mx-auto mt-4">
                              <div
                                className="card card-body mt-5 py-5 mb-5"
                                style={{
                                  borderRadius: "10px",
                                  border: "1px solid #333",
                                  background: "#000"
                                }}
                              >
                                <div className="mb-4">
                                  <p className="text-danger float-left">
                                    NOW BOOKING
                                  </p>
                                  <Link
                                    to={`/movie/${String(m.title)
                                      .toLowerCase()
                                      .split(" ")
                                      .join("-")}/${m.id}/${
                                      this.props.match.params.index
                                    }/view`}
                                    className="text-light float-right"
                                    style={{ textDecoration: "underline" }}
                                  >
                                    BACK TO MOVIES
                                  </Link>
                                </div>

                                <div className="extra-info">
                                  <h3 className="text-white mb-4 text-left">
                                    {m.title}
                                  </h3>
                                  <p className="text-light text-left">
                                    <i
                                      className="fa fa-calendar"
                                      style={{ color: "hsla(0,0%,100%,.6)" }}
                                    />
                                    <span
                                      className="ml-2"
                                      style={{
                                        color: "hsla(0,0%,100%,.6)",
                                        fontWeight: 600
                                      }}
                                    >
                                      {
                                        JSON.parse(localStorage.getItem(m.id))
                                          .prefferedDate
                                      }
                                      {/* {console.log(localStorage.getItem(m.id))} */}
                                    </span>
                                  </p>
                                  <p className="text-light text-left">
                                    <i
                                      className="fa fa-clock-o"
                                      style={{ color: "hsla(0,0%,100%,.6)" }}
                                    />
                                    <span
                                      className="ml-2"
                                      style={{
                                        color: "hsla(0,0%,100%,.6)",
                                        fontWeight: 600
                                      }}
                                    >
                                      {
                                        JSON.parse(localStorage.getItem(m.id))
                                          .prefferedTime
                                      }
                                      , {m.runtime} MINS
                                    </span>
                                  </p>
                                </div>
                                {this.state.screen === "bookscreen" ? (
                                  <>
                                    {/* <div className="row">
                                      <div className="col-12">
                                        <p className="text-danger mt-4 mb-3">
                                          SELECT NUMBER OF TICKETS
                                        </p>
                                      </div>
                                    </div> */}

                                    {/* <div className="row">
                                      <div className="col-12">
                                        <div className="left float-left">
                                          <p className="text-white mb-0">
                                            REGULAR
                                          </p>
                                          <p
                                            style={{
                                              fontSize: "0.8rem",
                                              fontWeight: "400",
                                              color: "hsla(0,0%,100%,.6)"
                                            }}
                                          >
                                            N 1000 / ticket
                                          </p>
                                        </div>
                                        <div className="right float-right">
                                          <div className="btn-group">
                                            <button
                                              className="button btn btn-secondary btn-lg"
                                              onClick={this.decrement}
                                            >
                                              -
                                            </button>
                                            <div
                                              className="button btn btn-default bg-dark btn-lg text-light"
                                              style={{ background: "#fff" }}
                                            >
                                              {this.state.count}
                                            </div>
                                            <button
                                              className="button btn btn-secondary btn-lg"
                                              onClick={this.increment}
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div> */}
                                  </>
                                ) : null}

                                {this.state.screen === "bookscreen" ? (
                                  <form onSubmit={this.bookTicket}>
                                    <div className="extra-info">
                                      <div className="row">
                                        <div className="col-12">
                                          <div className="total">
                                            <hr />
                                            <h5 className="text-white float-left">
                                              Total
                                            </h5>
                                            <h5 className="text-white float-right">
                                              <span>N</span>
                                              {this.state.priceInNaira}
                                            </h5>
                                            <hr />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <input
                                      type="submit"
                                      value="PROCEED TO PAYMENT"
                                      className="btn btn-danger btn-lg btn-block mt-4"
                                    />
                                  </form>
                                ) : (
                                  <div className="row">
                                    <p className="text-light pl-3">
                                      <i
                                        className="fa fa-users"
                                        style={{ color: "hsla(0,0%,100%,.6)" }}
                                      />
                                      <span
                                        className="ml-2"
                                        style={{
                                          color: "hsla(0,0%,100%,.6)",
                                          fontWeight: 600
                                        }}
                                      >
                                        {this.state.count} tickets
                                      </span>
                                    </p>
                                    <div className="col-12">
                                      <div className="total">
                                        <hr />
                                        <h5 className="text-white float-left">
                                          Total Order
                                        </h5>
                                        <h5 className="text-white float-right">
                                          <span>N</span>
                                          {this.state.priceInNaira}
                                        </h5>
                                        <hr />
                                      </div>
                                    </div>
                                    <div className="col-12 mt-4">
                                      <form
                                        onSubmit={this.payForTicket(
                                          m.title,
                                          m.id,
                                          m.runtime,
                                          dispatch
                                        )}
                                      >
                                        <div className="form-group">
                                          <label
                                            style={{
                                              color: "hsla(0,0%,100%,.6)"
                                            }}
                                            htmlFor="firstname"
                                          >
                                            First Name
                                          </label>
                                          <input
                                            required
                                            className="form-control"
                                            type="text"
                                            name="firstname"
                                            id="firstname"
                                            placeholder="Type your First Name"
                                            value={firstname}
                                            onChange={this.onInputChange}
                                          />
                                        </div>
                                        <div className="form-group">
                                          <label
                                            style={{
                                              color: "hsla(0,0%,100%,.6)"
                                            }}
                                            htmlFor="lastname"
                                          >
                                            Last Name
                                          </label>
                                          <input
                                            required
                                            className="form-control"
                                            type="text"
                                            name="lastname"
                                            id="lastname"
                                            placeholder="Type your Last Name"
                                            value={lastname}
                                            onChange={this.onInputChange}
                                          />
                                        </div>
                                        <div className="form-group">
                                          <label
                                            style={{
                                              color: "hsla(0,0%,100%,.6)"
                                            }}
                                            htmlFor="email"
                                          >
                                            Email Address
                                          </label>
                                          <input
                                            required
                                            className="form-control"
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="Type your email address"
                                            value={email}
                                            onChange={this.onInputChange}
                                          />
                                        </div>
                                        <div className="form-group">
                                          <label
                                            style={{
                                              color: "hsla(0,0%,100%,.6)"
                                            }}
                                            htmlFor="phone"
                                          >
                                            Phone Number
                                          </label>
                                          <input
                                            required
                                            className="form-control"
                                            type="number"
                                            name="phone"
                                            id="phone"
                                            placeholder="Type your Phone number"
                                            value={phone}
                                            onChange={this.onInputChange}
                                          />
                                        </div>
                                        <input
                                          type="submit"
                                          value="PAY NOW"
                                          className="btn btn-danger btn-lg btn-block"
                                        />
                                      </form>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null
                )}
              </div>
            </div>
          );
          // let cm;
          // if (
          //   localStorage.getItem("currentMovie", JSON.parse(value.currentMovie))
          // ) {
          //   cm = localStorage.getItem(
          //     "currentMovie",
          //     JSON.parse(value.currentMovie)
          //   );
          // } else {
          //     cm = localStorage.setItem(
          //     "currentMovie",
          //     JSON.stringify(value.currentMovie)
          //   );
          // }

          //const { title, runtime, booked: { prefferedDate, prefferedTime }} = cm;

          // return (
          //   <div>
          //     <div className="container">
          //       <div className="row">
          //         <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8 mx-auto mt-4">
          //           <div
          //             className="card card-body mt-5 py-5 mb-5"
          //             style={{
          //               borderRadius: "10px",
          //               border: "1px solid #333",
          //               background: "#000"
          //             }}
          //           >
          //             <div className="mb-4">
          //               <p className="text-danger float-left">NOW BOOKING</p>
          //               <Link
          //                 to="/"
          //                 className="text-light float-right"
          //                 style={{ textDecoration: "underline" }}
          //               >
          //                 BACK TO MOVIES
          //               </Link>
          //             </div>

          //             <div className="extra-info">
          //               <h3 className="text-white mb-4">{title}</h3>
          //               <p className="text-light">
          //                 <i
          //                   className="fa fa-calendar"
          //                   style={{ color: "hsla(0,0%,100%,.6)" }}
          //                 />
          //                 <span
          //                   className="ml-2"
          //                   style={{
          //                     color: "hsla(0,0%,100%,.6)",
          //                     fontWeight: 600
          //                   }}
          //                 >
          //                   {prefferedDate}
          //                 </span>
          //               </p>
          //               <p className="text-light">
          //                 <i
          //                   className="fa fa-clock-o"
          //                   style={{ color: "hsla(0,0%,100%,.6)" }}
          //                 />
          //                 <span
          //                   className="ml-2"
          //                   style={{
          //                     color: "hsla(0,0%,100%,.6)",
          //                     fontWeight: 600
          //                   }}
          //                 >
          //                   {prefferedTime}, {runtime} MINS
          //                 </span>
          //               </p>
          //             </div>
          //             {this.state.screen === "bookscreen" ? (
          //               <>
          //                 <div className="row">
          //                   <div className="col-12">
          //                     <p className="text-danger mt-4 mb-3">
          //                       SELECT NUMBER OF TICKETS
          //                     </p>
          //                   </div>
          //                 </div>

          //                 <div className="row">
          //                   <div className="col-12">
          //                     <div className="left float-left">
          //                       <p className="text-white mb-0">REGULAR</p>
          //                       <p
          //                         style={{
          //                           fontSize: "0.8rem",
          //                           fontWeight: "400",
          //                           color: "hsla(0,0%,100%,.6)"
          //                         }}
          //                       >
          //                         N 2000 / ticket
          //                       </p>
          //                     </div>
          //                     <div className="right float-right">
          //                       <div className="btn-group">
          //                         <button
          //                           className="button btn btn-default btn-lg"
          //                           onClick={this.decrement}
          //                         >
          //                           -
          //                         </button>
          //                         <div
          //                           className="button btn btn-default btn-lg"
          //                           style={{ background: "#fff" }}
          //                         >
          //                           {this.state.count}
          //                         </div>
          //                         <button
          //                           className="button btn btn-default btn-lg"
          //                           onClick={this.increment}
          //                         >
          //                           +
          //                         </button>
          //                       </div>
          //                     </div>
          //                   </div>
          //                 </div>
          //               </>
          //             ) : null}

          //             {this.state.screen === "bookscreen" ? (
          //               <form onSubmit={this.bookTicket}>
          //                 <div className="extra-info">
          //                   <div className="row">
          //                     <div className="col-12">
          //                       <div className="total">
          //                         <hr />
          //                         <h5 className="text-white float-left">
          //                           Total
          //                         </h5>
          //                         <h5 className="text-white float-right">
          //                           <span>N</span>
          //                           {this.state.priceInNaira}
          //                         </h5>
          //                         <hr />
          //                       </div>
          //                     </div>
          //                   </div>
          //                 </div>
          //                 <input
          //                   type="submit"
          //                   value="PROCESS TO PAYMENT"
          //                   className="btn btn-danger btn-lg btn-block mt-4"
          //                 />
          //               </form>
          //             ) : (
          //               <div className="row">
          //                 <p className="text-light pl-3">
          //                   <i
          //                     className="fa fa-users"
          //                     style={{ color: "hsla(0,0%,100%,.6)" }}
          //                   />
          //                   <span
          //                     className="ml-2"
          //                     style={{
          //                       color: "hsla(0,0%,100%,.6)",
          //                       fontWeight: 600
          //                     }}
          //                   >
          //                     {this.state.count} tickets
          //                   </span>
          //                 </p>
          //                 <div className="col-12">
          //                   <div className="total">
          //                     <hr />
          //                     <h5 className="text-white float-left">
          //                       Total Order
          //                     </h5>
          //                     <h5 className="text-white float-right">
          //                       <span>N</span>
          //                       {this.state.priceInNaira}
          //                     </h5>
          //                     <hr />
          //                   </div>
          //                 </div>
          //                 <div className="col-12 mt-4">
          //                   <form onSubmit={this.payForTicket}>
          //                     <div className="form-group">
          //                       <label
          //                         style={{ color: "hsla(0,0%,100%,.6)" }}
          //                         htmlFor="firstname"
          //                       >
          //                         First Name
          //                       </label>
          //                       <input
          //                         required
          //                         className="form-control"
          //                         type="text"
          //                         name="firstname"
          //                         id="firstname"
          //                         placeholder="Type your First Name"
          //                       />
          //                     </div>
          //                     <div className="form-group">
          //                       <label
          //                         style={{ color: "hsla(0,0%,100%,.6)" }}
          //                         htmlFor="lastname"
          //                       >
          //                         Last Name
          //                       </label>
          //                       <input
          //                         required
          //                         className="form-control"
          //                         type="text"
          //                         name="lastname"
          //                         id="lastname"
          //                         placeholder="Type your Last Name"
          //                       />
          //                     </div>
          //                     <div className="form-group">
          //                       <label
          //                         style={{ color: "hsla(0,0%,100%,.6)" }}
          //                         htmlFor="email"
          //                       >
          //                         Email Address
          //                       </label>
          //                       <input
          //                         required
          //                         className="form-control"
          //                         type="email"
          //                         name="email"
          //                         id="email"
          //                         placeholder="Type your email address"
          //                       />
          //                     </div>
          //                     <div className="form-group">
          //                       <label
          //                         style={{ color: "hsla(0,0%,100%,.6)" }}
          //                         htmlFor="phone"
          //                       >
          //                         Phone Number
          //                       </label>
          //                       <input
          //                         required
          //                         className="form-control"
          //                         type="number"
          //                         name="phone"
          //                         id="phone"
          //                         placeholder="Type your Phone number"
          //                       />
          //                     </div>
          //                     <input
          //                       type="submit"
          //                       value="PAY NOW"
          //                       className="btn btn-danger btn-lg btn-block"
          //                       disabled={true}
          //                     />
          //                   </form>
          //                 </div>
          //               </div>
          //             )}
          //           </div>
          //         </div>
          //       </div>
          //     </div>
          //   </div>
          // );
        }}
      </Consumer>
    );
  }
}

export default Booking;
