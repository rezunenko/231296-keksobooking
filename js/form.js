'use strict';

(function () {
  if (!window.backend) {
    throw new Error('To use the module, the backend module should be declared in the global scope');
  }

  if (!window.backend.save) {
    throw new Error('The save function should be declared in the backend module');
  }

  var HOUSING_MIN_PRICE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var MIN_ROOMS_NUMBER = 0;
  var MAX_ROOMS_NUMBER = 100;
  var formElement = document.querySelector('.notice__form');
  var capacitySelectorElement = document.querySelector('#capacity');
  var priceElement = document.querySelector('#price');
  var timeinElement = document.querySelector('#timein');
  var timeoutElement = document.querySelector('#timeout');
  var housingTypeElement = document.querySelector('#type');
  var addressElement = document.querySelector('#address');

  var getSelectValues = function (element) {

    return [].slice.apply(element.children || [])
        .map(function (item) {
          return item.value;
        });
  };

  var timeinObj = {
    elem: timeinElement,
    values: getSelectValues(timeinElement)
  };
  var timeoutObj = {
    elem: timeoutElement,
    values: getSelectValues(timeoutElement)
  };

  var housingTypeObj = {
    elem: housingTypeElement,
    values: getSelectValues(housingTypeElement)
  };

  var housingPriceObj = {
    elem: priceElement,
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
    Array.from(capacitySelectorElement.options).forEach(function (option, i) {
      var optionValue = +option.value;
      if (roomNumber === MAX_ROOMS_NUMBER && optionValue !== MIN_ROOMS_NUMBER || roomNumber !== MAX_ROOMS_NUMBER && (optionValue > roomNumber || optionValue === MIN_ROOMS_NUMBER)) {
        option.setAttribute('hidden', '');
      } else {
        option.removeAttribute('hidden');
        if (capacitySelectedIndex === null) {
          capacitySelectedIndex = i;
        }
      }
    });
    capacitySelectorElement.selectedIndex = capacitySelectedIndex;
  };

  var onInputBlur = function (e) {
    if (!e.target.checkValidity()) {
      e.target.style.boxShadow = '0 0 5px 1px red';
    }
  };

  var onInputFocus = function (e) {
    e.target.style.boxShadow = '';
  };

  var onTitleValidate = function (e) {
    var target = e.target;
    var minLength = parseInt(e.target.getAttribute('minLength'), 10);
    if (minLength && target.value.length < minLength) {
      target.setCustomValidity('Имя должно состоять минимум из ' + minLength + ' символов');
    } else {
      target.setCustomValidity('');
    }
  };

  var showForm = function () {
    var fieldsets = formElement.querySelectorAll('fieldset[disabled]');
    formElement.classList.remove('notice__form--disabled');

    Array.from(fieldsets).forEach(function (field) {
      field.removeAttribute('disabled');
    });

    Array.from(formElement.querySelectorAll('input')).forEach(function (input) {
      input.addEventListener('blur', onInputBlur);
      input.addEventListener('focus', onInputFocus);
    });

    document.querySelector('#title').addEventListener('input', onTitleValidate);
  };

  var setAddress = function (cordinates) {
    addressElement.value = 'x: {{' + cordinates.x + '}}, y: {{' + cordinates.y + '}}';
  };

  window.synchronizeFields(timeinObj, timeoutObj, onChangeTime);
  window.synchronizeFields(housingTypeObj, housingPriceObj, onChangeHousingType, {isUnidirectional: true});
  document.querySelector('#room_number').addEventListener('change', onChangeRoomNumber);

  var onSubmitSuccess = function () {
    window.popup.show('Данные успешно отправлены', {backgroundColor: 'green'});
  };

  var onSubmitError = function (msg) {
    window.popup.show(msg);
  };

  formElement.addEventListener('submit', function (e) {
    window.backend.save(new FormData(formElement), onSubmitSuccess, onSubmitError);
    e.preventDefault();
  });

  window.form = {
    showForm: showForm,
    setAddress: setAddress
  };
})();
