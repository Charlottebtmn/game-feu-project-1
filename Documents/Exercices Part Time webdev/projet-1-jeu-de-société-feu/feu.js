// //******************************************************************
// // Game Logic
// //******************************************************************
var intervalTime = 1000;
var s = new Sound("./sons/mario.mp3");
var n = new Sound("./sons/feu.mp3");
var g;
$(document).ready(function(){
  g = new Game();
});

function Game () {
  this.themes = [
    "Animal", "Country","City","Brand","Celebrity","Body Part","Movie","Object","Sth you can wear"
  ];
  this.alphabet =["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V"];
  this.combination=[];
  this.counter = 0; // This variable is only used when this.status == 'inCountDown'
  this.status = 'preparation'; // in 'preparation', 'displayLetter', 'inCountDown5', 'inCountDown10','waitingResult', 'waitingNextDisplayLetter', 'finalResult'
  this.nameTeam1 = "";
  this.nameTeam2 = "";
  this.interval=0;
  this.scoreTeam1 = 0;
  this.scoreTeam2 = 0;
  this.missCounter = 0;
  this.changeScreen();
  this.updateScores();
  // In an ideal developing world, for example, teams = [{score: 0, name: "Azerty"}, {score: 2, name: "Qwerty"}]
  var that=this;

  $('#startGame').click( function () {
    that.status = "displayLetter";
    that.nameTeam1 = $('.team1').val();
    that.nameTeam2 = $('.team2').val();
    that.updateTeamNames();
    that.finished();
    that.changeScreen();
    that.updateThemeAndLetter();
    n.play();
  });

  $('#gotSomething1').click( function () {
    that.status = "inCountDown5";
    that.updateTeamNames();
    that.finished();
    that.changeScreen();
    that.countDown(5, function() {
      that.status ="waitingResult";
    });
  });

  $('#pass').click( function () {
    that.pickThemeAndLetter();
    that.updateThemeAndLetter();
  });

  $('#gotSomething2').click( function () {
    clearInterval(that.interval);
    $('.displayChronometer5').text("");
    $('.displayChronometer10').text("");
    that.status = "inCountDown5";
    that.updateTeamNames();
    that.finished();
    that.changeScreen();
    that.countDown(5, function() {
      that.status ="waitingResult";
    });
  });

  $('#yes1').click( function () {
    that.scoreTeam1 ++;
    that.status = "waitingNextDisplayLetter";
    that.updateScores();
    that.updateTeamNames();
    that.finished();
    that.changeScreen();
    n.play();
  });

  $('#yes2').click( function () {
    that.scoreTeam2 ++;
    that.status = "waitingNextDisplayLetter";
    that.updateScores();
    that.updateTeamNames();
    that.finished();
    that.changeScreen();
    n.play();
  });

  $('#no1,#no2').click( function () {
    if (that.missCounter <= 1) {
      that.status = "inCountDown10";
      that.countDown(10, function() {
        if (that.status === "inCountDown10") {
        that.status="waitingNextDisplayLetter";
      }
    });
      that.missCounter ++;
    }
    else {
      that.status ="waitingNextDisplayLetter";
      that.missCounter =0;
    }
    that.updateTeamNames();
    that.finished();
    that.changeScreen();

  });

  $('#next').click( function () {
    that.status = "displayLetter";
    that.updateTeamNames();
    that.finished();
    that.changeScreen();
    that.updateThemeAndLetter();
  });

  $('#newGame').click( function () {
    that.status = "preparation";
    that.updateTeamNames();
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
  var counter=x;
  var that=this;
  this.interval = setInterval(function() {
    if (counter == 0) {
        clearInterval(that.interval);
        $('.displayChronometer5').text("");
        $('.displayChronometer10').text("");
        callback();
        that.changeScreen();
    }
    else {
      console.log (counter);
      $('.displayChronometer5').text(counter);
      $('.displayChronometer10').text(counter);
      counter--;
    }
    if (counter === 3) {
      setTimeout(function(){
        s.play();
      }, 650);
    }
  }, intervalTime);
};

Game.prototype.finished = function() {
  if (this.scoreTeam1 >= 5) {
    //return (this.nameTeam1 + " won !");
    this.status = "finalResult";
    n.play();
  }
  else if (this.scoreTeam2 >= 5) {
    //return (this.nameTeam2 + " won !");
    this.status = "finalResult";
    n.play();
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

Game.prototype.updateTeamNames = function () {
  $('.nameTeam1MainScreen').text(this.nameTeam1);
  $('.nameTeam2MainScreen').text(this.nameTeam2);
  $('.nameTeam1NextScreen').text(this.nameTeam1);
  $('.nameTeam2NextScreen').text(this.nameTeam2);
  $('.nameTeam1WhatResultScreen').text(this.nameTeam1);
  $('.nameTeam2WhatResultScreen').text(this.nameTeam2);
  if (this.scoreTeam1===5) {
    $('.winnerTeam').text(this.nameTeam1);
  }
  else if (this.scoreTeam2===5) {
    $('.winnerTeam').text(this.nameTeam2);
  }
};

Game.prototype.updateScores = function () {
  $('.scoreTeam1MainScreen').text(this.scoreTeam1);
  $('.scoreTeam2MainScreen').text(this.scoreTeam2);
  $('.scoreTeam1NextScreen').text(this.scoreTeam1);
  $('.scoreTeam2NextScreen').text(this.scoreTeam2);
};

Game.prototype.updateThemeAndLetter = function () {
  $('.theme').text(this.combination[0]);
  $('.letter').text(this.combination[1]);
  $('.rappelTheme').text(this.combination[0]);
  $('.rappelLettre').text(this.combination[1]);
};

// Game.prototype.addSound = function (src) {
//     this.addSound = document.createElement("audio");
//     this.addSound.src = src;
//     this.addSound.setAttribute("preload", "auto");
//     this.addSound.setAttribute("controls", "none");
//     this.addSound.style.display = "none";
//     document.body.appendChild(this.addSound);
//     this.play = function(){
//         this.addSound.play();
//     };
//     this.stop = function(){
//         this.addSound.pause();
//     };
// };

// //******************************************************************
// // HTML/CSS Interactions
// //******************************************************************


function Sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    };
    this.stop = function(){
        this.sound.pause();
    };
}
