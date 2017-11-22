'use strict';

function getInitialPosts(count) {
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

  for (var i = 0; i < count; i++) {
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
        features: getRandomArrayItem(features),
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

function getRandomValue(max, min, precision) {
  precision = precision || 0;
  min = min || 0;
  var random = Math.random() * (max - min) + min;

  return Math.round(random * Math.pow(10, precision)) / Math.pow(10, precision);
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
