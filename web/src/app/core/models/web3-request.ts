export class Web3Request {
    public readonly environment: string | undefined;;
    public readonly contractAddress: string | undefined;;
    public readonly senderWalletAddress: string | undefined;;
    public readonly gas: string = '20000000000';// default gas price in wei, 20 gwei in this case
    public readonly gasLimit: string = '300000';

    constructor(_environment: string, _contractAddress: string, _senderWalletAddress: string) {
        this.environment = _environment;
        this.contractAddress = _contractAddress;
        this.senderWalletAddress = _senderWalletAddress;
    }
}