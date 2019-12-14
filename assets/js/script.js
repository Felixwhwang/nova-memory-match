$(document).ready(initializeApp);

function initializeApp () {
  shufflingCards();
  $(".modal-footer button:nth-child(1)").on('click', shufflingCards);
  $(".bar-container .bar:nth-child(7) button").on('click', shufflingCards);
  $(".bar-container .bar:nth-child(8) button").on('click', function () {
    $(".card-container").on('click', 'div', handleCardClick);
    counterStart();
  });
}

var firstCardClicked = null;
var secondCardClicked = null;
var matches = null;
var max_matches = 9;
var attempts = null;
var games_played = 0;
var gameKey = ['card-one', 'card-one', 'card-two', 'card-two', 'card-three', 'card-three', 'card-four', 'card-four', 'card-five', 'card-five', 'card-six', 'card-six', 'card-seven', 'card-seven', 'card-eight', 'card-eight', 'card-nine', 'card-nine'];
var totalSeconds = 0;
var timeStart = null;

function handleCardClick (event) {
  if($(event.currentTarget).attr('confirm') === 'yes') {
    return;
  }

  //store jquery reference into declared two variables
  if(firstCardClicked === null) {
    firstCardClicked = $(event.currentTarget);
    $(event.currentTarget).removeClass("card-back");
    firstCardClicked.attr('confirm', 'yes');
  } else if (secondCardClicked === null) {
    secondCardClicked = $(event.currentTarget);
    $(event.currentTarget).removeClass("card-back");
    secondCardClicked.attr('confirm', 'yes');
  } else {
    console.log('two card clicked, so do nothing');
  }

  if(firstCardClicked.is(secondCardClicked)) {
    secondCardClicked = null;
    console.log('click same card twice');
    return;
  }

  //check both card are clicked
  if(firstCardClicked !== null && secondCardClicked !== null) {
    $('.card').prop('disabled', true);
    attempts++;
    var firstCardBackground = firstCardClicked.css('background-image');
    var secondCardBackground = secondCardClicked.css('background-image');
    //check if first and second are matching
    if (firstCardBackground !== secondCardBackground) {
      setTimeout(resetCards, 1000);
    } else {  //cards matches
      firstCardClicked.css('box-shadow', 'rgb(0, 255, 20) 0px 0px 20px 0px');
      secondCardClicked.css('box-shadow', 'rgb(0, 255, 20) 0px 0px 20px 0px');
      firstCardClicked = null;
      secondCardClicked = null;
      matches++;
      $('.card').prop('disabled', false);
      if (matches === max_matches) {
        clearInterval(timeStart);
        games_played++;
        timeUsed();
        $('#myModal').modal('show');
        totalSeconds = 0;
      }
    }
    displayStats();
  }
}

function timeUsed () {
  var minutes = $('.minutes').text();
  var seconds = $('.seconds').text();
  $('.modal-body p span').text(minutes + ':' + seconds);
}

function setTime () {
  ++totalSeconds;
  var minutes = $('.minutes');
  var seconds = $('.seconds');
  seconds.text(timeDigitsFix(totalSeconds % 60));
  minutes.text(timeDigitsFix(parseInt(totalSeconds / 60)));
}

function timeDigitsFix (time) {
  var stringTime = time.toString();
  if (stringTime.length < 2) {
    return '0' + stringTime;
  } else {
    return stringTime;
  }
}

function counterStart () {
  if (timeStart === null) {
    timeStart = setInterval(setTime, 1000);
    console.log('start');
    $(".bar-container .bar:nth-child(10) button").on('click', counterPause);
  }
}

function counterPause () {
  $(".card-container").off('click', 'div', handleCardClick);
  $(".bar-container .bar:nth-child(11) button").on('click', counterContinue);
  clearInterval(timeStart);
  $(".bar-container .bar:nth-child(10) button").off('click', counterPause);
}

function counterContinue () {
  $(".card-container").on('click', 'div', handleCardClick);
  $(".bar-container .bar:nth-child(10) button").on('click', counterPause);
  timeStart = setInterval(setTime, 1000);
  $(".bar-container .bar:nth-child(11) button").off('click', counterContinue);
}

function resetStats () {
  clearInterval(timeStart);
  $(".card-container").off('click', 'div', handleCardClick);
  totalSeconds = 0;
  matches = null;
  attempts = null;
  timeStart = null;
  $(".bar-container .bar:nth-child(10) button").off('click', counterPause);
  $(".bar-container .bar:nth-child(11) button").off('click', counterContinue);
  $(".card").addClass("card-back");
  $('#attempts').text("0");
  $('#accuracy').text("0%");
  $('.minutes').text('00');
  $('.seconds').text('00');
}

function displayStats () {
  $('#games-played').text(games_played);
  $('#attempts').text(attempts);
  $('#accuracy').text(calculateAccuracy());
}

function calculateAccuracy () {
  var accuracy = matches * 100 / attempts;
  return accuracy.toFixed(2) + "%";
}

function resetCards(){
  firstCardClicked.attr('confirm', 'no');
  secondCardClicked.attr('confirm', 'no');
  firstCardClicked.addClass("card-back");
  secondCardClicked.addClass("card-back");
  firstCardClicked = null;
  secondCardClicked = null;
  $('.card').prop('disabled', false);
}

function shufflingCards () {
  $(".card").remove();
  var newGameKey = shuffleArray(gameKey);
  console.table( newGameKey);
  for (var index = 0; index < newGameKey.length; index++) {
    var newCard = $('<div>').addClass('card card-back ' + newGameKey[index]).attr('confirm', 'no');
    $('.card-container').append(newCard);
  }

  resetStats();
}

function shuffleArray (array) {
  for(var index = array.length - 1; index > 0; index--) {
    var current = Math.floor(Math.random() * (index + 1));
    [array[index], array[current]] = [array[current], array[index]];
  }
  return array;
}
