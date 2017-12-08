'use strict';

(function () {
  var mapPopupTemplate = document.querySelector('template').content.querySelector('article.map__card');
  var createPopup = function (post) {
    var popupTemplate = mapPopupTemplate.cloneNode(true);
    var dictionary = {
      'flat': 'Квартира',
      'bungalo': 'Бунгало',
      'house': 'Дом'
    };
    var postType = popupTemplate.querySelector('h4');
    var features = popupTemplate.querySelector('.popup__features');
    var featuresFragment = document.createDocumentFragment();
    popupTemplate.querySelector('.popup__avatar').src = post.author.avatar;
    popupTemplate.querySelector('h3').textContent = post.offer.title;
    popupTemplate.querySelector('small').textContent = post.offer.address;
    popupTemplate.querySelector('.popup__price').innerHTML = post.offer.price + '&#x20bd;/ночь';
    postType.textContent = dictionary[post.offer.type];
    postType.nextElementSibling.textContent = post.offer.rooms + ' комнаты для ' + post.offer.guests + ' гостей';
    postType.nextElementSibling.nextElementSibling.textContent = 'заезд после ' + post.offer.checkin + ' , выезд до ' + post.offer.checkout;
    popupTemplate.querySelector('.popup__features').innerHTML = '';
    for (var i = 0; i < post.offer.features.length; i++) {
      var li = document.createElement('li');
      li.className = 'feature  feature--' + post.offer.features[i];
      featuresFragment.appendChild(li);
    }
    features.appendChild(featuresFragment);
    features.nextElementSibling.textContent = post.offer.description;

    return popupTemplate;
  };

  window.card = {
    createPopup: createPopup
  };
})();
