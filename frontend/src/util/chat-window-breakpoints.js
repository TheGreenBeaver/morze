class CWBp {
  static names = {
    small: 'small',
    medium: 'medium',
    large: 'large',
  };

  static ordering = [this.names.small, this.names.medium, this.names.large];

  static intervals = {
    height: {
      [this.names.small]: [0, 350],
      [this.names.medium]: [351, 440],
      [this.names.large]: [441, Infinity]
    },
    width: {
      [this.names.small]: [0, 370],
      [this.names.medium]: [371, 440],
      [this.names.large]: [441, Infinity]
    }
  }

  static axis = {
    hor: 'h',
    vert: 'v',
  };

  constructor({ width = 0, height = 0 } = {}) {
    this.width = width;
    this.height = height;

    const h = Object.values(CWBp.names).find(bpName => {
      const interval = CWBp.intervals.width[bpName];
      return width >= interval[0] && width <= interval[1];
    });
    const v = Object.values(CWBp.names).find(bpName => {
      const interval = CWBp.intervals.height[bpName];
      return height >= interval[0] && height <= interval[1];
    });
    this.breakpoint = { h, v };
  }

  _applyComparison(other, axis, comparison) {
    if (!Object.values(CWBp.axis).includes(axis)) {
      throw new Error(`Axis must be one of ${Object.values(CWBp.axis).join(', ')}, or null`);
    }

    if (other instanceof CWBp) {
      if (axis) {
        return comparison(other.breakpoint[axis], this.breakpoint[axis]);
      }

      return {
        h: comparison(other.breakpoint.h, this.breakpoint.h),
        v: comparison(other.breakpoint.v, this.breakpoint.v)
      };
    }

    if (typeof other === 'string') {
      if (axis) {
        return comparison(other, this.breakpoint[axis]);
      }

      return {
        h: comparison(other, this.breakpoint.h),
        v: comparison(other, this.breakpoint.v)
      };
    }

    if (typeof other === 'number') {
      if (axis) {
        const interval = CWBp.intervals[axis][this.breakpoint];
        return comparison(other, interval);
      }

      return {
        h: comparison(other, CWBp.intervals.width[this.breakpoint]),
        v: comparison(other, CWBp.intervals.height[this.breakpoint])
      }
    }

    return false;
  }

  eq(other, axis) {
    return this._applyComparison(
      other,
      axis,
      (o, t) => Array.isArray(t)
        ? o >= t[0] && o <= t[1]
        : o === t
    );
  }

  // this larger than other
  gt(other, axis) {
    return this._applyComparison(
      other,
      axis,
      (o, t) => Array.isArray(t)
        ? o < t[0]
        : CWBp.ordering.indexOf(o) < CWBp.ordering.indexOf(t)
    );
  }

  // this smaller than other
  lt(other, axis) {
    return this._applyComparison(
      other,
      axis,
      (o, t) => Array.isArray(t)
        ? o > t[1]
        : CWBp.ordering.indexOf(o) > CWBp.ordering.indexOf(t)
    );
  }
}

export default CWBp;