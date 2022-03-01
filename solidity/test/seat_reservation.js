const SeatReservation = artifacts.require("SeatReservation");

contract("SeatReservation", function (/* SeatReservation */) {
  it("can book", async function () {
    const instance = await SeatReservation.deployed();
    const seatNumber = 5;
    const employeeNumber = 10;
    await instance.book(seatNumber, employeeNumber);
    const seats = await instance.getAllSeats();

    assert.equal(seats[seatNumber], true);
  });

  it("can book and cancel", async function () {
    const instance = await SeatReservation.deployed();
    const seatNumber = 9;
    const employeeNumber = 17;
    await instance.book(seatNumber, employeeNumber);
    let seats = await instance.getAllSeats();
    assert.equal(seats[seatNumber], true);
    await instance.cancel(employeeNumber);
    seats = await instance.getAllSeats();
    assert.equal(seats[seatNumber], false);

  });
});
