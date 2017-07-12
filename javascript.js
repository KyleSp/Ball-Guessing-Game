/*
	Made by Kyle Spurlock
*/

//html elements

var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");
var guessNum = document.getElementById("guessNum");
var accuracyText = document.getElementById("accuracyText");
var answerText = document.getElementById("answerText");
var correctText = document.getElementById("correctText");

//constants
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const NUM_CIRC_MAX = 30;
const NUM_CIRC_MIN = 5;

const CIRC_SPEED = 1;

//variables

var tookGuess = false;

var accuracy = 0;
var plays = 0;

var numCircles;
var circles;

//classes

class Circle {
	constructor(radius) {
		this.radius = radius;
		this.centerX = radius + WIDTH / 2;
		this.centerY = radius + HEIGHT / 2;
		
		this.velX = CIRC_SPEED * (2 * Math.random() - 1);
		this.velY = CIRC_SPEED * (2 * Math.random() - 1);
		
		this.leftEdge = radius;
		this.rightEdge = WIDTH - radius;
		this.topEdge = radius;
		this.bottomEdge = HEIGHT - radius;
	}
	
	//check for collisions between a circle and the edges of the window and then change the circle's movement vector
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

//functions

//calculate a random number from min (inclusive) to max (exclusive)
function calcRand(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

//primary game function that creates all of the circles and draws them every 10 milliseconds
function game() {
	circles = [];
	
	//get random number of circles
	numCircles = calcRand(NUM_CIRC_MIN, NUM_CIRC_MAX);
	
	for (var i = 0; i < numCircles; ++i) {
		var circle = new Circle(10);
		circles.push(circle);
	}
	
	setInterval(draw, 10);	//run draw function every 10 milliseconds
}

//clear the canvas and draw a frame
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

//check how close the user's guess is to the actual amount, and calculate the accuracy
function checkAnswer() {
	if (!tookGuess && guessNum.value != "") {
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

//reset canvas and html text, and restart the game
function reset() {
	if (tookGuess) {
		//stop running the draw function
		clearInterval();
		
		//clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
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