'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var mapPins = document.querySelector('.map__pins');
  var mainPin = document.querySelector('.map__pin--main');
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
    window.pin.deactivate();
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

  var onDragStart = function (e) {
    e.preventDefault();
    var DRAG_Y_BOUND = {
      min: 100,
      max: 670
    };
    var startCoords = {
      x: e.clientX,
      y: e.clientY
    };

    var onMouseMove = function (evt) {
      evt.preventDefault();
      var shift = {
        x: startCoords.x - evt.clientX,
        y: startCoords.y - evt.clientY
      };
      var newY = mainPin.offsetTop - shift.y;
      var newX = mainPin.offsetLeft - shift.x;
      if (newY < DRAG_Y_BOUND.min || newY > DRAG_Y_BOUND.max) {
        return;
      }

      startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      mainPin.style.top = newY + 'px';
      mainPin.style.left = newX + 'px';
    };

    var onMouseUp = function (evt) {
      evt.preventDefault();
      var addressField = document.querySelector('#address');
      if (addressField) {
        addressField.value = 'x: {{' + startCoords.x + '}}, y: {{' + startCoords.y + '}}';
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var onRenderPins = function (e) {
    e.preventDefault();
    renderMapPins(window.posts);

    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pins.length; i++) {
      pins[i].addEventListener('click', onOpenPin);
      pins[i].addEventListener('keydown', onOpenPin);
    }

    mainPin.addEventListener('mousedown', onDragStart);
    mainPin.removeEventListener('mouseup', onRenderPins);
  };


  mainPin.addEventListener('mouseup', onRenderPins);
})();
