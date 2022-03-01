import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { Seat, User } from '../../core/models';
import { AccountService, AlertService, Web3Service } from '../../core/services';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ["home.component.css"]
})
export class HomeComponent {
    user: User;
    seats: Seat[];
    currentSeatNumber: number = Seat.UNKNOWN_SEAT;

    constructor(private formBuilder: FormBuilder,
        private accountService: AccountService,
        private alertService: AlertService,
        private web3Service: Web3Service) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {
        this.refreshSeats();
    }

    click(seat: Seat) {
        if (seat !== undefined && seat !== null) {
            const alreadyBooked: boolean = Seat.isKnownSeat(this.currentSeatNumber);
            const isYourSeat: boolean = (this.currentSeatNumber == seat.seatNumber);
            if (alreadyBooked && isYourSeat) {
                // Now, you are at your seat.
                const canceled = confirm("Are you sure to cancel this seat?");
                if (canceled) {
                    this.cancel(seat);
                }
            } else if (!seat.avaiable) {
                alert('Could not book this seat');
            } else if (alreadyBooked) {
                // Now, you are not at your seat.
                alert('Please cancel your current seat first before book this seat');
            } else {
                const booked = confirm("Are you sure to book this seat?");
                if (booked) {
                    this.book(seat);
                }
            }
        }
    }

    private refreshSeats() {
        const seatContract = this.web3Service.getSeatReservationContract;
        if (seatContract !== undefined && seatContract !== null) {
            const getAllSeatsMethod = seatContract.getAllSeats();
            if (getAllSeatsMethod !== null) {
                getAllSeatsMethod.then(_seats => {
                    if (_seats !== undefined && _seats !== null) {
                        this.seats = Array(0);
                        _seats.forEach((avaiable, index) => {
                            this.seats.push(new Seat(index, avaiable));
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    this.alertService.error('Failed to get all seats');
                });
            }
            if (this.user !== undefined && this.user !== null && this.user.employeeNumber !== undefined) {
                const getCurrentSeatMethod = seatContract.getCurrentSeat(this.user.employeeNumber);
                if (getCurrentSeatMethod !== null) {
                    getCurrentSeatMethod.then((_seatNumber: string) => {
                        this.currentSeatNumber = Number.parseInt(_seatNumber);
                    }).catch(error => {
                        console.log(error);
                        this.alertService.error('Failed to get current seat');
                    });
                }
            }
        }
    }

    private book(seat: Seat) {
        // alert('booked success');
        const seatContract = this.web3Service.getSeatReservationContract;
        const method = seatContract.book(seat.seatNumber, this.user.employeeNumber);
        if (method !== null) {
            method.then(data => {
                this.refreshSeats();
                alert('booked success');
            }).catch(error => {
                console.log(error);
                this.alertService.error('Failed to book');
            });
        }
    }

    private cancel(seat: Seat) {
        //  alert('canceled success');
        const seatContract = this.web3Service.getSeatReservationContract;
        const method = seatContract.cancel(this.user.employeeNumber);
        if (method !== null) {
            method.then(data => {
                this.refreshSeats();
                alert('canceled success');
            }).catch(error => {
                console.log(error);
                this.alertService.error('Failed to cancel');
            });
        }
    }
}