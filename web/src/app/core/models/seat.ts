export class Seat {
    public readonly seatNumber: number | undefined;
    public readonly avaiable: boolean | false;
    public static readonly UNKNOWN_SEAT = 99;

    constructor(_seatNumber: number, _avaiable: boolean) {
        this.seatNumber = _seatNumber;
        this.avaiable = _avaiable;
    }

    public static isUnknownSeat(_seatNumber: number): boolean {
        return _seatNumber == Seat.UNKNOWN_SEAT;
    }

    public static isKnownSeat(_seatNumber: number): boolean {
        return !Seat.isUnknownSeat(_seatNumber);
    }

    public styleClass(_currentSeatNumber: number): string {
        if (Seat.isKnownSeat(_currentSeatNumber)) {
            if (_currentSeatNumber == this.seatNumber) {
                return 'owner';
            }
        }
        if (!this.avaiable) {
            return 'booked';
        }
        return '';
    }
}