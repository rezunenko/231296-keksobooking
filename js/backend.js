'use strict';

(function () {


  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      var errorText = null;
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 400:
          errorText = 'Неверный запрос';
          break;
        case 401:
          errorText = 'Пользователь не авторизован';
          break;
        case 404:
          errorText = 'Ничего не найдено';
          break;
        default:
          errorText = 'Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText;
      }

      if (errorText) {
        onError(errorText);
      }
    });

    xhr.addEventListener('abort', function () {
      onError('Операция была отменена');
    });

    xhr.addEventListener('error', function() {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function() {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.responseType = 'json';
    xhr.open('GET', 'https://1510.dump.academy/keksobooking/data');
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {

    });

    xhr.open('POST', ' https://1510.dump.academy/keksobooking');
    xhr.send(data);
  };

  var onLoad = function(response) {
    console.log(response);
  };

  var onError = function (msg) {
    console.log(msg);
  };

  window.backend = {
    load: load,
    save: save
  };
})();
