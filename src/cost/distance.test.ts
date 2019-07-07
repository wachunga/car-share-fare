import { calculateDistanceCost } from './distance';

describe('calculateDistanceCost', () => {
  describe('single step', () => {
    const noDistanceConfig = {
      name: 'single step',
      service: 'n/a',
    };

    const simpleDistanceConfig = {
      name: 'single step',
      service: 'n/a',
      distance: {
        unit: 'km',
        steps: [{ start: 0, cost: 0.5 }],
      },
    };

    it('no distance charge', () => {
      const cost = calculateDistanceCost(noDistanceConfig, 10);
      expect(cost).toEqual(0);
    });

    it('no distance', () => {
      const cost = calculateDistanceCost(simpleDistanceConfig, 0);
      expect(cost).toEqual(0);
    });

    it('single step', () => {
      const cost = calculateDistanceCost(simpleDistanceConfig, 10);
      expect(cost).toEqual(5);
    });
  });

  describe('multi step', () => {
    const multiDistanceConfig = {
      name: 'multi step',
      service: 'n/a',
      distance: {
        unit: 'km',
        steps: [{ start: 0, end: 25, cost: 0.4 }, { start: 25, cost: 0.28 }],
      },
    };

    it('first step', () => {
      const cost = calculateDistanceCost(multiDistanceConfig, 10);
      expect(cost).toEqual(4);
    });
    it('first step end', () => {
      const cost = calculateDistanceCost(multiDistanceConfig, 25);
      expect(cost).toEqual(10);
    });
    it('second step start', () => {
      const cost = calculateDistanceCost(multiDistanceConfig, 25.1);
      expect(cost).toEqual(10 + 0.1 * 0.28);
    });
    it('second step', () => {
      const cost = calculateDistanceCost(multiDistanceConfig, 100);
      expect(cost).toEqual(10 + 75 * 0.28);
    });
  });
});
