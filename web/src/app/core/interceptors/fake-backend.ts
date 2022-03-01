import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { User } from '../models';
import { Web3Request } from '../models/web3-request';

// array of registered users (Hard code)
let users = [new User(1, "A"), new User(2, "B"), new User(3, "C"), new User(4, "D"), new User(5, "E"), new User(6, "F"), new User(7, "G"), new User(8, "H"), new User(9, "I"), new User(10, "J")];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions

        function authenticate() {
            let u = <User>body;
            const user = users.find((x: User) => x.username === u.username);
            if (!user) return error('Username or password is incorrect');
            let newUser = new User(user.employeeNumber, user.username, u.request, 'fake-jwt-token');
            return ok(newUser)
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            const user = users.find((x: User) => x.employeeNumber === idFromUrl());
            return ok(user);
        }

        // helper functions

        function ok(body?: any) {
            if (typeof body !== 'undefined') {
                return of(new HttpResponse({ status: 200, body }))
            } else {
                return of(new HttpResponse({ status: 200 }))
            }
        }

        function error(message: any) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};