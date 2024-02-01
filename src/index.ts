// Вам необхідно розширити поведінку прикладу з банківським рахунком. Додайте до нашої програми компонент Bank, який вміє створювати ти закривати акаунти для клієнтів. Кліент може мати декілька аккаунтів з різними типами валют. Bank повинен бути Singleton!

// * Для тих, кому цікаво ускладнити - додайте можливість ставити транзацкції у чергу та мати можливість їх повторювати чи відміняти (Command)


interface IBankClient {
    firstName: string;
    lastName: string;
  }
  
  class BankClient implements IBankClient {
    private _accounts: IAccount[];
  
    constructor(
      private readonly _firstName: string,
      private readonly _lastName: string,
      private readonly _bday: number,
      private _accountNumber: string | null = null,
    ) {
      this._accounts = [{ iban: '', currency: '' }];
    }
  
    public get accountNumber(): string {
      if (!this._accountNumber) throw new Error('Client does not have an account number. New client');
      return this._accountNumber;
    }
  
    public set accountNumber(value: string) {
      this._accountNumber = value;
    }
  
    public get age(): number {
      return new Date().getFullYear() - this._bday
    }
  
    public get firstName(): string {
      return this._firstName
    }
  
    public get lastName(): string {
      return this._lastName
    }
  }
  
  interface IAccount {
    iban: string;
    currency: string;
  }
  
  class BankAccount {
    private readonly iban: IAccount[];
    private _isActive: boolean;
  
    constructor(
      private readonly holder: IBankClient,
      private readonly currency: string,
      private balance = 0
    ) {
      this.iban = [{ iban: this.createIBAN(this.currency), currency: this.currency }];
      this._isActive = true;
    }
  
    public get holderFullName(): string {
      return `${this.holder.lastName} ${this.holder.firstName}`;
    }
  
    public get info(): string {
      return `${this.balance}${this.currency}`;
    }
  
    public set close(value: boolean) {
      this._isActive = value;
    }
  
    public createIBAN(currency: string): string {
      return `${currency}${(Math.random().toFixed(10)).toString().slice(2)}`
    }
  
    public deposit(amount: number): void {
      this.balance += amount;
    }
  
    public withdraw(amount: number): void {
      if (this.balance < amount) throw new Error(`${this.holderFullName}, insufficient funds for withdrawal`);
      this.balance -= amount;
    }
  
    public getNumber(currency: string): IAccount[] {
      return this.iban.filter(num => num.currency === currency ? num.iban : false)
    }
  
    public createAccount(client: IBankClient, account: IAccount) {
      if (client.firstName !== this.holder.firstName || client.lastName !== this.holder.lastName) {
        throw new Error('Client not found');
      } else {
        this.iban.push(account);
      }
    }
  }
  
  class Bank {
    private static _bankInstance: Bank;
    private accounts: BankAccount[] = [];
  
    private constructor() {}
  
    public static getBankInstance() {
      if (!Bank._bankInstance) {
        Bank._bankInstance = new Bank();
      }
      return Bank._bankInstance;
    }
  
    public createAccount(client: IBankClient, account: IAccount): BankAccount {
      const bankAccount = new BankAccount(client, account.currency);
      bankAccount.createAccount(client, account);
      this.accounts.push(bankAccount);
      return bankAccount;
    }
  
    public closeAccount(iban: string): void {
      this.accounts = this.accounts.filter(account => account.getNumber(account.info)[0].iban !== iban);
    }
  }
  
  