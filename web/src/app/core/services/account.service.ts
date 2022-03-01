import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../models';
import { Web3Request } from '../models/web3-request';

@Injectable({ providedIn: 'root' })
export class AccountService {
    public userSubject: BehaviorSubject<User | null>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.readUserFromStorage();
        this.user = this.userSubject.asObservable();
    }

    private readUserFromStorage() {
        const str = localStorage.getItem('user');
        if (str !== null && str.trim.length > 0) {
            this.userSubject = new BehaviorSubject<User>(JSON.parse(str));
        } else {
            this.userSubject = new BehaviorSubject<User>(null);
        }
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    public get isLogout(): boolean {
        if (this.userSubject.value !== null) {
            let objLength = Object.keys(this.userSubject.value).length;
            return objLength == 0;
        }
        return true;
    }

    login(environmentName: string, contractAddress: string, senderWalletAddress: string, username: string): Observable<User> {
        return this.http.post<User>(`${environment.apiUrl}/users/authenticate`,
            new User(0, username, new Web3Request(environmentName, contractAddress, senderWalletAddress)))
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: number) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

}