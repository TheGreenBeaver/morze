import { DateTime } from 'luxon';


class ZDate {
  constructor(raw, customFormat) {
    let dt;
    if (raw instanceof Date) {
      dt = DateTime.fromJSDate(raw);
    } else if (typeof raw === 'number') {
      dt = DateTime.fromMillis(raw);
    } else if (typeof raw === 'string') {
      dt = customFormat ? DateTime.fromFormat(raw, customFormat) : DateTime.fromISO(raw);
    } else if (raw == null) {
      dt = DateTime.fromJSDate(new Date(0));
    } else {
      dt = DateTime.now();
    }
    this.dt = dt;
  }

  isSame(other) {
    if (other instanceof ZDate) {
      return +other.dt === +this.dt;
    }

    this.isSame(zDate(other));
  }

  isBefore(other, strict = false) {
    if (other instanceof ZDate) {
      return strict ? other.dt > this.dt : other.dt >= this.dt;
    }

    return this.isBefore(zDate(other), strict);
  }

  isAfter(other, strict = false) {
    if (other instanceof ZDate) {
      return strict ? other.dt < this.dt : other.dt <= this.dt;
    }

    return this.isAfter(zDate(other), strict);
  }

  notSameDate(other) {
    if (other instanceof ZDate) {
      const thisDayStart = this.dt.startOf('day');
      const otherDayStart = other.dt.startOf('day');
      return thisDayStart.diff(otherDayStart, 'days').toObject().days >= 1;
    }

    return this.notSameDate(zDate(other));
  }

  fTime() {
    return this.dt.toFormat('HH:mm');
  }

  fDate() {
    return this.dt.toFormat('MMMM d');
  }
}

function zDate(raw) {
  return new ZDate(raw);
}

export default zDate;
export { ZDate };