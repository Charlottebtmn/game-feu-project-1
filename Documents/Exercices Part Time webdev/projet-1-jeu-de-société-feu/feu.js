// //******************************************************************
// // Game Logic
// //******************************************************************
var intervalTime = 200;

function Game () {
  this.themes = [
    "Animal", "Room", "Country","City","Brand"
  ];
  this.alphabet =["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V"];
  this.combination=[];
  this.counter = 0; // This variable is only used when this.status == 'inCountDown'
  this.status = 'preparation'; // in 'preparation', 'displayLetter', 'inCountDown5', 'inCountDown10','waitingResult', 'waitingNextDisplayLetter', 'finalResult'
  this.nameTeam1 = "";
  this.nameTeam2 = "";
  this.scoreTeam1 = 0;
  this.scoreTeam2 = 0;
  this.changeScreen();
  // In an ideal developing world, for example, teams = [{score: 0, name: "Azerty"}, {score: 2, name: "Qwerty"}]
  var that=this;

  $('#startGame').click( function () {
    that.nameTeam1 = $('.team1').val();
    that.nameTeam2 = $('.team2').val();
    that.status = "displayLetter";
    that.finished();
    that.changeScreen();
  });

  $('#gotSomething1').click( function () {
    that.status = "inCountDown5";
    that.finished();
    that.changeScreen();
    that.countDown(5, function() {
      that.status ="waitingResult";
    });
  });

  $('#gotSomething2').click( function () {
    that.status = "inCountDown5";
    that.finished();
    that.changeScreen();
    that.countDown(5, function() {
      that.status ="waitingResult";
    });
  });

  $('#yes1').click( function () {
    that.scoreTeam1 ++;
    that.status = "waitingNextDisplayLetter";
    that.finished();
    that.changeScreen();
  });

  $('#yes2').click( function () {
    that.scoreTeam2 ++;
    that.status = "waitingNextDisplayLetter";
    that.finished();
    that.changeScreen();
  });

  $('#no1,#no2').click( function () {
    that.status = "inCountDown10";
    that.countDown(10, function() {
      if (that.status === "inCountDown10") {
        that.status="waitingNextDisplayLetter";
      }
    });
    that.finished();
    that.changeScreen();
  });

  $('#next').click( function () {
    that.status = "displayLetter";
    that.finished();
    that.changeScreen();
  });

  $('#newGame').click( function () {
    that.status = "preparation";
    that.finished();
    that.changeScreen();
  });
}

Game.prototype.pickThemeAndLetter = function () {
  this.combination=[];
  var currentTheme = this.themes[Math.floor(Math.random()*this.themes.length)];
  var currentLetter = this.alphabet[Math.floor(Math.random()*this.alphabet.length)];
  this.combination.push(currentTheme,currentLetter);
  return this.combination;
};

Game.prototype.countDown = function (x, callback) {
  var counter=x+1;
  var that=this;
  var interval = setInterval(function() {
    if (counter == 1) {
        clearInterval(interval);
        callback();
        that.changeScreen();
    }
    counter--;
    console.log(counter);
}, intervalTime);
};

Game.prototype.finished = function() {
  if (this.scoreTeam1 >= 5) {
    //return (this.nameTeam1 + " won !");
    this.status = "finalResult";
  }
  else if (this.scoreTeam2 >= 5) {
    //return (this.nameTeam2 + " won !");
    this.status = "finalResult";
  }
};


Game.prototype.changeScreen = function () {
  if (this.status === "preparation" ) {
    $('section').hide();
    $('#welcomeScreen').show();
  }
  else if (this.status === "displayLetter" ) {
    this.pickThemeAndLetter();
    $('section').hide();
    $('#mainScreen').show();
  }
  else if (this.status === "inCountDown5") {
    $('section').hide();
    $('#chronometer5').show();
  }
  else if (this.status === "inCountDown10") {
    $('section').hide();
    $('#chronometer10').show();
  }
  else if (this.status === "waitingResult") {
    $('section').hide();
    $('#whatResult').show();
  }
  else if (this.status === "waitingNextDisplayLetter") {
    $('section').hide();
    $('#waitingNextDisplayLetter').show();
  }
  else if (this.status === "finalResult") {
    $('section').hide();
    $('#winner').show();
  }
};

// //******************************************************************
// // HTML/CSS Interactions
// //******************************************************************

var g;
$(document).ready(function(){
  g = new Game();
});
