'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var mapPins = document.querySelector('.map__pins');
  var REQUIERED_MODULES = [
    'pin',
    'posts',
    'card'
  ];
  var map = document.querySelector('.map');

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

  var onPopupClose = function (e) {
    var popup = document.querySelector('.map__card.popup');
    if (e.type === 'keydown' && e.keyCode !== ESC_KEYCODE
      || e.type === 'click' && !e.target.classList.contains('popup__close')) {
      return;
    }

    popup.setAttribute('hidden', '');
    popup.removeEventListener('click', onPopupClose);
    document.removeEventListener('keydown', onPopupClose);
    activePin.classList.remove('map__pin--active');
  };

  var showPopup = function (popup) {
    var oldPopup = map.querySelector('.map__card');
    if (oldPopup) {
      map.removeChild(oldPopup);
    }

    var newPopupElement = map.appendChild(popup);
    newPopupElement.addEventListener('click', onPopupClose);
    document.addEventListener('keydown', onPopupClose);
  };

  var onOpenPin = function (e) {
    var currentPin = e.currentTarget;
    var id = currentPin.dataset.id;
    if (e.type === 'keydown' && e.keyCode !== ENTER_KEYCODE) {
      return;
    }

    window.pin.toggle(currentPin);

    var popup = window.card.createPopup(window.posts[id - 1]);
    showPopup(popup);
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
