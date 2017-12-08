'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var mapPins = document.querySelector('.map__pins');
  var REQUIERED_MODULES = [
    'pin',
    'posts',
    'card'
  ];

  var _undefinedModules = [];

  for (var j = 0; j < REQUIERED_MODULES.length; j++) {
    if (!window[REQUIERED_MODULES[j]]) {
      _undefinedModules.push(REQUIERED_MODULES[j]);
    }
  }

  if (_undefinedModules.length > 0) {
    throw new Error('To use the module the following subjects should be declared in the global scope: ' + _undefinedModules.join(', '));
  }

  var renderMapPins = function (postList) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < postList.length; i++) {
      fragment.appendChild(window.pin.createPin(window.posts[i]));
    }

    mapPins.appendChild(fragment);
  };

  var onOpenPin = function (e) {
    var currentPin = e.currentTarget;
    var id = currentPin.dataset.id;
    if (e.type === 'keydown' && e.keyCode !== ENTER_KEYCODE) {
      return;
    }
    if (window.card.activePin) {
      window.card.activePin.classList.remove('map__pin--active');
    }
    currentPin.classList.add('map__pin--active');
    window.card.activePin = currentPin;

    var popup = window.card.renderMapPopup(window.posts[id - 1]);
    window.card.showPopup(popup);
  };

  var onRenderPins = function () {
    renderMapPins(window.posts);
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pins.length; i++) {
      pins[i].addEventListener('click', onOpenPin);
      pins[i].addEventListener('keydown', onOpenPin);
    }
    document.querySelector('.map__pin--main').removeEventListener('mouseup', onRenderPins);
  };

  document.querySelector('.map__pin--main').addEventListener('mouseup', onRenderPins);
})();
