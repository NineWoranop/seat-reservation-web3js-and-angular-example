const seatReservation = artifacts.require("SeatReservation");

module.exports = function(deployer) {
    deployer.deploy(seatReservation);
};