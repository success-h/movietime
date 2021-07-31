import React, {useState} from 'react'
import axios from 'axios'
import domtoimage from 'dom-to-image'
import {format} from 'date-fns'

function Ticket({ticket}) {

  function formatNumber(seatnum) {
    let number = ""
    if(Number(seatnum) < 10) {
      number = `00${seatnum}`
    } else if(Number(seatnum) < 100 && Number(seatnum) >= 10) {
      number = `0${seatnum}`
    } else {
      number = `${seatnum}`
    }

    return number
  }

  return (
    <div 
      className="card card-body bg-danger" 
      style={{
        minHeight: "100px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
      }}>
      <div className="left" style={{
        height: "100%",
        width: "20px",
        borderRight: "3px solid #000",
        color: "#fff",
        fontSize: "1.2rem",
        paddingRight: "10px",
        fontWeight: 500
      }}>
      {ticket.movieDetails.id}
      </div>
      <div className="center" style={{
        flex: "1"
      }}>
        <h3 style={{fontFamily: "cursive", color: "#fff", textAlign: "center"}}>MOVIE TICKET</h3>
        <h4 className="text-center">{ticket.movieDetails.title}</h4>
        <h5 className="text-center">{format(ticket.user.prefferedDate, 'Do MMM `YY')} | {ticket.user.prefferedTime}</h5>
        <h6 className="text-center">SEAT - {formatNumber(ticket.user.seatNumber)}</h6>
      </div>
      <div className="right" style={{
        height: "100%",
        width: "20px",
        borderLeft: "3px solid #000",
        color: "#fff",
        fontSize: "1.2rem",
        padding: "10px",
        fontWeight: 500,
        textAlign: "center"
      }}>
        {ticket.movieDetails.id}
      </div>
    </div>
  )
}

function Tickets({ticketIdNumber = ""}) {

  const [ticketId, setTicketId] = useState(ticketIdNumber)
  const [isValid, setIsValid] = useState(false)
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dataUrl, setDataUrl] = useState(null)

  const verifyTicket = e => {
    e.preventDefault()

    axios.get(`/api/users/verifyTicket/${ticketId}`)
      .then(({data}) => {
        setLoading(false)
        setTicket(data.ticket)
        console.log(data.ticket)
        setTicketId("")
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
        setError(err.message)
        setTicketId("")
        setTimeout(() => {
          setError(null)
        }, 1000)
      })
  }

  function DOMToImage(node) {
  
    domtoimage.toPng(node)
    .then(dataUrl => {
        var img = new Image();
        img.src = dataUrl;
        setDataUrl(dataUrl)

        const link = document.createElement('a');
        link.download = 'movie-ticket.png';
        link.href = dataUrl;
        console.log(link)
        link.click()

    })
    .catch(error => {
        console.error('oops, something went wrong!', error);
    });
  }

  return(
    <div className="container">
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mx-auto">
          {error !== null && alert(error)}
          <form onSubmit={e => verifyTicket(e)}>

            <div className="form-group mt-3">
              <label htmlFor="ticket_id" className="text-white">Enter Reference Code Sent via email</label>
              <input 
                type="text" 
                id="ticket_id" 
                className="form-control" 
                placeholder="Type in your Reference id" 
                value={ticketId} 
                onChange={e => {
                  setTicketId(e.target.value)
                }}
              />
            </div>

            <input disabled={loading ? true : false} type="submit" value={loading ? "Loading...": "Verify"} className="btn btn-danger btn-lg btn-block"/>
          </form>
        </div>
      </div>
      <div className="row my-5">
        {ticket !== null ? (
    
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mx-auto">
            <Ticket ticket={ticket}/>
            <button 
              className="btn btn-danger btn-lg btn-block mt-3" 
              onClick={e => DOMToImage(document.querySelector('.card'))}>Download</button>
          </div>
          ) : null}
          
          {loading ? (
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mx-auto text-center">
              <p className="lead text-center">Loading Ticket...</p>
            </div>
          ) : null}
       
      </div>
    </div>
  )
}

export default Tickets