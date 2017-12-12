'use strict';

(function () {
  var HOUSING_MIN_PRICE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var capacitySelector = document.querySelector('#capacity');
  var price = document.querySelector('#price');
  var timein = document.querySelector('#timein');
  var timeout = document.querySelector('#timeout');
  var housingType = document.querySelector('#type');

  var getSelectValues = function (select) {

    return [].slice.apply(select.children || [])
        .map(function (item) {
          return item.value;
        });
  };

  var timeinObj = {
    elem: timein,
    values: getSelectValues(timein)
  };
  var timeoutObj = {
    elem: timeout,
    values: getSelectValues(timeout)
  };

  var housingTypeObj = {
    elem: housingType,
    values: getSelectValues(housingType)
  };

  var housingPriceObj = {
    elem: price,
    values: Object.keys(HOUSING_MIN_PRICE).map(function (key) {

      return HOUSING_MIN_PRICE[key];
    })
  };

  var onChangeTime = function (element, value) {
    element.value = value;
  };

  var onChangeHousingType = function (element, value) {
    element.min = value;
    if (+element.value < +element.min) {
      element.value = value;
    }
  };

  var onChangeRoomNumber = function (e) {
    var roomNumber = +e.target.value;
    var capacitySelectedIndex = null;
    for (var i = 0; i < capacitySelector.options.length; i++) {
      var option = capacitySelector.options[i];
      var optionValue = +option.value;
      if (roomNumber === 100 && optionValue !== 0 || roomNumber !== 100 && (optionValue > roomNumber || optionValue === 0)) {
        option.setAttribute('hidden', '');
      } else {
        option.removeAttribute('hidden');
        if (capacitySelectedIndex === null) {
          capacitySelectedIndex = i;
        }
      }
    }
    capacitySelector.selectedIndex = capacitySelectedIndex;
  };

  var showForm = function () {
    var fieldsets = document.querySelectorAll('.notice__form fieldset[disabled]');
    document.querySelector('.map').classList.remove('map--faded');
    document.querySelector('.notice__form').classList.remove('notice__form--disabled');

    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].removeAttribute('disabled');
    }
    document.querySelector('.map__pin--main').removeEventListener('mouseup', showForm);
    document.querySelector('#title').addEventListener('input', function (e) {
      var target = e.target;
      var minLength = parseInt(e.target.getAttribute('minLength'), 10);
      if (minLength && target.value.length < minLength) {
        target.setCustomValidity('Имя должно состоять минимум из ' + minLength + ' символов');
      } else {
        target.setCustomValidity('');
      }
    });
  };

  window.synchronizeFields(timeinObj, timeoutObj, onChangeTime);
  window.synchronizeFields(housingTypeObj, housingPriceObj, onChangeHousingType, {isUnidirectional: true});
  document.querySelector('#room_number').addEventListener('change', onChangeRoomNumber);
  document.querySelector('.map__pin--main').addEventListener('mouseup', showForm);
})();
