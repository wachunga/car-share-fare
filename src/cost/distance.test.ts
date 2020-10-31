import { calculateDistanceCost } from './distance';

describe('calculateDistanceCost', () => {
  describe('single step', () => {
    const noDistanceConfig = {
      name: 'single step',
      currency: 'CAD',
      service: 'n/a',
    };

    const simpleDistanceConfig = {
      name: 'single step',
      currency: 'CAD',
      service: 'n/a',
      distance: {
        unit: 'km',
        steps: [{ start: 0, cost: 50 }],
      },
    };

    it('no distance charge', () => {
      const cost = calculateDistanceCost(noDistanceConfig, 10);
      expect(cost).toHaveProperty('amount', 0);
    });

    it('no distance', () => {
      const cost = calculateDistanceCost(simpleDistanceConfig, 0);
      expect(cost).toHaveProperty('amount', 0);
    });

    it('single step', () => {
      const cost = calculateDistanceCost(simpleDistanceConfig, 10);
      expect(cost).toHaveProperty('amount', 500);
    });
  });

  describe('multi step', () => {
    const multiDistanceConfig = {
      name: 'multi step',
      currency: 'CAD',
      service: 'n/a',
      distance: {
        unit: 'km',
        steps: [
          { start: 0, end: 25, cost: 40 },
          { start: 25, cost: 28 },
        ],
      },
    };

    it('first step', () => {
      const cost = calculateDistanceCost(multiDistanceConfig, 10);
      expect(cost).toHaveProperty('amount', 400);
    });
    it('first step end', () => {
      const cost = calculateDistanceCost(multiDistanceConfig, 25);
      expect(cost).toHaveProperty('amount', 25 * 40);
    });
    it('second step start', () => {
      const cost = calculateDistanceCost(multiDistanceConfig, 25.1);
      expect(cost).toHaveProperty('amount', 25 * 40 + Math.round(0.1 * 28));
    });
    it('second step', () => {
      const cost = calculateDistanceCost(multiDistanceConfig, 100);
      expect(cost).toHaveProperty('amount', 25 * 40 + Math.round(75 * 28));
    });
  });
});
