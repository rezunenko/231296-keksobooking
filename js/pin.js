'use strict';

(function () {
  var PIN_SIZE = 40;
  var PIN_TAIL_HEIGHT = 18;

  var createPin = function (post) {
    var btn = document.createElement('button');
    var img = document.createElement('img');
    btn.style.left = post.location.x + 'px';
    btn.style.top = (post.location.y - (PIN_SIZE + PIN_TAIL_HEIGHT) / 2) + 'px';
    btn.className = 'map__pin';
    btn.setAttribute('data-id', post.id);
    img.src = post.author.avatar;
    img.width = PIN_SIZE;
    img.height = PIN_SIZE;
    img.draggable = false;
    btn.appendChild(img);

    return btn;
  };

  window.pin = {
    createPin: createPin
  };

})();
