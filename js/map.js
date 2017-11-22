'use strict';

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
  var yRange = {min: 100, max: 500};
  var posts = [];
  var x = 0;
  var y = 0;

  for (var i = 0; i < titles.length; i++) {
    x = getRandomValue(xRange.max, xRange.min);
    y = getRandomValue(yRange.max, yRange.min);
    posts.push({
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

  return posts;
}

function createMapPin(post) {
  var pinSize = 40;
  var btn = document.createElement('button');
  var img = document.createElement('img');
  btn.style.left = (post.location.x - pinSize / 2) + 'px';
  btn.style.top = (post.location.y - pinSize / 2) + 'px';
  btn.className = 'map__pin';
  img.src = post.author.avatar;
  img.width = pinSize;
  img.height = pinSize;
  img.draggable = false;
  btn.appendChild(img);
  
  return btn;
}

function drawMapPins() {
  var posts = getInitialPosts(8);
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < posts.length; i++) {
    fragment.appendChild(createMapPin(posts[i]));
  }
  document.querySelector('.map__pins').appendChild(fragment);
}

drawMapPins();

function getRandomValue(max, min, precision) {
  precision = precision || 0;
  min = min || 0;
  var random = Math.random() * (max - min) + min;

  return Math.round(random * Math.pow(10, precision)) / Math.pow(10, precision);
}

function getRandomArraySubset(arr) {
  var subsetLength = getRandomValue(arr.length - 1);
  var subset = [];
  var item = null;

  for (var i = 0; i < subsetLength; i++) {
      item = arr[getRandomValue(arr.length - 1)];
      if(subset.indexOf(item) + 1) {
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
