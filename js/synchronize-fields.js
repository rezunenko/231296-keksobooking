'use strict';

(function () {
  window.synchronizeFields = function (firstObject, secondObject, callback, options) {
    var isUniderectional = options && options.isUniderectional || false;

    if (!(firstObject && typeof firstObject === 'object' && firstObject.elem && firstObject.values)) {
      throw new Error('Incorrect the first param of function');
    }

    if (!(secondObject && typeof secondObject === 'object' && secondObject.elem && secondObject.values)) {
      throw new Error('Incorrect the second param of function');
    }

    if (secondObject.values.length !== firstObject.values.length) {
      throw new Error('Length of values in first object isn\'t equal it in second object');
    }

    var onFieldChange = function (e) {
      var target = e.target;
      var changedField = target.id === firstObject.elem.id ? firstObject : secondObject;
      var editableField = target.id === firstObject.elem.id ? secondObject : firstObject;

      var index = changedField.values.indexOf(target.value);
      var newValue = editableField.values[index];

      if (typeof callback === 'function') {
        callback(editableField.elem, newValue);
      }
    };

    firstObject.elem.addEventListener('change', onFieldChange);
    if (!isUniderectional) {
      secondObject.elem.addEventListener('change', onFieldChange);
    }
  };
})();
