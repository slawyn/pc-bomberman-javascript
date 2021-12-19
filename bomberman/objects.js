var DEBUG_SHOW_HITBOXES = 0;



// Sprite object
function Sprite(options) {
    this.init = function() {
        this.context = options.canvas;
        this.size = options.size;
        this.speed = options.speed;
        this.frames = options.frames;
        this._index = 0;
        this.url = options.url;
        this.once = options.once;
    };
    this.init();

    // update function
    this.update = function(dt) {
        this._index += this.speed * dt;
    };

    this.render = function(posx, posy) {
        var frame;

        if (this.speed > 0) {
            var max = this.frames.length;
            var idx = 0|(this._index);
            frame = this.frames[idx % max];
            if (this.once && idx >= max) {
                this.done = true;
                return;
            }
        } else {
            frame = 0;
        }


        x = frame * this.size[0];
        this.context.drawImage(resources.get(this.url), x, 0, this.size[0],
            this.size[1], posx, posy, this.size[0], this.size[1]);
    };
}

// hitbox object
function Hitbox(startX, startY, lengthX, lengthY) {
    this.posX = startX;
    this.posY = startY;
    this.lengthX = lengthX;
    this.lengthY = lengthY;
}

// explosion object
function Explosion(context, owner, posx, posy, explosion_directions, range) {
    this.init = function() {
        this.posX = posx;
        this.owner = owner;
        this.posY = posy;
        this.rendersprites = {};
        this.rendersprites_positions = {};
        this.lifetime = 0.8;
        this.sprites = {
            center: new Sprite({
                canvas: context,
                url: 'players/' + owner.costume + '/effects/explosion_middle.png',
                size: [40, 40],
                speed: 20,
                frames: [0, 1, 2]
            }),
            horizontal_line: new Sprite({
                canvas: context,
                url: 'players/' + owner.costume + '/effects/explosion_horizontal_line.png',
                size: [40, 40],
                speed: 20,
                frames: [0, 1, 2]
            }),
            vertical_line: new Sprite({
                canvas: context,
                url: 'players/' + owner.costume + '/effects/explosion_vertical_line.png',
                size: [40, 40],
                speed: 20,
                frames: [0, 1, 2]
            }),
            end_right: new Sprite({
                canvas: context,
                url: 'players/' + owner.costume + '/effects/explosion_end_right.png',
                size: [40, 40],
                speed: 20,
                frames: [0, 1, 2]
            }),
            end_left: new Sprite({
                canvas: context,
                url: 'players/' + owner.costume + '/effects/explosion_end_left.png',
                size: [40, 40],
                speed: 20,
                frames: [0, 1, 2]
            }),
            end_up: new Sprite({
                canvas: context,
                url: 'players/' + owner.costume + '/effects/explosion_end_up.png',
                size: [40, 40],
                speed: 20,
                frames: [0, 1, 2]
            }),
            end_down: new Sprite({
                canvas: context,
                url: 'players/' + owner.costume + '/effects/explosion_end_down.png',
                size: [40, 40],
                speed: 20,
                frames: [0, 1, 2]
            }),

            center2: new Sprite({
                canvas: context,
                url: 'players/' + owner.costume + '/effects/explosion_middle_2.png',
                size: [40, 40],
                speed: 20,
                frames: [0]
            }),
            horizontal_line2: new Sprite({
                canvas: context,
                url: 'players/' + owner.costume + '/effects/explosion_horizontal_line_2.png',
                size: [40, 40],
                speed: 20,
                frames: [0]
            }),
            vertical_line2: new Sprite({
                canvas: context,
                url: 'players/' + owner.costume + '/effects/explosion_vertical_line_2.png',
                size: [40, 40],
                speed: 20,
                frames: [0]
            }),
            end_right2: new Sprite({
                canvas: context,
                url: 'players/' + owner.costume + '/effects/explosion_end_right_2.png',
                size: [40, 40],
                speed: 20,
                frames: [0]
            }),
            end_left2: new Sprite({
                canvas: context,
                url: 'players/' + owner.costume + '/effects/explosion_end_left_2.png',
                size: [40, 40],
                speed: 20,
                frames: [0]
            }),
            end_up2: new Sprite({
                canvas: context,
                url: 'players/' + owner.costume + '/effects/explosion_end_up_2.png',
                size: [40, 40],
                speed: 20,
                frames: [0]
            }),
            end_down2: new Sprite({
                canvas: context,
                url: 'players/' + owner.costume + '/effects/explosion_end_down_2.png',
                size: [40, 40],
                speed: 20,
                frames: [0]
            })
        };


        this.posCELL = 0|((this.posX ) / 40) + (0|((this.posY ) / 40)) * 15;

        this.rendersprites[this.posCELL] = [this.sprites.center, this.sprites.center2];
        this.rendersprites_positions[this.posCELL] = [this.posX, this.posY];

        // left side
        for (var x_min = 1; x_min <= (explosion_directions.left - 1); x_min++) {
            this.rendersprites[this.posCELL - x_min] = [this.sprites.horizontal_line, this.sprites.horizontal_line2];
            this.rendersprites_positions[this.posCELL - x_min] = [this.posX - x_min * 40, this.posY];
        }

        for (var x_plu = 1; x_plu <= (explosion_directions.right - 1); x_plu++) {
            this.rendersprites[this.posCELL + x_plu] = [this.sprites.horizontal_line, this.sprites.horizontal_line2];
            this.rendersprites_positions[this.posCELL + x_plu] = [this.posX + x_plu * 40, this.posY];
        }

        for (var y_min = 1; y_min <= (explosion_directions.up - 1); y_min++) {
            this.rendersprites[this.posCELL - y_min * 15] = [this.sprites.vertical_line, this.sprites.vertical_line2];
            this.rendersprites_positions[this.posCELL - y_min * 15] = [this.posX, this.posY - y_min * 40];
        }

        for (var y_plu = 1; y_plu <= (explosion_directions.down - 1); y_plu++) {
            this.rendersprites[this.posCELL + y_plu * 15] = [this.sprites.vertical_line, this.sprites.vertical_line2];
            this.rendersprites_positions[this.posCELL + y_plu * 15] = [this.posX, this.posY + y_plu * 40];
        }

        // ending animation
        if (explosion_directions.left > 0) {
            this.rendersprites[this.posCELL - explosion_directions.left] = [this.sprites.end_left, this.sprites.end_left2];
            this.rendersprites_positions[this.posCELL - explosion_directions.left] = [this.posX - explosion_directions.left * 40, this.posY];
        }


        // ending animation
        if (explosion_directions.right > 0) {
            this.rendersprites[this.posCELL + explosion_directions.right] = [this.sprites.end_right, this.sprites.end_right2];
            this.rendersprites_positions[this.posCELL + explosion_directions.right] = [this.posX + explosion_directions.right * 40, this.posY];
        }


        // ending animation
        if (explosion_directions.up > 0) {
            this.rendersprites[this.posCELL - explosion_directions.up * 15] = [this.sprites.end_up, this.sprites.end_up2];
            this.rendersprites_positions[this.posCELL - explosion_directions.up * 15] = [this.posX, this.posY - explosion_directions.up * 40];
        }


        // ending animation
        if (explosion_directions.down > 0) {
            this.rendersprites[this.posCELL + explosion_directions.down * 15] = [this.sprites.end_down, this.sprites.end_down2];
            this.rendersprites_positions[this.posCELL + explosion_directions.down * 15] = [this.posX, this.posY + explosion_directions.down * 40];
        }
    }

    this.init();


    this.explodedCells = function() {
      var keys = [];

      for (var key in this.rendersprites) {
          if (this.rendersprites.hasOwnProperty(key)) {
              keys.push(key);
          }
      }
      return keys;
    }

    this.update = function(dt) {

        for (var x in this.sprites) {
            this.sprites[x].update(dt);

        }

        this.lifetime -= dt;
    }

    this.done = function() {
        if (this.lifetime <= 0) {
            return true;
        }
        return false;
    }


    this.render = function() {
        for (var cellpos in this.rendersprites) {
            this.rendersprites[cellpos][0].render(this.rendersprites_positions[cellpos][0], this.rendersprites_positions[cellpos][1]);
            this.rendersprites[cellpos][1].render(this.rendersprites_positions[cellpos][0], this.rendersprites_positions[cellpos][1]);
        }
        // render left

        // render right

        // render up

        // render down
    }
}



