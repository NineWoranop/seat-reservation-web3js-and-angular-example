import { Web3Request } from "./web3-request";

export class User {
    public readonly employeeNumber: number | undefined;
    public readonly username: string | undefined;
    public readonly request: Web3Request | undefined;
    public readonly token: string | undefined;

    constructor(_employeeNumber: number, _username: string, _request?: Web3Request, _token?: string) {
        this.employeeNumber = _employeeNumber;
        this.username = _username;
        this.request = _request;
        this.token = _token;
    }
}