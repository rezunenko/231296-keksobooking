'use strict';

(function () {
  var getRandomValue = function (max, min, precision) {
    precision = precision || 0;
    min = min || 0;
    var random = Math.random() * (max - min) + min;

    return Math.round(random * Math.pow(10, precision)) / Math.pow(10, precision);
  };

  var getRandomArraySubset = function (arr) {
    var subsetLength = getRandomValue(arr.length);
    var subset = [];
    var item = null;

    for (var i = 0; i < subsetLength; i++) {
      item = arr[getRandomValue(arr.length - 1)];
      if (subset.indexOf(item) + 1) {
        i--;
      } else {
        subset.push(item);
      }
    }

    return subset;
  };

  var getRandomArrayItem = function (arr) {

    return arr[getRandomValue(arr.length - 1)];
  };

  var compareRandom = function () {
    return Math.random() - 0.5;
  };

  var suplementWithZero = function (value, precision) {
    var result = (value || '').toString();
    for (var i = value.toString().length; i < precision; i++) {
      result = '0' + result;
    }
    return result;
  };

  window.utils = {
    getRandomValue: getRandomValue,
    getRandomArraySubset: getRandomArraySubset,
    getRandomArrayItem: getRandomArrayItem,
    compareRandom: compareRandom,
    suplementWithZero: suplementWithZero
  };
})();
