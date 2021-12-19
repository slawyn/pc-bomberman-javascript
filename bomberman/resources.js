// function to load all the resources automatically
function loadResources(){
	resources.load([
		'players/player1/effects/explosion_vertical_line.png',
		'players/player1/effects/explosion_horizontal_line.png',
		'players/player1/effects/explosion_end_right.png',
		'players/player1/effects/explosion_end_left.png',
		'players/player1/effects/explosion_end_up.png',
		'players/player1/effects/explosion_end_down.png',
		'players/player1/effects/explosion_middle.png',
		'players/player1/effects/explosion_vertical_line_2.png',
		'players/player1/effects/explosion_horizontal_line_2.png',
		'players/player1/effects/explosion_end_right_2.png',
		'players/player1/effects/explosion_end_left_2.png',
		'players/player1/effects/explosion_end_up_2.png',
		'players/player1/effects/explosion_end_down_2.png',
		'players/player1/effects/explosion_middle_2.png',
		'players/player2/effects/explosion_vertical_line.png',
		'players/player2/effects/explosion_horizontal_line.png',
		'players/player2/effects/explosion_end_right.png',
		'players/player2/effects/explosion_end_left.png',
		'players/player2/effects/explosion_end_up.png',
		'players/player2/effects/explosion_end_down.png',
		'players/player2/effects/explosion_middle.png',
		'players/player2/effects/explosion_vertical_line_2.png',
		'players/player2/effects/explosion_horizontal_line_2.png',
		'players/player2/effects/explosion_end_right_2.png',
		'players/player2/effects/explosion_end_left_2.png',
		'players/player2/effects/explosion_end_up_2.png',
		'players/player2/effects/explosion_end_down_2.png',
		'players/player2/effects/explosion_middle_2.png',
		'levels/sudden_death.png',
    'levels/level1.jpg',
    'levels/level1_block.png',
		'levels/level1_crate.png',
		'levels/fence.png',
    'players/player1/walk_up.png',
    'players/player1/walk_down.png',
    'players/player1/walk_left.png',
    'players/player1/walk_right.png',
    'players/player1/idle_down.png',
		'players/player1/idle_up.png',
		'players/player1/idle_left.png',
		'players/player1/idle_right.png',
		'players/player1/bomb.png',
		'players/player1/dying.png',
		'players/player2/walk_up.png',
		'players/player2/walk_down.png',
		'players/player2/walk_left.png',
		'players/player2/walk_right.png',
		'players/player2/idle_down.png',
		'players/player2/idle_up.png',
		'players/player2/idle_left.png',
		'players/player2/idle_right.png',
		'players/player2/bomb.png',
		'players/player2/dying.png'
]);
	resources.onReady(init);
}


// resource container
(function() {
	var resourceCache = {};
	var readyCallbacks = [];

	// Load an image url or an array of image urls
	function load(urlOrArr) {
		if (urlOrArr instanceof Array) {
			urlOrArr.forEach(function(url) {
				_load(url);
			});
		} else {
			_load(urlOrArr);
		}
	}

	function _load(url) {
		if (resourceCache[url]) {
			return resourceCache[url];
		} else {
			var img = new Image();
			img.onload = function() {
				resourceCache[url] = img;

				if (isReady()) {
					readyCallbacks.forEach(function(func) {
						func();
					});
				}
			};
			resourceCache[url] = false;
			img.src = url;
		}
	}

	function get(url) {
		return resourceCache[url];
	}

	function isReady() {
		var ready = true;
		for ( var k in resourceCache) {
			if (resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
				ready = false;
			}
		}
		return ready;
	}

	function onReady(func) {
		readyCallbacks.push(func);
	}

	window.resources = {
		load : load,
		get : get,
		onReady : onReady,
		isReady : isReady
	};
})();




// For generating pseudo unique ids
function makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
}

// global vars

function Context(canvas,offsetX, offsetY,width,height){
  this.init = function(){
    this.posX=offsetX;
    this.posY=offsetY;
    this.width = width;
    this.height = height;
    this.context = canvas.getContext("2d");
		this.canvaswidth = canvas.width;
		this.canvasheight=canvas.height;

  }
  this.init();

  this.clearContext = function(){
      this.context.clearRect(0,0,	this.canvaswidth, this.canvasheight);
  }
  this.drawImage=function(url, x, y, sizex,sizey, posx, posy, size2x, size2y){
    this.context.drawImage(url, x, y, sizex,sizey, posx+this.posX, posy+this.posY, size2x, size2y);
  }
  this.fillRect=function(posx,posy,lengthx,lengthy){
    this.context.fillRect(posx+this.posX,posy+this.posY,lengthx,lengthy);
  }

  this.fillText=function(text,posx,posy,color,font){
    this.context.fillStyle = color;
    this.context.font = font;
    this.context.fillText(text, posx+this.posX,posy+this.posY);
  }

}


function Sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}