// Player object
function Character(context, posx, posy, costume) {
    this.init = function() {
        this.id = makeid();
        this.startingposx=posx;
        this.startingposy=posy;
        this.posX = posx;
        this.posY = posy;
        this.stepX=0;
        this.stepY=0;
        this.costume = costume;
        this.bombscarrying = 8;
        this.bombrange = 5;
        this.bombcooldown = 0.0;
        this.bombsplaced = 0;
        this.kills = 0;
        this.context = context;
        this.state = 1; // alive
        this.speed = 120;
        this.hitbox = new Hitbox(20, 35, 20, 20);
        this.posCELL = Math.floor(((this.posX + this.hitbox.posX) + this.hitbox.lengthX / 2) / 40) + Math.floor(((this.posY + this.hitbox.posY) + this.hitbox.lengthY / 2) / 40) * 15;
        this.sounds = {"death": new Sound("sounds/death.mp3")};
        this.sprites = {
            idle_down: new Sprite({
                canvas: context,
                url: 'players/' + this.costume + '/idle_down.png',
                size: [60, 60],
                speed: 20,
                frames: [0]
            }),
            idle_up: new Sprite({
                canvas: context,
                url: 'players/' + this.costume + '/idle_up.png',
                size: [60, 60],
                speed: 20,
                frames: [0]
            }),
            idle_left: new Sprite({
                canvas: context,
                url: 'players/' + this.costume + '/idle_left.png',
                size: [60, 60],
                speed: 20,
                frames: [0]
            }),
            idle_right: new Sprite({
                canvas: context,
                url: 'players/' + this.costume + '/idle_right.png',
                size: [60, 60],
                speed: 20,
                frames: [0]
            }),
            walk_down: new Sprite({
                canvas: context,
                url: 'players/' + this.costume + '/walk_down.png',
                size: [60, 60],
                speed: 20,
                frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            }),
            walk_up: new Sprite({
                canvas: context,
                url: 'players/' + this.costume + '/walk_up.png',
                size: [60, 60],
                speed: 20,
                frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            }),
            walk_left: new Sprite({
                canvas: context,
                url: 'players/' + this.costume + '/walk_left.png',
                size: [60, 60],
                speed: 20,
                frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            }),
            walk_right: new Sprite({
                canvas: context,
                url: 'players/' + this.costume + '/walk_right.png',
                size: [60, 60],
                speed: 20,
                frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            }),
            dying: new Sprite({
                canvas: context,
                url: 'players/' + this.costume + '/dying.png',
                size: [100, 100],
                speed: 20,
                frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                once: true
            })
        };


        this.currentsprite = this.sprites.walk_left;

    }
    this.init();

    this.respawn = function(){
        this.sprites.dying.done=false;
        this.sprites.dying._index = 0;
        this.currentsprite = this.sprites.walk_left;
        this.posX = this.startingposx;
        this.posY = this.startingposy;
        this.state = 1;

    }
    this.checkLevelBounds = function(level) {
        if (!this.state)
            return;
        var leftside = this.posX + this.hitbox.posX;
        var rightside = leftside + this.hitbox.lengthX;
        var upperside = this.posY + this.hitbox.posY;
        var lowerside = upperside + this.hitbox.lengthY;

        var obj_leftside = level.posX + level.hitbox.posX;
        var obj_rightside = obj_leftside + level.hitbox.lengthX;
        var obj_upperside = level.posY + level.hitbox.posY;
        var obj_lowerside = obj_upperside + level.hitbox.lengthY;

        if (obj_leftside > leftside) {
            this.posX = obj_leftside - this.hitbox.posX;
        }

        if (obj_rightside < rightside) {
            this.posX = obj_rightside - (this.hitbox.posX+this.hitbox.lengthX);
        }

        if (obj_upperside > upperside) {
            this.posY = obj_upperside - this.hitbox.posY;
        }

        if (obj_lowerside < lowerside) {
            this.posY = obj_lowerside -(this.hitbox.posY+this.hitbox.lengthY);
        }
}


    this.checkExplosionCollisions = function(explosions) {
        if (!this.state)
            return;
        poscell = this.posCELL + '';
        for (var cellpos in explosions) {
            var explosion_range = explosions[cellpos].explodedCells();
            for (var i in explosion_range) {

                if (explosion_range[i] == poscell) {
                    var owner = explosions[cellpos].owner;
                    if(owner == this){
                      this.kills--;
                    }else{
                      owner.kills++;
                    }
                  this.die();
                }
            }
        }
    }

    this.checkDeathBlockCollision = function(object) {
        if (!this.state)
            return;

        var leftside = this.posX + this.hitbox.posX;
        var rightside = leftside + this.hitbox.lengthX;
        var upperside = this.posY + this.hitbox.posY;
        var lowerside = upperside + this.hitbox.lengthY;

        var obj_leftside = object.posX + object.hitbox.posX;
        var obj_rightside = obj_leftside + object.hitbox.lengthX;
        var obj_upperside = object.posY + object.hitbox.posY;
        var obj_lowerside = obj_upperside + object.hitbox.lengthY;



        return (leftside <= obj_rightside && obj_leftside <= rightside && upperside <= obj_lowerside && obj_upperside <= lowerside);
      }

    // optimized but not tested
    this.checkBlockCollisions = function(objects) {
        if (!this.state)
            return;

        var leftside = this.posX + this.hitbox.posX;
        var rightside = leftside + this.hitbox.lengthX;
        var upperside = this.posY + this.hitbox.posY;
        var lowerside = upperside + this.hitbox.lengthY;


        //ptimization! should only pass objects that are in the vicinity
        var list_of_possible_collisions = [];
        list_of_possible_collisions.push(this.posCELL);
        list_of_possible_collisions.push(this.posCELL + 1);
        list_of_possible_collisions.push(this.posCELL - 1);
        list_of_possible_collisions.push(this.posCELL + 15);
        list_of_possible_collisions.push(this.posCELL - 15);

        //maybe better to add diagonals?
        list_of_possible_collisions.push(this.posCELL + 1 + 15);
        list_of_possible_collisions.push(this.posCELL + 1 - 15);
        list_of_possible_collisions.push(this.posCELL - 1 + 15);
        list_of_possible_collisions.push(this.posCELL - 1 - 15);


        for (var key in list_of_possible_collisions) {

            if (!(list_of_possible_collisions[key] in objects)) {
                continue;
            }

            var object = objects[list_of_possible_collisions[key]];
            var obj_leftside = object.posX + object.hitbox.posX;
            var obj_rightside = obj_leftside + object.hitbox.lengthX;
            var obj_upperside = object.posY + object.hitbox.posY;
            var obj_lowerside = obj_upperside + object.hitbox.lengthY;



            if (leftside <= obj_rightside && obj_leftside <= rightside && upperside <= obj_lowerside && obj_upperside <= lowerside) //(Math.abs(dx) <= w && Math.abs(dy) <= h)
            {
                if (object.overlappable && (object.overlappedObjects[this.id ] >=0)) {
                    object.overlappedObjects[this.id]++;
                } else {
                    // Minkowski sum
                    var w = 0.5 * (this.hitbox.lengthX + object.hitbox.lengthX);
                    var h = 0.5 * (this.hitbox.lengthY + object.hitbox.lengthY);
                    var dx = (obj_leftside + obj_rightside) / 2 - (leftside + rightside) / 2;
                    var dy = (obj_lowerside + obj_upperside) / 2 - (upperside + lowerside) / 2;

                    /* collision! */
                    var wy = w * dy;
                    var hx = h * dx;

                    if (wy > hx)
                        if (wy > -hx)
                            this.posY = obj_upperside - (this.hitbox.posY+this.hitbox.lengthY);
                        /* collision at the top */
                        else
                            this.posX = obj_rightside - this.hitbox.posX;

                        /* on the right */
                    else
                    if (wy > -hx)
                        this.posX = obj_leftside -(this.hitbox.posX+this.hitbox.lengthX);
                    /* on the left */
                    else
                        this.posY = obj_lowerside - this.hitbox.posY;
                    /* at the bottom */
                }
            }
        }

    }

    this.dead = function() {
        return (this.state == 0 && this.currentsprite.done);

    }

    this.update = function(dt, dirx, diry) {
        this.currentsprite.update(dt); // update animation
        if (!this.state) {
            return;
        }

        // update position
        this.posX+= (dt * this.speed * (dirx));
        this.posY+= (dt * this.speed * (diry));

        var posx = 0|(((this.posX + this.hitbox.posX) + this.hitbox.lengthX / 2) / 40);
        var posy = 0|(((this.posY + this.hitbox.posY)  + this.hitbox.lengthY / 2) / 40);
        // i*14+j

        this.posCELL = posx + posy * 15;

        if (dirx > 0) {
            this.currentsprite = this.sprites.walk_right;
        }
        if (dirx < 0) this.currentsprite = this.sprites.walk_left;
        if (diry < 0) this.currentsprite = this.sprites.walk_up;
        if (diry > 0) this.currentsprite = this.sprites.walk_down;
        if (diry == 0 && dirx == 0) {

            if (this.currentsprite == this.sprites.walk_down)
                this.currentsprite = this.sprites.idle_down;
            else if (this.currentsprite == this.sprites.walk_up)
                this.currentsprite = this.sprites.idle_up;
            else if (this.currentsprite == this.sprites.walk_left)
                this.currentsprite = this.sprites.idle_left;
            else if (this.currentsprite == this.sprites.walk_right)
                this.currentsprite = this.sprites.idle_right;
        }

        if (this.bombcooldown < 0.2)
            this.bombcooldown += dt;

    }




    this.laybomb = function(dt, bomb, bombs, players) {
        if (!this.state)
            return false;

        if (bomb && (this.bombsplaced < this.bombscarrying) && (this.bombcooldown >= 0.2)) {


            if (this.posCELL in bombs) // bomb aleready placed in this cell
                return

            this.bombcooldown = 0.0;
            bombs[this.posCELL] = new Bomb(this.context, this, (this.posCELL % 15 * 40), (this.posCELL - this.posCELL % 15) / 15 * 40 , players);
            this.bombsplaced++;

            return true;
        }

        return false;
    }

    this.die = function(){
      this.state = 0;
      this.currentsprite = this.sprites.dying
      this.posX = this.posX - 20;
      this.posY = this.posY - 20;
      this.sounds["death"].play();
    }
    this.render = function() {
        this.currentsprite.render(0|(this.posX), 0|(this.posY));
        if(DEBUG_SHOW_HITBOXES){
          this.context.fillStyle = "#FF0000";
          this.context.fillRect(this.posX+this.hitbox.posX,this.posY+this.hitbox.posY,this.hitbox.lengthX,this.hitbox.lengthY);
        }
    }
}


