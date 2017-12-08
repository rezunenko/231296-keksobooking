'use strict';

(function getPosts(params) {
  var input = params.input || window;
  var output = params.output || window;
  var REQUIERED_FUNCTIONS = [
    'compareRandom',
    'getRandomValue',
    'getRandomArrayItem',
    'getRandomArraySubset',
    'suplementWithZero'
  ];
  var _undefinedFunctions = [];

  for (var j = 0; j < REQUIERED_FUNCTIONS.length; j++) {
    if (!input[REQUIERED_FUNCTIONS[j]]) {
      _undefinedFunctions.push(REQUIERED_FUNCTIONS[j]);
    }
  }

  if (_undefinedFunctions.length > 0) {
    throw new Error('To use the module the following functions should be declared in the global scope: ' + _undefinedFunctions.join(', '));
  }

  var getInitialPosts = function () {
    var titles = [
      'Большая уютная квартира',
      'Маленькая неуютная квартира',
      'Огромный прекрасный дворец',
      'Маленький ужасный дворец',
      'Красивый гостевой домик',
      'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря',
      'Неуютное бунгало по колено в воде'
    ].sort(output.compareRandom);
    var users = [1, 2, 3, 4, 5, 6, 7, 8].sort(input.compareRandom);
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
    var postIdCounter = 1;

    for (var i = 0; i < titles.length; i++) {
      x = input.getRandomValue(xRange.max, xRange.min);
      y = input.getRandomValue(yRange.max, yRange.min);
      postList.push({
        id: postIdCounter++,
        author: {
          avatar: 'img/avatars/user' + input.suplementWithZero(users[i], 2) + '.png'
        },
        offer: {
          title: titles[i],
          address: x + ', ' + y,
          price: input.getRandomValue(priceRange.max, priceRange.min, -3),
          type: input.getRandomArrayItem(types),
          rooms: input.getRandomValue(roomsRange.max, roomsRange.min),
          guests: input.getRandomValue(guestRange.max, guestRange.min),
          checkin: input.getRandomArrayItem(times),
          checkout: input.getRandomArrayItem(times),
          features: input.getRandomArraySubset(features),
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
  };

  output.posts = getInitialPosts();
})({output: window, input: window.utils});
