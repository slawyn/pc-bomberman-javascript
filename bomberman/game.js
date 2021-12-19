var G_FIELD;
var G_CONCRETE_BLOCKS = {};
var G_CONCRETE_DEATH_BLOCKS={};
var G_START_SUDDEN_DEATH=0;
var G_BOMBS = {};
var G_CRATES = {};
var G_EXPLOSIONS = [];
var G_GAMECONTEXT;
var G_BORDERCONTEXT=[];
var G_DECORATIONS_BACK=[];
var G_DECORATIONS_FRONT =[]
var G_SPRITES=[];
var G_ROUND_ENDED;
var G_SUDDEN_DEATH_TIME;
var G_SOUNDS ={};

var G_PLAYERS = [];
var G_PLAYER1;
var G_PLAYER2;
var G_WINNER;
var G_LAST_TIME; // global variable for calculating dt
var G_TIME;
var G_FPS;

var help;
var nm_of_death_blocks;
var death_block_side_done_counter;
var fps_counter;
var death_block_starting_side;
var death_block_distance;
var invertedx;
var invertedy;
var XXX;
var YYY;

// automatically generated according to G_Actions


var G_Controls = {};
var G_Actions = {
    player1_move_left: 65,
    player1_move_right: 68,
    player1_move_down: 83,
    player1_move_up: 87,
    player1_lay_bomb: 67,
    player2_move_left: 37,
    player2_move_right: 39,
    player2_move_down: 40,
    player2_move_up: 38,
    player2_lay_bomb: 107
};

// field is 15 x 11: each block is 36 pixels + 2 pixels(border)
//0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
var G_LEVEL_Layout = [
    [0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0], // 0.
    [0, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 0], // 1. row
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 3. row
    [3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3], // 3. row
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 4. row
    [3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3], // 5. row
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 6. row
    [3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3], // 7. row
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // 8. row
    [0, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 0], // 9. row
    [0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0], // 10. row
];

function reset_globals(){

      for(var key in G_EXPLOSIONS){
        delete G_EXPLOSIONS[key];
      }

      for(var key in G_CONCRETE_BLOCKS){
        delete G_CONCRETE_BLOCKS[key];
      }

      for(var key in G_CONCRETE_DEATH_BLOCKS){
        delete G_CONCRETE_DEATH_BLOCKS[key];
      }

      for(var key in G_BOMBS){
        delete G_BOMBS[key];
      }

      for(var key in G_CRATES){
        delete G_CRATES[key];
      }


      for(var key in G_BORDERCONTEXT){
        G_BORDERCONTEXT.pop(key);
      }

      for(var key in G_SOUNDS){
        delete G_SOUNDS[key];
      }

      for(var key in G_PLAYERS){
        G_PLAYERS[key].respawn();
      }

      for(var key in G_DECORATIONS_BACK){
        delete G_DECORATIONS_BACK[key];
        delete G_DECORATIONS_FRONT[key];
      }

      G_GAMECONTEXT = null;
      G_SUDDEN_DEATH_TIME = 20;
      G_START_SUDDEN_DEATH=0;

      G_FIELD = null;
    //  G_PLAYER1 = null;
    //  G_PLAYER2 = null;
      G_WINNER = null;
      G_LAST_TIME = Date.now(); // global variable for calculating dt
      G_TIME = 0;
      G_FPS = 0;

      help = 0;
      nm_of_death_blocks = 0;
      death_block_side_done_counter =0;
      fps_counter=0;
      death_block_starting_side=0;
      death_block_distance = 0;
      invertedx=0;
      invertedy=0;
      XXX=0;
      YYY=0;
}
// create control dictionary
function create_controls() {
    for (var key in G_Actions){
    // create controls according to G_Actions
        G_Controls[G_Actions[key]] = 0;
    }
    // start listening to the keys
    window.addEventListener('keydown', keyHandler, false);
    window.addEventListener('keyup', keyHandler, false);
}


