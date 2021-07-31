module.exports = class SeatGenerator {
  constructor(currentSeatNumber, totalSeats) {
    this.currentSeatNumber = currentSeatNumber;
    this.totalSeats = totalSeats;
  }

  getCurrentSeatNumber() {
    return this.currentSeatNumber;
  }

  setCurrentSeatNumber(lastAssignedSeatNumber) {
    this.currentSeatNumber = lastAssignedSeatNumber;
  }

  generateSeatNumber(numberOfTickets) {
    const seatNumbers = [];
    const tickets = numberOfTickets;
    let currentSeatNumber = this.currentSeatNumber;

    for (let i = currentSeatNumber + 1; i <= tickets + currentSeatNumber; i++) {
      seatNumbers.push(i);
    }

    this.setCurrentSeatNumber(seatNumbers[seatNumbers.length - 1])
    return seatNumbers;
  }
}

