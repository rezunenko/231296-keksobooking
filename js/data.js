'use strict';

(function () {
  if (!window.backend) {
    throw new Error('To use the module, the backend module should be declared in the global scope');
  }

  if (!window.backend.load) {
    throw new Error('The load function should be declared in the backend module');
  }

  var get = function (onLoad) {

    var onError = function (msg) {
      console.log(msg);
    };

    window.backend.load(onLoad, onError);
  };

  window.posts = {
    get: get
  };
})();
