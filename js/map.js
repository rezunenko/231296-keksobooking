'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var REQUIERED_MODULES = [
    'pin',
    'posts',
    'card'
  ];
  var posts = [];
  var pins = [];

  var _undefinedModules = [];

  for (var j = 0; j < REQUIERED_MODULES.length; j++) {
    if (!window[REQUIERED_MODULES[j]]) {
      _undefinedModules.push(REQUIERED_MODULES[j]);
    }
  }

  if (_undefinedModules.length > 0) {
    throw new Error('To use the module the following subjects should be declared in the global scope: ' + _undefinedModules.join(', '));
  }

  var onCardClose = function (e) {
    if (e.type === 'keydown' && e.keyCode !== ESC_KEYCODE
      || e.type === 'click' && !e.target.classList.contains('popup__close')) {
      return;
    }

    window.pin.deactivate();
    window.card.deactivate(mapPins);
  };

  var onOpenPin = function (e) {
    var currentPin = e.currentTarget;
    var id = currentPin.dataset.id;
    if (e.type === 'keydown' && e.keyCode !== ENTER_KEYCODE) {
      return;
    }

    window.pin.toggle(currentPin);
    window.card.activate(mapPins, posts[+id - 1], onCardClose);
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
      newPin = window.pin.createPin(post);
      newPin.addEventListener('click', onOpenPin);
      pins.push(newPin);
      posts.push(post);
      fragment.appendChild(newPin);
    });

    posts = postData;

    return mapPins.appendChild(fragment);
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
      map.classList.remove('map--faded');
      renderPins(response);
      window.filter.activate(posts, onFilterPins);
      window.form.showForm();
      mainPin.addEventListener('mousedown', onDragStart);
      mainPin.removeEventListener('mouseup', onInitPins);
    });
  };

  mainPin.addEventListener('mouseup', onInitPins);

})();
