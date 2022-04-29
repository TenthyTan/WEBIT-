const helpers = {
  isString: function(str) {
    if (typeof str === 'string' || str instanceof String)
        return true
    else
        return false
  },
  age: function(birth) {
      return (2022 - parseInt(birth))
  },
  isInRange: function(max, min, number) {
    if (number == null)
        return false;

    if (number <= max && number >= min)
        return true;
  },
  ifRecorded: function(status, options) {
      if (status == "Recorded") {
          return options.fn(this);
      }
      return options.inverse(this);
  },
  ifUnrecorded: function(status, options) {
      if (status == "Unrecorded") {
          return options.fn(this);
      }
      return options.inverse(this);
  },
  ifNoneed: function(status, options) {
      if (status == "Not Required") {
          return options.fn(this);
      }
      return options.inverse(this);
  },
  ifOutSideThresholds: function(status,value,minThreshold,maxThreshold, options){
    if (status == "Recorded") {
      if (value < minThreshold){
        return options.fn(this);
      }
      if (value > maxThreshold){
        return options.fn(this);
      }
      else{
        return options.inverse(this);
      }
    }
  },
}

  
  module.exports.helpers = helpers;

// thresholds write here