// CONCRETE BLOCKS
function ConcreteBlock(context, posx, posy) {
    this.init = function() {
        this.posX = posx;
        this.posY = posy;
        this.context = context;
        this.overlappable = 0;
        this.sprites = {
            level1_block: new Sprite({
                canvas: context,
                url: 'levels/level1_block.png',
                size: [36, 36],
                speed: 1,
                frames: [0]
            })
        };
        this.currentsprite = this.sprites.level1_block;
        this.hitbox = new Hitbox(0, 0, 36, 36);
        this.posCELL = Math.floor(((this.posX + this.hitbox.posX)  + this.hitbox.lengthX / 2) / 40) + Math.floor(((this.posY + this.hitbox.posY) + this.hitbox.lengthY / 2) / 40) * 15;
    };
    this.init();

    this.update = function(dt) {
        this.currentsprite.update(dt);

    }

    this.render = function() {

        this.currentsprite.render(this.posX, this.posY);
        if(DEBUG_SHOW_HITBOXES){
            this.context.fillStyle = "#0000FF";
            this.context.fillRect(this.posX+this.hitbox.posX,this.posY+this.hitbox.posY,this.hitbox.lengthX,this.hitbox.lengthY);
        }

    }
}


// CRATES
function Crate(context, posx, posy, players) {

    this.init = function() {
        this.posX = posx;
        this.posY = posy;
        this.context = context;
        this.overlappable = 0;
        this.sprites = {
            level1_crate: new Sprite({
                canvas: context,
                url: 'levels/level1_crate.png',
                size: [36, 36],
                speed: 1,
                frames: [0]
            })
        };
        this.currentsprite = this.sprites.level1_crate;
        this.hitbox = new Hitbox(0, 0, 36, 36);
        this.posCELL = Math.floor(((this.posX + this.hitbox.posX) + this.hitbox.lengthX / 2) / 40) + Math.floor(((this.posY + this.hitbox.posY) + this.hitbox.lengthY / 2) / 40) * 15;;




    }
    this.init();

    this.update = function(dt) {
        this.currentsprite.update(dt);

    }

    this.render = function() {
        this.currentsprite.render(this.posX, this.posY);

    }
}

