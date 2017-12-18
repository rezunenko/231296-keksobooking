'use strict';

(function () {
  var PIN_SIZE = 40;
  var PIN_TAIL_HEIGHT = 18;
  var activePin = null;

  var create = function (post) {
    var btn = document.createElement('button');
    var img = document.createElement('img');
    btn.style.left = post.location.x + 'px';
    btn.style.top = (post.location.y - PIN_SIZE / 2 + PIN_TAIL_HEIGHT) + 'px';
    btn.className = 'map__pin';
    btn.setAttribute('data-id', post.id);
    img.src = post.author.avatar;
    img.width = PIN_SIZE;
    img.height = PIN_SIZE;
    img.draggable = false;
    btn.appendChild(img);

    return btn;
  };

  var deactivate = function () {
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  var activate = function (pin) {
    pin.classList.add('map__pin--active');
    activePin = pin;
  };

  var toggle = function (pin) {
    deactivate();
    activate(pin);
  };

  window.pin = {
    create: create,
    deactivate: deactivate,
    activate: activate,
    toggle: toggle
  };
})();
