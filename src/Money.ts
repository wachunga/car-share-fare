export class Money {
  amount: number;
  currency: string; // TODO: ISO 4217 currency code

  static zero(currency: string): Money {
    return new Money(0, currency);
  }

  static sum(monies: Money[]): Money {
    if (!monies.length) {
      throw new Error('nothing to sum');
    }

    const currency = monies[0].currency;
    return monies.reduce((memo, money) => memo.add(money), Money.zero(currency));
  }

  constructor(amount: number, currency: string) {
    if (!Number.isInteger(amount)) {
      throw new TypeError('amount must be an integer');
    }

    this.amount = amount;
    this.currency = currency;
  }

  add(money: Money) {
    if (this.currency !== money.currency) {
      throw new Error('cannot add amounts with different currencies');
    }
    return new Money(this.amount + money.amount, this.currency);
  }

  subtract(money: Money) {
    if (this.currency !== money.currency) {
      throw new Error('cannot subtract amounts with different currencies');
    }
    return new Money(this.amount - money.amount, this.currency);
  }

  multiply(multiplier: number) {
    if (isFloat(multiplier)) {
      const newAmount = Math.round(floatMultiply(this.amount, multiplier));
      return new Money(newAmount, this.currency);
    }
    return new Money(this.amount * multiplier, this.currency);
  }

  greaterThan(other: Money) {
    if (this.currency !== other.currency) {
      throw new Error('cannot compare amounts with different currencies');
    }

    return this.amount > other.amount;
  }

  lessThan(other: Money) {
    if (this.currency !== other.currency) {
      throw new Error('cannot compare amounts with different currencies');
    }

    return this.amount < other.amount;
  }

  format(locale: string = 'en-CA') {
    return this.getValue().toLocaleString(locale, {
      style: 'currency',
      currency: this.currency,
    });
  }

  getValue(): number {
    // assumes precision 2, like CAD etc.
    return this.amount / 100;
  }
}
function isFloat(n: number): boolean {
  return Number(n) === n && n % 1 !== 0;
}

function countFractionDigits(n: number): number {
  const fractionDigits = n.toString().split('.')[1];
  return fractionDigits ? fractionDigits.length : 0;
}

function getFactor(n: number) {
  return Math.pow(10, countFractionDigits(n));
}

const floatMultiply = (a: number, b: number): number => {
  const factor = Math.max(getFactor(a), getFactor(b));
  return (Math.round(a * factor) * Math.round(b * factor)) / (factor * factor);
};
