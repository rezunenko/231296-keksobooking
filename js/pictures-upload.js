'use strict';


(function () {
  var FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif'];
  var avatarInputElement = document.querySelector('#avatar');
  var avatarPreviewElement = document.querySelector('.notice__preview > img');
  var imageInputElement = document.querySelector('#images');
  var imageContainerElement = document.querySelector('.form__photo-container');

  var readImage = function (image, container, callback) {
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      callback(reader, container);
    });
    reader.readAsDataURL(image);
  };

  var checkValidity = function (file, extension) {
    var fileName = file.name.toLowerCase();

    return extension.some(function (type) {
      return fileName.endsWith(type);
    });
  };

  var setImageSrc = function (fileReader, container) {
    container.src = fileReader.result;
  };

  var createImageInContainer = function (fileReader, container) {
    var photo = document.createElement('img');
    photo.src = fileReader.result;
    photo.classList.add('photo');
    container.appendChild(photo);
  };

  imageInputElement.addEventListener('change', function () {
    var file = imageInputElement.files[0];

    if (checkValidity(file, FILE_TYPES)) {
      readImage(file, imageContainerElement, createImageInContainer);
    }
  });

  avatarInputElement.addEventListener('change', function () {
    var avatar = avatarInputElement.files[0];

    if (checkValidity(avatar, FILE_TYPES)) {
      readImage(avatar, avatarPreviewElement, setImageSrc);
    }
  });
})();