function renderBorder0(dt){
  if(!G_BORDERCONTEXT[0])
    return;

  G_BORDERCONTEXT[0].fillText("Name Range Bombs Kills",10,40,"#555555","14px Arial");
  var idx = 0;
  for(var i in G_PLAYERS){
    var string = G_PLAYERS[i].costume+"   "+G_PLAYERS[i].bombrange + "           "+G_PLAYERS[i].bombscarrying+"     "+G_PLAYERS[i].kills;
    G_BORDERCONTEXT[0].fillText(string,10,70+20*idx,"#FFFFFF","14px Arial");
    idx++;

  }
  var time_format = "time: 0:";
  var time = (G_TIME%60)|0;
  if(time<10){
    time_format = time_format +"0"+time;
  }else{
    time_format = time_format+time;
  }
  G_BORDERCONTEXT[0].fillText(time_format,180,20*idx,"#124511","14px Arial");
  G_BORDERCONTEXT[0].fillText("fps:"+(G_FPS|0),180,50+20*idx,"#555555","14px Arial");

  if(G_ROUND_ENDED){
    G_BORDERCONTEXT[0].fillText("WINNER IS "+G_WINNER,100,300,"#FF1100",'50px Arial');
  }
}

// Main game loop
function gameLoop() {

    var now = Date.now();
    var dt = (now - G_LAST_TIME) / 1000.0; // about 18 milliseconds


    update(dt); // update the game
    G_GAMECONTEXT.clearContext();// WARNING is there flickering or problems with joint pixels?


    render(); // render the game
    renderBorder0();


    G_LAST_TIME = now;
    window.requestAnimationFrame(gameLoop);

}


// Handle input for all players
function handleInput(dt) {
    for (var cellpos in G_PLAYERS) {

        if (G_PLAYERS[cellpos] == G_PLAYER1) {
            var dirX = (-G_Controls[G_Actions.player1_move_left]) | G_Controls[G_Actions.player1_move_right]; // set x direction: either negative 0 or positive

            var dirY = (-G_Controls[G_Actions.player1_move_up]) | G_Controls[G_Actions.player1_move_down]; // set y direction

            if(dirX)
              dirY=0;
            G_PLAYER1.update(dt, dirX, dirY); // update player movement. TODO we should immediately check for collisions before anything else! WARNING on higher speed bomb is placed everywhere!
            if(G_PLAYER1.laybomb(dt, G_Controls[G_Actions.player1_lay_bomb], G_BOMBS, G_PLAYERS)){

            };  // place a bomb

        } else if (G_PLAYERS[cellpos] == G_PLAYER2) {
            var dirX = (-G_Controls[G_Actions.player2_move_left]) | G_Controls[G_Actions.player2_move_right];
            var dirY = (-G_Controls[G_Actions.player2_move_up]) | G_Controls[G_Actions.player2_move_down];


            if(dirX)
              dirY=0;
            G_PLAYER2.update(dt, dirX, dirY);
            if(G_PLAYER2.laybomb(dt, G_Controls[G_Actions.player2_lay_bomb], G_BOMBS, G_PLAYERS)){

            };
        } // TODO add more players


    }

}


// update  objects
function updateEntities(dt) {

    for (var cellpos in G_SPRITES) {
      G_SPRITES[cellpos].update(dt);
      if(G_SPRITES[cellpos].done()){
        delete G_SPRITES[cellpos];
      }

    }
    // update explosions
    for (var cellpos in G_EXPLOSIONS) {
        G_EXPLOSIONS[cellpos].update(dt);
        if (G_EXPLOSIONS[cellpos].done())
            delete G_EXPLOSIONS[cellpos];
    }

    // update bombs
    for (var cellpos in G_BOMBS) {
        G_BOMBS[cellpos].update(dt);

        // TODO create chain reaction by exploding all the other bombs
        if (G_BOMBS[cellpos].exploded(G_CRATES, G_BOMBS, G_CONCRETE_BLOCKS)) {
            var collisions = handleExplosion(cellpos);

            // remove the destroyable objects
            delete G_BOMBS[cellpos];

            // delete exploded bombs
            for (var i in collisions.col_bombs) {
                delete G_BOMBS[collisions.col_bombs[i]];
            }

            // delete destroyed crates
            for (var i in collisions.col_crates) {
               delete G_CRATES[collisions.col_crates[i]];
            }

        }
    }

    // update the rest
}

