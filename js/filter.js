'use strict';

(function () {
  var SELECTS_WITH_STRINGS_VALUE = ['housing-type', 'housing-price'];
  var SHOW_DATA_LIMIT = 5;
  var PRICE_TYPES = {
    'low': {min: 0, max: 10000},
    'middle': {min: 10000, max: 50000},
    'high': {min: 50000}
  };
  var FILTER_TYPE_FILTER = 'filter';
  var FILTER_TYPE_HOUSING = 'housing';
  var FILTER_PRICE = 'price';
  var SHOW_ALL = 'any';
  var filter = {};
  var data = null;
  var onFilterCalback = null;
  var featureCheckboxes = Array.from(document.querySelectorAll('.features input'));
  var featureSelectors = Array.from(document.querySelectorAll('.map__filters select'));

  var isPriceEqual = function (type, value) {
    var priceType = PRICE_TYPES[type];

    return value >= priceType.min && (value < priceType.max || !priceType.max);
  };

  var getFilteredData = function (item) {

    return !Object.keys(filter).some(function (key) {
      var filterType = key.split('-')[0];
      var filterName = key.split('-')[1];
      var filterValue = filter[key];

      switch (filterType) {
        case FILTER_TYPE_FILTER:

          return item.offer.features.indexOf(filterName) === -1;
        case FILTER_TYPE_HOUSING:

          return filterName === FILTER_PRICE ?
            !isPriceEqual(filterValue, item.offer[filterName]) : item.offer[filterName] !== filterValue;
      }

      return false;
    });
  };

  var getData = function (length) {

    return data.filter(getFilteredData).slice(0, length);
  };

  var run = function (length) {
    onFilterCalback(getData(length || SHOW_DATA_LIMIT));
  };

  var changeCheckboxFilter = function (checkboxElement) {
    if (checkboxElement.checked) {
      filter[checkboxElement.id] = true;
    } else {
      delete filter[checkboxElement.id];
    }

    run();
  };

  var onCheckboxChange = function (e) {
    e.preventDefault();
    var checkboxElement = e.target;

    window.debounce(function () {
      changeCheckboxFilter(checkboxElement);
    });
  };

  var changeSelectFilter = function (selectElement) {
    if (selectElement.value !== SHOW_ALL && SELECTS_WITH_STRINGS_VALUE.indexOf(selectElement.name) !== -1) {
      filter[selectElement.id] = selectElement.value;
    } else if (selectElement.value !== SHOW_ALL) {
      filter[selectElement.id] = +selectElement.value;
    } else {
      delete filter[selectElement.id];
    }

    run();
  };

  var onSelectChange = function (e) {
    e.preventDefault();
    var select = e.target;

    window.debounce(function () {
      changeSelectFilter(select);
    });
  };

  var activate = function (arr, callback) {
    data = arr.slice();
    onFilterCalback = callback;

    featureCheckboxes.forEach(function (feature) {
      feature.addEventListener('change', onCheckboxChange);
    });

    featureSelectors.forEach(function (feature) {
      feature.addEventListener('change', onSelectChange);
    });
  };

  window.filter = {
    activate: activate,
    run: run
  };
})();
