import { BadRequestException, Injectable } from '@nestjs/common';

const DEFAULT_ZONES = [
  'UTC',
  'America/New_York',
  'Europe/London',
  'Asia/Tehran',
  'Asia/Tokyo',
  'Australia/Sydney',
];

type ZoneSnapshot = {
  zone: string;
  localISO: string;
  offsetMinutes: number;
  offset: string;
};

@Injectable()
export class TimeService {
  worldClock(zones?: string[]): ZoneSnapshot[] {
    const now = new Date();
    return this.formatForZones(now, zones);
  }

  convertTime(isoTime: string, zones?: string[]): ZoneSnapshot[] {
    if (!isoTime) {
      throw new BadRequestException('Query parameter "time" is required');
    }

    const date = new Date(isoTime);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid ISO time');
    }

    return this.formatForZones(date, zones);
  }

  supportedZones(limit = 200): string[] {
    // Node 20 exposes the list of IANA zones; fall back to defaults if unavailable.
    try {
      const zones = (Intl as any).supportedValuesOf?.('timeZone') as
        | string[]
        | undefined;
      if (zones?.length) {
        return zones.slice(0, limit);
      }
    } catch (err) {
      // ignore
    }
    return DEFAULT_ZONES;
  }

  private formatForZones(date: Date, zones?: string[]): ZoneSnapshot[] {
    const list = this.normalizeZones(zones);

    return list.map((zone) => {
      if (!this.isValidZone(zone)) {
        throw new BadRequestException(`Invalid time zone: ${zone}`);
      }

      const { offsetMinutes, offsetLabel } = this.offsetFor(date, zone);
      const parts = new Intl.DateTimeFormat('sv-SE', {
        timeZone: zone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).formatToParts(date);

      const get = (type: string) =>
        parts.find((p) => p.type === type)?.value?.padStart(2, '0') ?? '00';

      const localISO = `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}${offsetLabel}`;

      return {
        zone,
        localISO,
        offsetMinutes,
        offset: offsetLabel,
      };
    });
  }

  private normalizeZones(zones?: string[]): string[] {
    const parsed =
      zones
        ?.flatMap((z) => z.split(','))
        .map((z) => z.trim())
        .filter(Boolean) ?? [];
    return parsed.length ? parsed : DEFAULT_ZONES;
  }

  private isValidZone(zone: string): boolean {
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: zone }).format();
      return true;
    } catch {
      return false;
    }
  }

  private offsetFor(date: Date, zone: string) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      timeZoneName: 'shortOffset',
      hour12: false,
    }).formatToParts(date);

    const label = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'Z';
    const match = label.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);

    if (!match) {
      return { offsetMinutes: 0, offsetLabel: '+00:00' };
    }

    const sign = match[1] === '-' ? -1 : 1;
    const hours = Number(match[2]);
    const minutes = Number(match[3] ?? '0');
    const total = sign * (hours * 60 + minutes);

    const offsetLabel = `${sign === 1 ? '+' : '-'}${hours
      .toString()
      .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return { offsetMinutes: total, offsetLabel };
  }
}