// Handle different collisions
function handleCollisions(dt) {
    for (var cellpos in G_PLAYERS) {

        G_PLAYERS[cellpos].checkLevelBounds(G_FIELD);                     // don't let player go off the map
        G_PLAYERS[cellpos].checkBlockCollisions(G_CONCRETE_BLOCKS);       // don't let players go through blocks
        G_PLAYERS[cellpos].checkBlockCollisions(G_CRATES);                //
        G_PLAYERS[cellpos].checkBlockCollisions(G_CONCRETE_DEATH_BLOCKS); // don't let players go through blocks
        G_PLAYERS[cellpos].checkBlockCollisions(G_BOMBS);                 // don't let players go through bombs
        G_PLAYERS[cellpos].checkExplosionCollisions(G_EXPLOSIONS);        // player dies if he goes into explosion

    }
}

function handleExplosion(cellpos) {
    var collisions = {
        col_bombs: [],
        col_crates: [],
        col_field_blocks: []
    };
    // let user use the bomb

    // exploded
    var cellpos_ = parseInt(cellpos);
    var hor = cellpos_ % 15;
    var ver = (cellpos_ - hor) / 15;
    var explosion_direction = {
        left: 1,
        right: 1,
        up: 1,
        down: 1
    };
    var range = G_BOMBS[cellpos].range;


    // horizontal
    if (hor == 14) {
        explosion_direction.right = 0;
    } else if (hor == 0) {
        explosion_direction.left = 0;
    }

    // vertical
    if (ver == 10) {
        explosion_direction.down = 0;

    } else if (ver == 0) {
        explosion_direction.up = 0;
    }
    if (cellpos_ in G_CRATES) {
        collisions.col_crates.push(cellpos_);
    }

    if (explosion_direction.left) {
        while (true) {
            if ((cellpos_ - explosion_direction.left) in G_CRATES) {
                collisions.col_crates.push(cellpos_ - explosion_direction.left);
                break;

            } else if ((cellpos_ - explosion_direction.left) in G_CONCRETE_BLOCKS) {
                explosion_direction.left--;
                break;
            } else if ((cellpos_ - explosion_direction.left) in G_BOMBS) {
                if (G_BOMBS[(cellpos_ - explosion_direction.left)].lifetime > 0) { // avoid endless recursion, if lifetime is already 0 we don't add the bombs to the list
                    collisions.col_bombs.push(cellpos_ - explosion_direction.left);


                }
                explosion_direction.left--;
                break;
            } else if ((cellpos_ - explosion_direction.left) % 15 == 0) {
                break;
            } else if (explosion_direction.left < range) {
                explosion_direction.left++;
            } else {
                break;
            }

        }

    }

    if (explosion_direction.right) {
        while (true) {
            if ((explosion_direction.right + cellpos_) in G_CRATES) {
                collisions.col_crates.push(explosion_direction.right + cellpos_);
                break;

            } else if ((explosion_direction.right + cellpos_) in G_CONCRETE_BLOCKS) {
                explosion_direction.right--;
                break;
            } else if ((explosion_direction.right + cellpos_) in G_BOMBS) {
                if (G_BOMBS[(explosion_direction.right + cellpos_)].lifetime > 0) {
                    collisions.col_bombs.push(explosion_direction.right + cellpos_);


                }
                explosion_direction.right--;
                break;

            } else if ((explosion_direction.right + cellpos_) % 15 == 14) {
                break;
            } else if (explosion_direction.right < range) {
                explosion_direction.right++;
            } else {
                break;
            }

        }

    }


    if (explosion_direction.up) {
        while (true) {
            if ((cellpos_ - explosion_direction.up * 15) in G_CRATES) {
                collisions.col_crates.push(cellpos_ - explosion_direction.up * 15);
                break;

            } else if ((cellpos_ - explosion_direction.up * 15) in G_CONCRETE_BLOCKS) {
                explosion_direction.up--;
                break;
            } else if ((cellpos_ - explosion_direction.up * 15) < 0) {
                explosion_direction.up--;
                break;
            } else if ((cellpos_ - explosion_direction.up * 15) in G_BOMBS) {
                if (G_BOMBS[(cellpos_ - explosion_direction.up * 15)].lifetime > 0) {
                    collisions.col_bombs.push(cellpos_ - explosion_direction.up * 15);


                }
                explosion_direction.up--
                    break;
            } else if (explosion_direction.up < range) {
                explosion_direction.up++;
            } else {
                break;
            }

        }

    }


    if (explosion_direction.down) {
        while (true) {
            if ((cellpos_ + explosion_direction.down * 15) in G_CRATES) {
                collisions.col_crates.push(cellpos_ + explosion_direction.down * 15);
                break;

            } else if ((cellpos_ + explosion_direction.down * 15) in G_CONCRETE_BLOCKS) {
                explosion_direction.down--;
                break;
            } else if ((cellpos_ + explosion_direction.down * 15) > 164) {
                explosion_direction.down--;
                break;
            } else if ((cellpos_ + explosion_direction.down * 15) in G_BOMBS) {
                if (G_BOMBS[(cellpos_ + explosion_direction.down * 15)].lifetime > 0) {
                    collisions.col_bombs.push(cellpos_ + explosion_direction.down * 15);


                }

                explosion_direction.down--
                    break;

            } else if (explosion_direction.down < range) {
                explosion_direction.down++;
            } else {
                break;
            }

        }

    }

    // add new explosion
    G_EXPLOSIONS.push(new Explosion(G_GAMECONTEXT, G_BOMBS[cellpos_].owner, G_BOMBS[cellpos_].posX, G_BOMBS[cellpos_].posY, explosion_direction, range));


    for (var i in collisions.col_bombs) {

        bomb_cell = collisions.col_bombs[i];
        G_BOMBS[bomb_cell].lifetime = 0;
        G_BOMBS[bomb_cell].exploded();
        var rec_collisions = handleExplosion(bomb_cell);
        collisions.col_bombs.push.apply(collisions.col_bombs, rec_collisions.col_bombs); // add chain to the current list
        collisions.col_crates.push.apply(collisions.col_crates, rec_collisions.col_crates);

    }
    return collisions;
}


