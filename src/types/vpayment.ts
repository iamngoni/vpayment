import Transaction from "./transaction";

/**
 * VPayment Class
 * 
 * @param returnUrl {String} The URL on the merchant website the client will be redirected to after processing the transaction
 * @param confirmUrl {String} The URL on the vPayments server can use to announce transaction results to the merchant site
 */

export default class VPayment{
  constructor(
    public returnUrl: string,
    public confirmUrl: string,
    public merchantId: string,
    private merchantSecret: string
  ) { }
  
  /**
   * Create a VPayment transaction instance
   * @param reference 
   * @param amount 
   * @param additionalInfo
   * 
   * @returns transaction {Transaction}
   */
  createTransaction(reference: string, amount: string, additionalInfo: string) {
    return new Transaction(reference, amount, additionalInfo);
  }

  /**
   * Process VPayment transaction
   * @param transaction {Transaction}
   */
  process(transaction: Transaction) {
    return this.init(transaction);
  }

  init(transaction: Transaction) {
    let data = this.build(transaction);
    //TODO: forward payment to vpayments server
  }


  build(transaction: Transaction) {
    let data = {
      confirmUrl: this.confirmUrl,
      returnUrl: this.returnUrl,
      reference: transaction.reference,
      amount: transaction.amount.toString(),
      storeFrontId: this.merchantId,
      additionalInfo: transaction.additionInfo,
      status: transaction.status
    };

    for (const key of Object.keys(data)) {
      if (key === "hash") continue;
      data[key] = this.urlEncode(data[key]);
    }

    data["hash"] = this.generateHash(transaction);
    return data;
  }


  /**
   * URL encodes the given string
   * @param str {String}
   * @returns {String}
   */
  urlEncode(url: string) {
    return encodeURI(url);
  }

  generateHash(transaction: Transaction) {
    let sha512 = require("js-sha512").sha512;

    let data = {
      confirmUrl: this.confirmUrl,
      returnUrl: this.returnUrl,
      reference: transaction.reference,
      amount: transaction.amount,
      storeFrontId: this.merchantId,
      additionalInfo: transaction.additionInfo,
      status: transaction.status
    };

    let conString: string = "";
    for (const key of Object.keys(data)) {
      conString += data[key];
    }

    conString += this.merchantSecret;
    return sha512(conString).toUpperCase();
  }
}