// BACKGROUND
function Field(context) {
    this.init = function() {
        this.posX =0
        this.posY =0;
        this.sprites = {
            level1: new Sprite({
                canvas: context,
                url: 'levels/level1.jpg',
                size: [604, 444],
                speed: 1,
                frames: [0]
            })
        };
        this.currentsprite = this.sprites.level1;
        this.hitbox = new Hitbox(0, 0, 604, 444);
    };
    this.init();



    this.update = function(dt) {
        this.currentsprite.update(dt);

    }

    this.render = function() {
        this.currentsprite.render(this.posX, this.posY);
    }

}


function Decoration(context, posx,posy){
  this.init = function() {
      this.posX = posx;
      this.posY = posy;
      this.sprites = {
          fence: new Sprite({
              canvas: context,
              url: 'levels/fence.png',
              size: [40, 40],
              speed: 20,
              frames: [0]
          })
      };

      this.currentsprite = this.sprites.fence;

  }
  this.init();

  this.update = function(dt){
      this.currentsprite.update();
    }
  this.render = function(){
        this.currentsprite.render(this.posX, this.posY);
  }


}

// bomb
function Bomb(context, owner, posx, posy, players) {
    this.init = function() {
        this.posX = posx;
        this.posY = posy;
        this.owner = owner;
        this.range = owner.bombrange;
        this.lifetime = 3; // 4 seconds: can be made configurable
        this.context = context;
        this.sounds = {"bomb_explosion":new Sound(		'sounds/bomb_explosion.mp3'),"bomb_drop": new Sound('sounds/bomb_drop.mp3')}
        this.sprites = {
            bomb: new Sprite({
                canvas: context,
                url: 'players/' + owner.costume + '/bomb.png',
                size: [40, 40],
                speed: 20,
                frames: [0, 1, 2, 3, 4, 3, 2, 1]
            })
        };
        this.currentsprite = this.sprites.bomb;
        this.hitbox = new Hitbox(10, 10, 20, 20);

        this.posCELL = Math.floor(((this.posX + this.hitbox.posX)  + this.hitbox.lengthX / 2) / 40) + Math.floor(((this.posY + this.hitbox.posY) + this.hitbox.lengthY / 2) / 40) * 15;;
        this.overlappable = 1;
        this.overlappedObjects={}
        for (var cellpos in players){
          this.overlappedObjects[players[cellpos].id]=0;
        }

        this.sounds["bomb_drop"].play();
    };
    this.init();

    this.update = function(dt) {
        this.currentsprite.update(dt);
        this.lifetime -= dt;
        if (this.overlappable == 1) {
            this.overlappable = 0;
            for(var obj in this.overlappedObjects){
              if(this.overlappedObjects[obj]>0)
              {
                this.overlappable = 1;
                this.overlappedObjects[obj] = 0;
              }else{
                this.overlappedObjects[obj]=-1;
              }
            }
        }

    }

    // if this bomb has exploded
    this.exploded = function() {
        if (this.lifetime <= 0) {
            owner.bombsplaced--;
            this.sounds["bomb_explosion"].play();
            return true;
        }
        return false;
    }



    this.render = function() {
        this.currentsprite.render(Math.floor(this.posX), Math.floor(this.posY));
        if(DEBUG_SHOW_HITBOXES){
          this.context.fillStyle = "#00FFFF";
          this.context.fillRect(this.posX+this.hitbox.posX,this.posY+this.hitbox.posY,this.hitbox.lengthX,this.hitbox.lengthY);
        }

    }
}

function Object(posx,posy, sprite){
  this.posX = posx;
  this.posY = posy;
  this.currentsprite = sprite;

  this.update = function(dt){
    this.currentsprite.update(dt);
  }

  this.done = function(){
    return this.currentsprite.done;
  }
  this.render = function(){
    this.currentsprite.render(this.posX, this.posY);
  }

}
