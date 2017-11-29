'use strict';
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;
var posts = [];

document.querySelector('.map__pin--main').addEventListener('mouseup', showForm);

function showForm() {
  initPosts();
  var fieldsets = document.querySelectorAll('.notice__form fieldset[disabled]');
  document.querySelector('.map').classList.remove('map--faded');
  document.querySelector('.notice__form').classList.remove('notice__form--disabled');

  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].removeAttribute('disabled');
  }
}

function initPosts() {
  if (!posts || !posts.length) {
    posts = getInitialPosts();
    renderMapPins(posts);
    var pins = document.querySelectorAll('.map__pin');
    for (var j = 0; j < pins.length; j++) {
      pins[j].addEventListener('click', onOpenPin);
      pins[j].addEventListener('keydown', onOpenPin);
    }
  }
}

function onOpenPin(e) {
  var pin = e.currentTarget;
  var id = pin.dataset.id;
  if (e.type === 'keydown' && e.keyCode !== ENTER_KEYCODE) {
    return;
  }

  deactivatePins();
  pin.classList.add('map__pin--active');

  if (id > 0) {
    var popup = renderMapPopup(posts[id - 1]);
    showPopup(popup);
  }
}

function deactivatePins() {
  var pins = document.querySelectorAll('.map__pin');

  for (var j = 0; j < pins.length; j++) {
    pins[j].classList.remove('map__pin--active');
  }
}

function getInitialPosts() {
  var titles = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ].sort(compareRandom);
  var users = [1, 2, 3, 4, 5, 6, 7, 8].sort(compareRandom);
  var types = ['flat', 'house', 'bungalo'];
  var times = ['12:00', '13:00', '14:00'];
  var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var priceRange = {min: 1000, max: 1000000};
  var roomsRange = {min: 1, max: 5};
  var guestRange = {min: 1, max: 4};
  var xRange = {min: 300, max: 900};
  var yRange = {min: 200, max: 700};
  var postList = [];
  var x = 0;
  var y = 0;
  var postIdCounter = counter();

  for (var i = 0; i < titles.length; i++) {
    x = getRandomValue(xRange.max, xRange.min);
    y = getRandomValue(yRange.max, yRange.min);
    postList.push({
      id: postIdCounter(),
      author: {
        avatar: 'img/avatars/user' + suplementWithZero(users[i], 2) + '.png'
      },
      offer: {
        title: titles[i],
        address: x + ', ' + y,
        price: getRandomValue(priceRange.max, priceRange.min, -3),
        type: getRandomArrayItem(types),
        rooms: getRandomValue(roomsRange.max, roomsRange.min),
        guests: getRandomValue(guestRange.max, guestRange.min),
        checkin: getRandomArrayItem(times),
        checkout: getRandomArrayItem(times),
        features: getRandomArraySubset(features),
        description: '',
        photos: []
      },
      location: {
        x: x,
        y: y
      }
    });
  }

  return postList;
}

function renderMapPins(postList) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < postList.length; i++) {
    fragment.appendChild(createMapPin(posts[i]));
  }

  document.querySelector('.map__pins').appendChild(fragment);
}

function createMapPin(post) {
  var PIN_SIZE = 40;
  var PIN_TAIL_HEIGHT = 18;
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
}

function renderMapPopup(post) {
  var template = document.querySelector('template').content.querySelector('article.map__card');
  var popupTemplate = template.cloneNode(true);
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
}

function showPopup(object) {
  var map = document.querySelector('.map');
  var oldPopup = map.querySelector('.map__card');

  if (oldPopup) {
    map.removeChild(oldPopup);
  }
  var newPopupElement = map.appendChild(object);
  newPopupElement.addEventListener('click', onPopupClose);
  document.addEventListener('keydown', onPopupClose);
}

function onPopupClose(e) {
  var popup = document.querySelector('.map__card.popup');
  if (e.type === 'keydown' && e.keyCode !== ESC_KEYCODE
    || e.type === 'click' && !e.target.classList.contains('popup__close')) {
    return;
  }

  popup.setAttribute('hidden', '');
  popup.removeEventListener('click', onPopupClose);
  document.removeEventListener('keydown', onPopupClose);
  deactivatePins();
}

function getRandomValue(max, min, precision) {
  precision = precision || 0;
  min = min || 0;
  var random = Math.random() * (max - min) + min;

  return Math.round(random * Math.pow(10, precision)) / Math.pow(10, precision);
}

function getRandomArraySubset(arr) {
  var subsetLength = getRandomValue(arr.length);
  var subset = [];
  var item = null;

  for (var i = 0; i < subsetLength; i++) {
    item = arr[getRandomValue(arr.length - 1)];
    if (subset.indexOf(item) + 1) {
      i--;
    } else {
      subset.push(item);
    }
  }

  return subset;
}

function getRandomArrayItem(arr) {

  return arr[getRandomValue(arr.length - 1)];
}

function compareRandom() {
  return Math.random() - 0.5;
}

function suplementWithZero(value, precision) {
  var result = (value || '').toString();
  for (var i = value.toString().length; i < precision; i++) {
    result = '0' + result;
  }
  return result;
}

function counter() {
  var currentId = 1;

  return function () {

    return currentId++;
  };
}
