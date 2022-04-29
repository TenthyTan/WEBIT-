const helpers = {
  isString(str) {
    if (typeof str === 'string' || str instanceof String)
        return true
    else
        return false
  },
  age(birth) {
      return (2022 - parseInt(birth))
  },
  isInRange(max, min, number) {
    if (number == null)
        return false;

    if (number <= max && number >= min)
        return true;
  },
  ifRecorded(status, options) {
      if (status == "recorded") {
          return options.fn(this);
      }
      return options.inverse(this);
  },
  ifUnrecorded(status, options) {
      if (status == "unrecorded") {
          return options.fn(this);
      }
      return options.inverse(this);
  },
  ifNoneed(status, options) {
      if (status == "Not Required") {
          return options.fn(this);
      }
      return options.inverse(this);
  },
}

  
  module.exports.helpers = helpers;

// thresholds write here