'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var mapElement = document.querySelector('.map');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var mainPinElement = mapElement.querySelector('.map__pin--main');
  var REQUIERED_MODULES = [
    'pin',
    'posts',
    'card'
  ];
  var posts = [];
  var pins = [];

  var _undefinedModules = [];

  REQUIERED_MODULES.forEach(function (module) {
    if (!window[module]) {
      _undefinedModules.push(module);
    }
  });

  if (_undefinedModules.length > 0) {
    throw new Error('To use the module the following subjects should be declared in the global scope: ' + _undefinedModules.join(', '));
  }

  var onCardClose = function (e) {
    if (e.type === 'keydown' && e.keyCode !== ESC_KEYCODE
      || e.type === 'click' && !e.target.classList.contains('popup__close')) {
      return;
    }

    window.pin.deactivate();
    window.card.deactivate(mapPinsElement);
  };

  var onOpenPin = function (e) {
    var currentPin = e.currentTarget;
    var id = currentPin.dataset.id;
    if (e.type === 'keydown' && e.keyCode !== ENTER_KEYCODE) {
      return;
    }

    window.pin.toggle(currentPin);
    window.card.activate(mapPinsElement, posts[+id - 1], onCardClose);
  };

  var onFilterPins = function (postList) {
    var HIDDEN_CLASS = 'hidden';

    pins.forEach(function (pin) {
      var isPinHide = !postList.some(function (post) {

        return +pin.getAttribute('data-id') === +post.id;
      });

      if (isPinHide && !pin.classList.contains(HIDDEN_CLASS)) {
        pin.classList.add(HIDDEN_CLASS);
      } else if (!isPinHide && pin.classList.contains(HIDDEN_CLASS)) {
        pin.classList.remove(HIDDEN_CLASS);
      }
    });
  };

  var renderPins = function (postData) {
    var fragment = document.createDocumentFragment();
    var newPin = null;
    var id = 1;

    postData.forEach(function (post) {
      post.id = id++;
      newPin = window.pin.create(post);
      newPin.addEventListener('click', onOpenPin);
      pins.push(newPin);
      posts.push(post);
      fragment.appendChild(newPin);
    });

    posts = postData;

    return mapPinsElement.appendChild(fragment);
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
      var newY = mainPinElement.offsetTop - shift.y;
      var newX = mainPinElement.offsetLeft - shift.x;
      if (newY < DRAG_Y_BOUND.min || newY > DRAG_Y_BOUND.max) {
        return;
      }

      startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      mainPinElement.style.top = newY + 'px';
      mainPinElement.style.left = newX + 'px';
    };

    var onMouseUp = function (evt) {
      evt.preventDefault();
      window.form.setAddress('x: {{' + startCoords.x + '}}, y: {{' + startCoords.y + '}}');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var onInitPins = function (e) {
    e.preventDefault();

    window.posts.get(function (response) {
      mapElement.classList.remove('map--faded');
      renderPins(response);
      window.filter.activate(posts, onFilterPins);
      window.filter.run();
      window.form.showForm();
      mainPinElement.removeEventListener('mouseup', onInitPins);
      mainPinElement.addEventListener('mousedown', onDragStart);
    });
  };

  mainPinElement.addEventListener('mouseup', onInitPins);
})();
