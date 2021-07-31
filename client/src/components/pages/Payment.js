import React, { Component } from "react";
import PaystackButton from "react-paystack";
import {Link, Redirect } from 'react-router-dom'
import axios from 'axios'

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "pk_test_fa8cde05629cb0c2cb5e2e1daddd6d01a8b2bdf3", //PAYSTACK PUBLIC KEY
      email: "", // customer email
      amount: null, //equals NGN100,
      loading: true,
      basePrice: 100000,
      isBooked: true,
      currentUser: null,
      hasPaid: false,
      redirect: false
    };
  }

  componentDidMount() {
    const currentUser = JSON.parse(localStorage.getItem("currentuser"));
    if (currentUser || currentUser !== null || currentUser !== undefined) {
      this.setState(
        {
          currentUser,
          email: currentUser.email,
          amount: currentUser.tickets * this.state.basePrice
        },
        () => {
          this.setState({ loading: false });
        }
      );
    } else {
      this.setState({isBooked: false})
    }
  }

  componentWillUnmount() {
    localStorage.removeItem('currentuser');
  }

  callback = response => {
    console.log(response); // card charged successfully, get reference here
    if(response.status === "success") {
      axios({
        method: "patch",
        url: `/api/users/update/${this.state.currentUser._id}`,
        data: {
          reference: response.trxref
        }
      })
      .then(user => {
        console.log("updated user", user);
        this.setState({hasPaid: true, redirect: true});
      })
      .catch(err => console.log("error updating user", err))
    }
  };

  close = () => {
    console.log("Payment closed");
  };

  getReference = () => {
    //you can put any unique reference implementation code here
    let text = "";
    let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let possible2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

    for (let i = 0; i < 6; i++)
      text += possible2.charAt(Math.floor(Math.random() * possible2.length));

    return text;
  };

  render() {
    if(this.state.redirect) return <Redirect to="/tickets/download" />
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#fff",
          width: "100%",
          height: "100vh",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          margin: "0 auto"
        }}
      >
        {this.state.loading ? (
          <p className="lead h1">LOADING PAYMENT GATEWAY...</p>
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-8 col-lg-6 mx-auto">
                {this.state.isBooked ? (
                  <PaystackButton
                    text="Make Payment"
                    class="payButton"
                    callback={this.callback}
                    close={this.close}
                    disabled={true}
                    embed={true}
                    reference={this.getReference()}
                    email={this.state.email}
                    amount={this.state.amount}
                    paystackkey={this.state.key}
                    tag="button"
                  />
                ) : (
                  <div>
                    <p className="lead h1 text-danger">
                      Sorry, looks like you're yet to book a ticket
                    </p>
                    <Link to="/" className="btn btn-outline-secondary">&larr; Go Back Home</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Payment;
