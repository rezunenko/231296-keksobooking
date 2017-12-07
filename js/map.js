'use strict';

(function() {
  var ENTER_KEYCODE = 13;
  var mapPins = document.querySelector('.map__pins');
  var REQUIERED_SUBJECTS = [
    'createPin',
    'posts',
    'renderMapPopup',
    'showPopup'
  ];

  var _undefinedSubjects = [];

  for (var j = 0; j < REQUIERED_SUBJECTS.length; j++) {
    if (!window[REQUIERED_SUBJECTS[j]]) {
      _undefinedSubjects.push(REQUIERED_SUBJECTS[j]);
    }
  }

  if (_undefinedSubjects.length > 0) {
    throw new Error('To use the module the following subjects should be declared in the global scope: ' + _undefinedSubjects.join(', '));
  }

  window.renderMapPins = function(postList) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < postList.length; i++) {
      fragment.appendChild(window.createPin(window.posts[i]));
    }

    mapPins.appendChild(fragment);
  };

  window.onOpenPin = function(e) {
    var currentPin = e.currentTarget;
    var id = currentPin.dataset.id;
    if (e.type === 'keydown' && e.keyCode !== ENTER_KEYCODE) {
      return;
    }
    if (window.activePin) {
      window.activePin.classList.remove('map__pin--active');
    }
    currentPin.classList.add('map__pin--active');
    window.activePin = currentPin;

    var popup = window.renderMapPopup(window.posts[id - 1]);
    window.showPopup(popup);
  };
})();