// Add new crate entities
function timedEvents(dt) {
    var p_time = G_TIME;
    var done = 0;
    var sec = 0;
    G_TIME += dt;
    fps_counter++;


    // fps counter
    if(((0|(G_TIME % 2)) == 1 )&& (((p_time % 2)|0) == 0) ||(((0|(G_TIME % 2)) == 0 )&& (((p_time % 2)|0) == 1))){
      G_FPS = fps_counter;
      fps_counter =0;
      sec = 1;
    }

    if(G_ROUND_ENDED>0 ){
      G_START_SUDDEN_DEATH= 0; // stop sudden death when round ended
      G_ROUND_ENDED+=dt;
      if((0|G_ROUND_ENDED)==3){
        reset_globals();
        create_game();
        G_ROUND_ENDED = 0;
      }
    }

    // sudden death
    if(!G_START_SUDDEN_DEATH&&((0|G_TIME)==G_SUDDEN_DEATH_TIME)){
      G_SPRITES.push(new Object(40,40,new Sprite({
          canvas: G_GAMECONTEXT ,
          url: 'levels/sudden_death.png',
          size: [459,90],
          speed: 1,
          once:true,
          frames: [0,1]
      })));
      G_START_SUDDEN_DEATH = 1;
      death_block_starting_side = (0|(Math.random() *4));

      if(death_block_starting_side==1){
        XXX=14;
      }
      else if (death_block_starting_side ==2){
        XXX=14;
        YYY=10;}
      else if (death_block_starting_side ==3){
        YYY=10;
        XXX=0;
      }
      G_SOUNDS["alarm"].play();
   }
  // sec = 1;
    // sudden death
    if(G_START_SUDDEN_DEATH && (sec)){

      var new_cell = XXX +YYY*15;

      nm_of_death_blocks++;
     if(nm_of_death_blocks == (164)){// last block
       G_START_SUDDEN_DEATH = 0;
     }

     if(!(new_cell in G_CONCRETE_DEATH_BLOCKS ||(new_cell in G_CONCRETE_BLOCKS ))){
       var block =(new ConcreteBlock(G_GAMECONTEXT,  XXX * 40 + 2,   YYY * 40 + 2));
        G_CONCRETE_BLOCKS[XXX +YYY*15] = block;
        G_SOUNDS["death_block"].play();

        for(var cellpos in G_PLAYERS){
          if(G_PLAYERS[cellpos].checkDeathBlockCollision(block))
            G_PLAYERS[cellpos].die();
          }
        if( new_cell in G_CRATES){
          delete G_CRATES[new_cell];
        }
        if( new_cell in G_BOMBS){
          G_BOMBS[new_cell].lifetime=0;
        }
      }


      if(death_block_starting_side == 0) {
        ++XXX;
        if((14-XXX)<=death_block_distance)
          done = 1;


      }

      if(death_block_starting_side == 1) {
        ++YYY;
        if((10-YYY)<=death_block_distance)
          done = 1;

      }

      if(death_block_starting_side == 2) {
        --XXX;
        if(XXX<=death_block_distance)
          done = 1;


      }

      if(death_block_starting_side == 3) {
        --YYY;
        if(YYY<=death_block_distance)
          done = 1;

      }


      if(done){
          death_block_starting_side =((++death_block_starting_side)%4);
          ++death_block_side_done_counter;

          if(death_block_side_done_counter%4==0){

            death_block_distance++;


          }

          if(death_block_starting_side==0){
            XXX = death_block_distance;
            YYY = death_block_distance;

          }else if(death_block_starting_side == 1){

            XXX = 14-death_block_distance;
            YYY = death_block_distance;

          }else if(death_block_starting_side == 2){
            XXX =14-death_block_distance;
            YYY =10-death_block_distance;


          }else if(death_block_starting_side == 3){
            XXX =death_block_distance;
            YYY =10-death_block_distance;

          }

          done = 0;

      }

    }


    // WARNING does overflow create an exception behavior??
    if ((0|(G_TIME % 21)) == 20 && ((p_time % 21)|0) == 19) { // every 20 seconds
        var new_cellpos = Math.floor((Math.random() * 165));
        if (!(new_cellpos in G_CRATES) && !(new_cellpos in G_CONCRETE_BLOCKS)) {
            for (var i in G_PLAYERS) {
                if (G_PLAYERS[i].posCELL == new_cellpos)
                  return;
            }
            G_CRATES[new_cellpos] = new Crate(G_GAMECONTEXT, (new_cellpos % 15 * 40), (new_cellpos - new_cellpos % 15) / 15 * 40 );
        }
    }



    // TODO add sudden death after time limit

}

