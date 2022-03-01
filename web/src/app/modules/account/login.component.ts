import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, SeatReservationContract, Web3Service } from '../../core/services';
import { Seat } from 'src/app/core/models';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  environmentList: any = ['http://localhost:7545', 'Testnet', 'Mainnet'];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private web3Service: Web3Service
  ) {
    // redirect to home if already logged in
    if (this.accountService.userValue) {
      this.router.navigate(['/']);
    }
    this.form = this.formBuilder.group({
      environment: ['http://localhost:7545', Validators.required],
      senderWalletAddress: ['0x39ff80F216E56aF884Da05102a4F0D7Ca95b48Fe', Validators.required],
      contractAddress: ['0xC0af152A4beb75b4da48e4E0456fF6aA9a2AF0E3', Validators.required],
      username: ['A', Validators.required],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit() {
  }

  // convenience getter for easy access to form fields
  get f() {
    if (this.form !== undefined) {
      return this.form.controls;
    } else {
      return null;
    }
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form === undefined) {
      return;
    }
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    if (this.f === null) {
      return;
    }
    const env = this.f['environment'].value;
    const contract = this.f['contractAddress'].value;
    const sender = this.f['senderWalletAddress'].value;
    const username = this.f['username'].value;
    this.accountService.login(env, contract, sender, username)
      .pipe(first())
      .subscribe(
        data => {
          const seatContract = this.web3Service.connectSeatReservationContract(data.request);
          if (seatContract !== undefined && seatContract !== null) {
            const method = seatContract.getAllSeats();
            if (method !== null)
              method.then(_seats => {
                // navigate when it could reach Smart contract
                this.router.navigate([this.returnUrl]);
              }).catch(err => {
                this.alertService.error('Failed to connect the network.');
                this.loading = false;
              });
          }
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
}
