// Constants:
var ratio = 50;           //internal blocks vs canvas pixels.
var tick = 200; 		  //refresh rate in ms.
var appleGrowth = 5;      //How much growth per apple.
var startSize = 5;        //How big the snake starts.
// Internal Dimensions:
var width;                //Internal width,  number of blocks.
var height;               //Internal height, number of blocks.
// Enums:
var left = 1;             //Enum constant for left.
var up = 2;               //Enum constant for up.
var right = 3;            //Enum constant for right.
var down = 4;             //Enum constant for down.
//Global Variabls:
var direction;            //Direction snake will travel.
var snake;                //Cooridnate array of snake, first element is head.
var alive;                //Wether or not the snake is alive.
var grow;                 //How much the snake will grow before it moves again.
var intervalId;           //Global used between functions so iteration can end.
var apple;                //Coordinate of food to grow snake.

// Initialize the global variables, and start the iteration.
function initialize() {
	var gameBoard = document.getElementById('gameBoard');
	width  = gameBoard.width/ratio;
	height = gameBoard.height/ratio;
	if (gameBoard.width%ratio!=0)   width--;
	if (gameBoard.height%ratio!=0) height--;
	apple  = {x:width/2, y:height/2};
	canvas = gameBoard.getContext('2d');
	snake  = [{x:0, y:0}];
	alive  = true;
	grow   = startSize;
	direction  = right;
	updateSnake(snake);
	updateApple(apple);
    intervalId = setInterval( function(){ iterate() }, tick);
}

// Main loop.
function iterate() {
	// move snake
	moveSnake(direction);
	updateSnake(snake);
	// update game state.
	oroborusCheck(snake);
	wallCheck(width,height,snake);
	if (appleCheck(apple,snake)) {
		eatApple(apple,snake,width,height);
		updateApple(apple);
	}
	// See if game is over.
	if (!(alive)) {
		clearInterval(intervalId);
		cleanup();
	}
}

function cleanup() {
	if(snake.length >= width*height-appleGrowth) {
		alert("you win!");
	} else {
		alert("you died dude");
	}
}

function drawBlock(x,y) {
	var borderSize = 1;
	// rectangles have borders on either side, hence 2.
	canvas.fillRect(ratio*x+borderSize, ratio*y+borderSize,
		            ratio-borderSize*2, ratio-borderSize*2);
}

function eraseBlock(x,y) {
	canvas.clearRect ( ratio*x, ratio*y, ratio, ratio );
}

function updateSnake(snake){
	//draw head
	drawBlock(snake[0].x,snake[0].y);
	//remove tail?
	if (grow > 0) {
		grow--;
	} else {
		var tmp = snake.pop();
		eraseBlock(tmp.x,tmp.y);
	}
}

function moveSnake(direction) {
	// create new head
	var tmp = {x:snake[0].x, y:snake[0].y};
	switch(direction) {
		case left:
			tmp.x -= 1;
  			break;
		case up:
			tmp.y -= 1;
  			break;
		case right:
  			tmp.x += 1;
  			break;
		case down:
			tmp.y += 1;
  			break;
	}
	// Keep it on the screen. for no-wall mode.
	/*
	tmp.x = (tmp.x+width)%width;
	tmp.y = (tmp.y+height)%height;
	*/
	// attach head.
	snake.unshift(tmp);
}

function inSnake(x, y, snake) {
	for (var i = 1; i < snake.length; i++) {
		if(snake[i].x == x && snake[i].y == y) {
			return true;
		}
	}
	return false;
}

function oroborusCheck(snake) {
	if (inSnake(snake[0].x, snake[0].y, snake)) {
		alive = false;
	}
}

function wallCheck(width,height,snake) {
	if (snake[0].x < 0 || snake[0].x >= width ||
		snake[0].y < 0 || snake[0].y >= height) {
		alive = false;
	}
}

function appleCheck(apple,snake){
	if (snake[0].x == apple.x && snake[0].y == apple.y){
		return true;
	}
	return false;
}

function eatApple(apple,snake,width,height) {
	grow += appleGrowth;
	while ( (snake.length + appleGrowth) < (width * height) &&
			appleCheck(apple,snake) ) {
		apple = placeApple(width,height,snake);
	}
}

function updateApple(apple){
	drawBlock(apple.x, apple.y);
}

function placeApple(width,height,snake){
	apple = randomSpot(width,height);
	while (inSnake(apple.x,apple.y,snake)){
		apple = randomSpot(width,height);
	}
	return apple;
}

function randomSpot(width,height) {
	x = Math.floor(Math.random()*width);
	y = Math.floor(Math.random()*height);
	return {x:x, y:y};
}

function lastDirection(snake) {
	if (snake.length <= 2) return direction;
	var x0 = snake[0].x;
	var y0 = snake[0].y;
	var x1 = snake[1].x;
	var y1 = snake[1].y;
	if (x0 > x1) return right;
	if (x0 < x1) return left;
	if (y0 > y1) return down;
	if (y0 < y1) return up;
	return direction;
}

function changeDirection(key) {
	var key      = key.which;
	var keyLeft  = 37;
	var keyUp    = 38;
	var keyRight = 39;
	var keyDown  = 40;
	switch (key) {
		case keyUp:
			direction = (lastDirection(snake)==down)?down:up;
			break;
		case keyDown:
			direction = (lastDirection(snake)==up)?up:down;
			break;
		case keyLeft:
			direction = (lastDirection(snake)==right)?right:left;
			break;
		case keyRight:
			direction = (lastDirection(snake)==left)?left:right;
			break;
	}
}

window.addEventListener("load", initialize, false);
window.onkeydown = changeDirection;
