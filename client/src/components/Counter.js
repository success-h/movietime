import React, { Component } from "react";
import { Consumer } from "../Context";

class Counter extends Component {
  increment = (dispatch, e) => {
    dispatch({
      type: "INCREMENT",
      payload: 1
    });
  };

  decrement = (dispatch, e) => {
    dispatch({
      type: "DECREMENT",
      payload: 1
    });
  };

  render() {
    return (
      <Consumer>
        {value => {
          //console.log(value);
          const { dispatch } = value;
          return (
            <div className="btn-group text-center">
              <button
                className="btn btn-default btn-lg"
                onClick={this.decrement.bind(this, dispatch)}
              >
                -
              </button>
              <p className="h1 text-white">{value.count}</p>
              <button
                className="btn btn-default btn-lg"
                onClick={this.increment.bind(this, dispatch)}
              >
                +
              </button>
            </div>
          );
        }}
      </Consumer>
    );
  }
}

export default Counter;
