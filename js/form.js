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

  var form = document.querySelector('.notice__form');
  var capacitySelector = document.querySelector('#capacity');
  var price = document.querySelector('#price');
  var timein = document.querySelector('#timein');
  var timeout = document.querySelector('#timeout');
  var housingType = document.querySelector('#type');
  var addressField = document.querySelector('#address');

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

  var onInputBlur = function (e) {
    if (!e.target.checkValidity()) {
      e.target.style.boxShadow = '0 0 5px 1px red';
    }
  };

  var onInputFocus = function (e) {
    e.target.style.boxShadow = '';
  };

  var showForm = function () {
    var fieldsets = form.querySelectorAll('fieldset[disabled]');
    form.classList.remove('notice__form--disabled');

    Array.from(fieldsets).forEach(function (field) {
      field.removeAttribute('disabled');
    });
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

    Array.from(form.querySelectorAll('input')).forEach(function (input) {
      input.addEventListener('blur', onInputBlur);
      input.addEventListener('focus', onInputFocus);
    });
  };

  var setAddress = function (address) {
    addressField.value = address;
  };

  window.synchronizeFields(timeinObj, timeoutObj, onChangeTime);
  window.synchronizeFields(housingTypeObj, housingPriceObj, onChangeHousingType, {isUnidirectional: true});
  document.querySelector('#room_number').addEventListener('change', onChangeRoomNumber);

  form.addEventListener('submit', function (e) {
    window.backend.save(new FormData(form), function () {
      window.popup.show('Данные успешно отправлены', {backgroundColor: 'green'});
    }, function (msg) {
      window.popup.show(msg);
    });
    e.preventDefault();
  });

  window.form = {
    showForm: showForm,
    setAddress: setAddress
  };
})();
