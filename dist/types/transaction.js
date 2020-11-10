export default class Transaction {
    constructor(reference, amount, additionInfo, status = "Message") {
        this.reference = reference;
        this.amount = amount;
        this.additionInfo = additionInfo;
        this.status = status;
    }
}