function handleTheDead(){
      var alive = 0;
      var key ;
      // remove dead players from the game. TODO change it so that players stay in the game but become invisible
      for (var cellpos in G_PLAYERS) {
          if (G_PLAYERS[cellpos].dead()) {
            //  delete G_PLAYERS[cellpos];
          }
          else{
            alive++;
            key = cellpos;
          }
      }
      if(!G_ROUND_ENDED && alive == 1){
        G_WINNER = G_PLAYERS[key].costume;
        G_ROUND_ENDED = 1;

      }

      else if(!G_ROUND_ENDED && alive == 0){
        G_WINNER = "nobody";
        G_ROUND_ENDED = 1;
      }

}

// Updating function
function update(dt) {
    handleTheDead();
    handleInput(dt);
    handleCollisions();
    updateEntities(dt);
    timedEvents(dt);

}


function compareDepth(p1, p2){
  if(p1.posY <p2.posY){
    return -1;
  }
  if(p1.posY>p2.posY){
    return 1;
  }
  return 0;
}

// Rendering function
function render() {
    // render in this order
    G_FIELD.render(); // render field
    for (var cellpos in G_EXPLOSIONS) {

        G_EXPLOSIONS[cellpos].render(); // render explosions
    }

    for (var cellpos in G_CONCRETE_BLOCKS) {
        G_CONCRETE_BLOCKS[cellpos].render(); // render concrete blocks
    }

    for (var cellpos in G_BOMBS) {
        G_BOMBS[cellpos].render();  // render bombs
    }

    for (var cellpos in G_CRATES) {
        G_CRATES[cellpos].render(); // render crates
    }

    for(var cellpos in G_DECORATIONS_BACK){
        G_DECORATIONS_BACK[cellpos].render(); // render crates
    }

    G_PLAYERS.sort(compareDepth);
    for (var cellpos in G_PLAYERS){
      G_PLAYERS[cellpos].render(); //render players. WARNING who is higher renders first
    }

    for(var cellpos in G_DECORATIONS_FRONT){
        G_DECORATIONS_FRONT[cellpos].render(); // render crates
    }

    for (var cellpos in G_SPRITES) {
      G_SPRITES[cellpos].render();
    }




}

