import { Component } from '@angular/core';

import { AccountService } from './core/services';
import { User } from './core/models';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
    title = 'example';
    user?: User;

    constructor(private accountService: AccountService) {
        this.accountService.userSubject.subscribe(x => this.user = x);
    }

    logout() {
        this.accountService.logout();
    }
}