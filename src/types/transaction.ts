export default class Transaction{
  constructor(
    public reference: string,
    public amount: string,
    public additionInfo: string,
    public status: string = "Message"
  ) {}
}