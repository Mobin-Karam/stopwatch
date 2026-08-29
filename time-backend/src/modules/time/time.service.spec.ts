import { TimeService } from './time.service';

describe('TimeService', () => {
  let service: TimeService;

  beforeEach(() => {
    service = new TimeService();
  });

  it('returns a world clock snapshot for default zones', () => {
    const result = service.worldClock();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('zone');
    expect(result[0]).toHaveProperty('localISO');
  });

  it('converts a given time into specific zones', () => {
    const result = service.convertTime('2024-01-01T12:00:00Z', [
      'UTC',
      'Asia/Tehran',
    ]);
    expect(result).toHaveLength(2);
    const utc = result.find((r) => r.zone === 'UTC');
    expect(utc?.localISO.startsWith('2024-01-01T12:00:00')).toBe(true);
  });

  it('throws for invalid time strings', () => {
    expect(() => service.convertTime('not-a-date')).toThrow('Invalid ISO time');
  });

  it('throws for invalid zones', () => {
    expect(() =>
      service.convertTime('2024-01-01T12:00:00Z', ['Mars/Base']),
    ).toThrow('Invalid time zone: Mars/Base');
  });
});
