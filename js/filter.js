'use strict';

(function () {
  var filter = {};
  var data = null;
  var onFilterCalback = null;

  var featureCheckboxes = Array.from(document.querySelectorAll('.features input'));
  var featureSelectors = Array.from(document.querySelectorAll('.map__filters select'));

  var isPriceEqual = function (type, value) {
    switch (type) {
      case 'low':
        return value < 10000;
      case 'middle':
        return value >= 10000 && value < 50000;
      default:
        return value >= 50000;
    }
  };

  var getFilteredData = function (item) {
    var res = !Object.keys(filter).some(function (key) {
      var filterType = key.split('-')[0];
      var filterName = key.split('-')[1];
      var filterValue = filter[key];

      switch (filterType) {
        case 'filter':

          return item.offer.features.indexOf(filterName) === -1;
        case 'housing':

          return filterName === 'price' ?
            !isPriceEqual(filterValue, item.offer[filterName]) : +item.offer[filterName] !== +filterValue;
        default:

          return false;
      }
    });

    return res;
  };

  var onCheckboxChange = function (e) {
    e.preventDefault();

    if (e.target.checked) {
      filter[e.target.id] = true;
    } else {
      delete filter[e.target.id];
    }

    var asd = data.filter(getFilteredData);
    onFilterCalback(asd);
  };

  var onSelectChange = function (e) {

    if (e.target.value !== 'any') {
      filter[e.target.id] = e.target.value;
    } else {
      delete filter[e.target.id];
    }

    onFilterCalback(data.filter(getFilteredData));
  };

  var activate = function (arr, onFilter) {
    data = arr.slice();
    onFilterCalback = onFilter;

    featureCheckboxes.forEach(function (feature) {
      feature.addEventListener('change', onCheckboxChange);
    });

    featureSelectors.forEach(function (feature) {
      feature.addEventListener('change', onSelectChange);
    });
  };

  window.filter = {
    activate: activate
  };
})();
