'use strict';

(function () {
  var activeCard = null;
  var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');

  var createCard = function (post) {
    var cardTemplate = mapCardTemplate.cloneNode(true);
    var dictionary = {
      'flat': 'Квартира',
      'bungalo': 'Бунгало',
      'house': 'Дом'
    };
    var postType = cardTemplate.querySelector('h4');
    var features = cardTemplate.querySelector('.popup__features');
    var pictures = cardTemplate.querySelector('.popup__pictures');
    var featuresFragment = document.createDocumentFragment();
    var picturesFragment = document.createDocumentFragment();
    cardTemplate.querySelector('.popup__avatar').src = post.author.avatar;
    cardTemplate.querySelector('h3').textContent = post.offer.title;
    cardTemplate.querySelector('small').textContent = post.offer.address;
    cardTemplate.querySelector('.popup__price').innerHTML = post.offer.price + '&#x20bd;/ночь';
    postType.textContent = dictionary[post.offer.type];
    postType.nextElementSibling.textContent = post.offer.rooms + ' комнаты для ' + post.offer.guests + ' гостей';
    postType.nextElementSibling.nextElementSibling.textContent = 'заезд после ' + post.offer.checkin + ' , выезд до ' + post.offer.checkout;
    cardTemplate.querySelector('.popup__features').innerHTML = '';
    post.offer.features.forEach(function (feature) {
      var li = document.createElement('li');
      li.className = 'feature  feature--' + feature;
      featuresFragment.appendChild(li);
    });
    post.offer.photos.forEach(function (photoSrc) {
      var li = document.createElement('li');
      var img = document.createElement('img');
      img.src = photoSrc;
      img.width = 42;
      img.height = 42;
      li.appendChild(img);
      picturesFragment.appendChild(li);
    });
    features.appendChild(featuresFragment);
    pictures.innerHTML = '';
    pictures.appendChild(picturesFragment);
    features.nextElementSibling.textContent = post.offer.description;

    return cardTemplate;
  };

  var deactivate = function (parentEl) {
    if (activeCard) {
      parentEl.removeChild(activeCard);
      activeCard = null;
    }
  };

  var activate = function (parentEl, post, onClose) {
    var newCard = null;
    deactivate(parentEl);

    newCard = createCard(post);
    document.addEventListener('keydown', onClose);
    newCard.addEventListener('click', onClose);
    activeCard = parentEl.appendChild(newCard);
  };

  window.card = {
    deactivate: deactivate,
    activate: activate
  };
})();