function create_game(){

  // set canvas size
  var canvas = document.getElementById("gamecanvas");
  canvas.width = 800;
  canvas.height = 600;
  var gamefield_sizex = 604;
  var gamefield_sizey = 444;
  var game_field_offsetx = 170;
  var game_field_offsety = 100;

  // upper
  G_BORDERCONTEXT.push(new Context(canvas,0,0, canvas.width ,canvas.height));


  G_GAMECONTEXT = new Context(canvas,game_field_offsetx,game_field_offsety,gamefield_sizex,gamefield_sizey);

  // Field is 604 x 444 pixels
  G_FIELD = new Field(G_GAMECONTEXT);

  // create blocks. one block is 36 pixels.
  for (var i = 0; i < G_LEVEL_Layout.length; i++) {
      for (var j = 0; j < G_LEVEL_Layout[i].length; j++) {
          // place concrete block according to raster
          if (G_LEVEL_Layout[i][j] == 1) {
             G_CONCRETE_BLOCKS[i * 15 + j] = new ConcreteBlock(G_GAMECONTEXT,  j * 40 + 2,  i * 40 + 2);

          // place crates
        } else if (Math.floor((Math.random() * G_LEVEL_Layout[i][j]) +1) == 3) {
             G_CRATES[i * 15 + j] = new Crate(G_GAMECONTEXT,  j * 40 + 2, i * 40 + 2);
          }
      }
  }

  // spawn player
  if(!G_PLAYER1){
     G_PLAYER1 = new Character(G_GAMECONTEXT, 0, -20, "player1");
     G_PLAYERS[G_PLAYER1.posCELL] = G_PLAYER1;
  }
  G_PLAYER1.bombsplaced=0;
  if(!G_PLAYER2){
    G_PLAYER2 = new Character(G_GAMECONTEXT, 560,380 , "player2");
    G_PLAYERS[G_PLAYER2.posCELL] = G_PLAYER2;
  }

  G_PLAYER2.bombsplaced = 0;

  G_SOUNDS["death_block"] = new Sound("sounds/death_block.mp3");
  G_SOUNDS["alarm"] = new Sound("sounds/alarm.wav");

  for(var i=0;i<15;i++){
    G_DECORATIONS_BACK.push(new Decoration(G_GAMECONTEXT,0+40*i,-35));
    G_DECORATIONS_FRONT.push(new Decoration(G_GAMECONTEXT,0+40*i, 444-34));
  }

}

// init game
function init() {


    create_controls();
    reset_globals();
    create_game();
    gameLoop();  // start game loop

}

function keyHandler(e) {
    var key = e.keyCode;
    if (key in G_Controls) {
        if (e.type == 'keydown') {
            G_Controls[key] = 1
        } else {
            G_Controls[key] = 0
        }
    }
}
