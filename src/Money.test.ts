import { Money } from './Money';

describe('Money', () => {
  it('throws if amount is a float', () => {
    expect(() => new Money(0.1, 'CAD')).toThrow();
  });

  describe('sum', () => {
    it('three numbers', () => {
      const a = new Money(1, 'CAD');
      const c = new Money(90, 'CAD');
      const b = new Money(10, 'CAD');
      expect(Money.sum([a, b, c])).toHaveProperty('amount', 101);
    });
  });

  describe('add', () => {
    it('two numbers', () => {
      const a = new Money(1, 'CAD');
      const b = new Money(10, 'CAD');
      expect(a.add(b)).toHaveProperty('amount', 11);
    });

    it('throws if different currencies', () => {
      const a = new Money(1, 'CAD');
      const b = new Money(10, 'EUR');
      expect(() => a.add(b)).toThrow();
    });
  });

  describe('subtract', () => {
    it('two numbers', () => {
      const a = new Money(100, 'CAD');
      const b = new Money(90, 'CAD');
      expect(a.subtract(b)).toHaveProperty('amount', 10);
    });

    it('throws if different currencies', () => {
      const a = new Money(100, 'CAD');
      const b = new Money(90, 'EUR');
      expect(() => a.subtract(b)).toThrow();
    });
  });

  describe('multiply', () => {
    it('two integers', () => {
      const a = new Money(100, 'CAD');
      expect(a.multiply(4)).toHaveProperty('amount', 400);
    });

    it('float', () => {
      const a = new Money(14, 'CAD');
      expect(a.multiply(0.3)).toHaveProperty('amount', 4);
    });
  });

  describe('greaterThan', () => {
    it('greater', () => {
      const a = new Money(100, 'CAD');
      const b = new Money(90, 'CAD');
      expect(a.greaterThan(b)).toBe(true);
    });

    it('equal', () => {
      const a = new Money(100, 'CAD');
      const b = new Money(100, 'CAD');
      expect(a.greaterThan(b)).toBe(false);
    });

    it('equal', () => {
      const a = new Money(100, 'CAD');
      const b = new Money(1000, 'CAD');
      expect(a.greaterThan(b)).toBe(false);
    });
  });

  describe('lessThan', () => {
    it('greater', () => {
      const a = new Money(100, 'CAD');
      const b = new Money(90, 'CAD');
      expect(a.lessThan(b)).toBe(false);
    });

    it('equal', () => {
      const a = new Money(100, 'CAD');
      const b = new Money(100, 'CAD');
      expect(a.lessThan(b)).toBe(false);
    });

    it('equal', () => {
      const a = new Money(100, 'CAD');
      const b = new Money(1000, 'CAD');
      expect(a.lessThan(b)).toBe(true);
    });
  });

  describe('format', () => {
    // NOTE: en-CA locale is not available in node unless we add full-icu
    // https://stackoverflow.com/questions/55183776/different-behaviour-of-intl-numberformat-in-node-and-browser/55183777#55183777
    it('CAD', () => {
      const a = new Money(123, 'CAD');
      expect(a.format()).toBe('CA$1.23');
    });

    it('includes thousand separators', () => {
      const a = new Money(12345678, 'CAD');
      expect(a.format()).toBe('CA$123,456.78');
    });

    it('USD', () => {
      const a = new Money(123, 'USD');
      expect(a.format()).toBe('$1.23');
    });

    it('EUR', () => {
      const a = new Money(123, 'EUR');
      expect(a.format()).toBe('€1.23');
    });
  });
});
