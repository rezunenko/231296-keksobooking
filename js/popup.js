'use strict';

(function () {
  var DEFAULT_STYLE = {
    position: 'fixed',
    width: '100%',
    top: 0,
    left: 0,
    padding: '10px',
    backgroundColor: 'indianred',
    textAlign: 'center',
    color: 'white'
  };

  var setStyle = function (elem, style) {
    if (!style) {
      return;
    }

    Object.keys(style).forEach(function (item) {
      elem.style[item] = style[item];
    });
  };

  window.popup = {
    show: function (msg, style) {
      var main = document.body.querySelector('main');
      var popup = document.createElement('div');
      var popupElement = null;
      setStyle(popup, DEFAULT_STYLE);
      setStyle(popup, style);
      popup.textContent = msg;
      popupElement = main.appendChild(popup);

      setTimeout(function () {
        main.removeChild(popupElement);
      }, 2000);
    }
  };
})();
