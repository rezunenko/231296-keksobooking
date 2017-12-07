'use strict';

(function() {
  var HOUSING_MIN_PRICE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var timin = document.querySelector('#timein');
  var timeout = document.querySelector('#timeout');
  var capacitySelector = document.querySelector('#capacity');
  var price = document.querySelector('#price');

  var onChangeTime = function(e) {
    var target = e.target;
    (target.id === 'timein' ? timeout : timin).value = target.value;
  };

  var onChangeRoomNumber = function(e) {
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

  var onChangeHousingType = function(e) {
    price.min = HOUSING_MIN_PRICE[e.target.value];
    if (+price.value < +price.min) {
      price.value = price.min;
    }
  };

  var showForm = function() {
    renderMapPins(posts);
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var j = 0; j < pins.length; j++) {
      pins[j].addEventListener('click', onOpenPin);
      pins[j].addEventListener('keydown', onOpenPin);
    }

    var fieldsets = document.querySelectorAll('.notice__form fieldset[disabled]');
    document.querySelector('.map').classList.remove('map--faded');
    document.querySelector('.notice__form').classList.remove('notice__form--disabled');

    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].removeAttribute('disabled');
    }
    document.querySelector('.map__pin--main').removeEventListener('mouseup', showForm);
    document.querySelector('#title').addEventListener('input', function(e) {
      var target = e.target;
      var minLength = parseInt(e.target.getAttribute('minLength'), 10);
      if (minLength && target.value.length < minLength) {
        target.setCustomValidity('Имя должно состоять минимум из ' + minLength + ' символов');
      } else {
        target.setCustomValidity('');
      }
    });
  };

  document.querySelector('#type').addEventListener('change', onChangeHousingType);
  document.querySelector('#timein').addEventListener('change', onChangeTime);
  document.querySelector('#timeout').addEventListener('change', onChangeTime);
  document.querySelector('#room_number').addEventListener('change', onChangeRoomNumber);
  document.querySelector('.map__pin--main').addEventListener('mouseup', showForm);
})();
