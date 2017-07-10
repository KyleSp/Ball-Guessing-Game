/*
	Made by Kyle Spurlock
*/

var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");
var guessNum = document.getElementById("guessNum");
var accuracyText = document.getElementById("accuracyText");
var answerText = document.getElementById("answerText");
var correctText = document.getElementById("correctText");

var tookGuess = false;
var accuracy = 0;
var plays = 0;

var max = 30;
var min = 5;
var numCircles = Math.floor(Math.random() * (max - min)) + min;
var circles = [];

var speed = 1;

class Circle {
	constructor(radius) {
		this.radius = radius;
		this.centerX = radius + canvas.width / 2;
		this.centerY = radius + canvas.height / 2;
		
		this.velX = speed * (2 * Math.random() - 1);
		this.velY = speed * (2 * Math.random() - 1);
		
		this.leftEdge = radius;
		this.rightEdge = canvas.width - radius;
		this.topEdge = radius;
		this.bottomEdge = canvas.height - radius;
	}
	
	checkCollisions() {
		if (this.centerX <= this.leftEdge) {
			this.velX *= -1;
		} else if (this.centerX >= this.rightEdge) {
			this.velX *= -1;
		} else if (this.centerY <= this.topEdge) {
			this.velY *= -1;
		} else if (this.centerY >= this.bottomEdge) {
			this.velY *= -1;
		}
	}
}

function game() {
	circles = [];
	
	for (var i = 0; i < numCircles; ++i) {
		var circle = new Circle(10);
		circles.push(circle);
	}
	
	setInterval(draw, 10);	//run draw function every 10 miliseconds
}

	
function draw() {
	//clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	for (var i = 0; i < numCircles; ++i) {
		//check collisions
		circles[i].checkCollisions();
		
		//draw circles
		ctx.beginPath();
		ctx.arc(circles[i].centerX, circles[i].centerY, circles[i].radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = "#FF0000";
		ctx.fill();
		ctx.closePath();
		
		//calculate new positions
		circles[i].centerX += circles[i].velX;
		circles[i].centerY += circles[i].velY;
	}
}

function checkAnswer() {
	if (!tookGuess) {
		var guessed = guessNum.value;
		
		var currAccuracy = 100 - Math.abs((numCircles - guessed) / (numCircles)) * 100;
		
		if (currAccuracy < 0) {
			currAccuracy = 0;
		}
		
		++plays;
		
		accuracy = (currAccuracy + accuracy * (plays - 1)) / plays;
		
		accuracyText.innerHTML = "<b>Accuracy: " + accuracy + "%</b>";
		answerText.innerHTML = "<b>Correct Answer: " + numCircles + "</b>";
		
		if (guessed == numCircles) {
			correctText.innerHTML = "<b>YOU GUESSED CORRECTLY!</b>"
		}
		
		tookGuess = true;
	}
}

function reset() {
	if (tookGuess) {
		//stop running the draw function
		clearInterval();
		
		//clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		//set new number of circles
		numCircles = Math.floor(Math.random() * (max - min)) + min;
		
		//reset text
		guessNum.value = "";
		answerText.innerHTML = "";
		correctText.innerHTML = "";
		
		//reset variables
		tookGuess = false;
		
		//run game
		game();
	}
}

//run game for first time
game();