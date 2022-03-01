import { Injectable } from '@angular/core';
import { Seat, Web3Request } from '../models';

declare let require: any;
const Web3 = require('web3');
//const ContractAbi = require('../../../../../solidity/build/contracts/SeatReservation.json');
const ContractAbi = require('../../../assets/SeatReservation.json');

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private seatReservationContract: SeatReservationContract;

  constructor() {
  }

  ngOnInit() {
  }

  connectSeatReservationContract(request: Web3Request): SeatReservationContract {
    const web3 = new Web3(new Web3.providers.HttpProvider(request.environment));

    var myContract = new web3.eth.Contract(ContractAbi.abi, request.contractAddress, {
      from: request.senderWalletAddress,
      gasPrice: request.gas,
      gasLimit: request.gasLimit
    });
    this.seatReservationContract = new SeatReservationContract(web3, myContract);
    return this.seatReservationContract;
  }

  get getSeatReservationContract() {
    if (this.seatReservationContract !== undefined) {
      return this.seatReservationContract;
    } else {
      return null;
    }
  }
}

export class SeatReservationContract {
  public readonly web3: any;
  public readonly contract: any;

  constructor(_web3: any, _contract: any) {
    this.web3 = _web3;
    this.contract = _contract;
  }

  getCurrentSeat(_employeeNumber: number): Promise<string> {
    try {
      return this.contract.methods.getCurrentSeat(_employeeNumber).call();
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  getAllSeats(): Promise<boolean[]> {
    try {
      return this.contract.methods.getAllSeats().call();
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  book(_seatNumber: number, _employeeNumber: number): Promise<boolean> {
    try {
      return this.contract.methods.book(_seatNumber, _employeeNumber).send();
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  cancel(_employeeNumber: number): Promise<boolean> {
    try {
      return this.contract.methods.cancel(_employeeNumber).send();
    } catch (e) {
      console.log(e);
    }
    return null;
  }
}
