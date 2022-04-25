const helpers = {
    ifRecorded: function (status, options) {
      if (status == "recorded") {
        return options.fn(this);
      }
      return options.inverse(this);
    },
  
    ifUnrecorded: function (status, options) {
      if (status == "unrecorded") {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    ifNoneed: function (status, options) {
        if (status == "No need") {
          return options.fn(this);
        }
        return options.inverse(this);
    },
  };
  
  module.exports.helpers = helpers;

// thresholds write here