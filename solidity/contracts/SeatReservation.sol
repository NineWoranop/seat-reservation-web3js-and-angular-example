// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

contract SeatReservation {
    uint256 private constant UNKNOWN_SEAT = 99;
    uint256[] public seats;

    // Create the new token and assign initial values, including initial amount
    constructor() {
        seats = new uint256[](20);
    }

    event UpdateSeat(uint256 _seatNumber, uint256 _employeeNumber);

    // return all seats (true means booked)
    function getAllSeats() public view returns (bool[] memory result) {
        result = new bool[](20);

        for (uint256 _seatNumber = 0; _seatNumber < 20; _seatNumber++) {
            bool avaiable = (seats[_seatNumber] == 0);
            result[_seatNumber] = avaiable;
        }
        return result;
    }

    function getCurrentSeat(uint256 _employeeNumber)
        public
        view
        returns (uint256)
    {
        for (uint256 _seatNumber = 0; _seatNumber < 20; _seatNumber++) {
            bool isMatch = (seats[_seatNumber] == _employeeNumber);
            if (isMatch) {
                return _seatNumber;
            }
        }
        return UNKNOWN_SEAT;
    }

    function getEmployeeNumber(uint256 _seatNumber)
        public
        view
        returns (uint256)
    {
        return seats[_seatNumber];
    }

    function isSeatAvaiable(uint256 _seatNumber)
        private
        view
        returns (bool avaiable)
    {
        uint256 employeeNumber = getEmployeeNumber(_seatNumber);
        avaiable = (employeeNumber == 0);
        return avaiable;
    }

    function alreadyHaveSeat(uint256 _employeeNumber)
        private
        view
        returns (bool booked)
    {
        uint256 _seatNumber = getCurrentSeat(_employeeNumber);
        booked = (_seatNumber != UNKNOWN_SEAT);
        return booked;
    }

    // Book seat by fill in seatNumber and employeeNumber
    function book(uint256 _seatNumber, uint256 _employeeNumber)
        public
        returns (uint256 bookNumber)
    {
        require(
            _seatNumber >= 0 && _seatNumber < 20,
            "Seat Number is not in range (0-19)."
        );
        require(
            _employeeNumber >= 1 && _employeeNumber < 21,
            "Employee Number is not in range (1-20)."
        );
        require(isSeatAvaiable(_seatNumber), "This seat is not avaiable.");
        require(
            !alreadyHaveSeat(_employeeNumber),
            "This employee already booked a seat."
        );

        seats[_seatNumber] = _employeeNumber;
        emit UpdateSeat(_seatNumber, _employeeNumber); //solhint-disable-line indent, no-unused-vars
        return 50;
    }

    // Cancel seat by fill in employeeNumber
    function cancel(uint256 _employeeNumber) public returns (bool success) {
        require(
            _employeeNumber >= 1 && _employeeNumber < 21,
            "Employee Number is not in range (1-20)."
        );
        require(
            alreadyHaveSeat(_employeeNumber),
            "This employee does not booked a seat."
        );
        uint256 _seatNumber = 0;
        for (; _seatNumber < 20; _seatNumber++) {
            if (seats[_seatNumber] == _employeeNumber) {
                seats[_seatNumber] = 0;
                break;
            }
        }
        if (_seatNumber < 20) {
            emit UpdateSeat(_seatNumber, _employeeNumber); //solhint-disable-line indent, no-unused-vars
            return true;
        } else {
            return false;
        }
    }
}
