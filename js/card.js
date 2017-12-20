'use strict';

(function () {
  var DICTIONARY = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом'
  };
  var activeCard = null;
  var parentElement = null;
  var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');

  var renderFeatures = function (containerElement, features) {
    var fragment = document.createDocumentFragment();

    features.forEach(function (feature) {
      var li = document.createElement('li');
      li.className = 'feature  feature--' + feature;
      fragment.appendChild(li);
    });

    containerElement.appendChild(fragment);
  };

  var renderPhotos = function (containerElement, photos) {
    var fragment = document.createDocumentFragment();

    photos.forEach(function (photoSrc) {
      var li = document.createElement('li');
      var img = document.createElement('img');
      img.src = photoSrc;
      img.width = 42;
      img.height = 42;
      li.appendChild(img);
      fragment.appendChild(li);
    });

    containerElement.innerHTML = '';
    containerElement.appendChild(fragment);
  };

  var create = function (post) {
    var cardTemplateElement = mapCardTemplate.cloneNode(true);
    var postTypeElement = cardTemplateElement.querySelector('h4');
    var featuresElement = cardTemplateElement.querySelector('.popup__features');
    var picturesElement = cardTemplateElement.querySelector('.popup__pictures');
    cardTemplateElement.querySelector('.popup__avatar').src = post.author.avatar;
    cardTemplateElement.querySelector('h3').textContent = post.offer.title;
    cardTemplateElement.querySelector('small').textContent = post.offer.address;
    cardTemplateElement.querySelector('.popup__price').innerHTML = post.offer.price + '&#x20bd;/ночь';
    postTypeElement.textContent = DICTIONARY[post.offer.type];
    postTypeElement.nextElementSibling.textContent = post.offer.rooms + ' комнаты для ' + post.offer.guests + ' гостей';
    postTypeElement.nextElementSibling.nextElementSibling.textContent = 'заезд после ' + post.offer.checkin + ' , выезд до ' + post.offer.checkout;
    cardTemplateElement.querySelector('.popup__features').innerHTML = '';
    renderFeatures(featuresElement, post.offer.features);
    renderPhotos(picturesElement, post.offer.photos);
    featuresElement.nextElementSibling.textContent = post.offer.description;

    return cardTemplateElement;
  };

  var deactivate = function () {
    if (activeCard) {
      parentElement.removeChild(activeCard);
      activeCard = null;
    }
  };

  var activate = function (element, post, onClose) {
    var newCardElement = null;
    parentElement = element;
    deactivate();

    newCardElement = create(post);
    document.addEventListener('keydown', onClose);
    newCardElement.addEventListener('click', onClose);
    activeCard = element.appendChild(newCardElement);
  };

  window.card = {
    deactivate: deactivate,
    activate: activate
  };
})();
