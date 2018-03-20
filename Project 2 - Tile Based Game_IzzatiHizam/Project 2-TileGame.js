TweenLite.from("#harry", 2,
   {
       opacity: 0,
       rotation: 180,
       left: 600,
       delay: 1
   });
   TweenLite.from("#header", 2.5,
   {
       ease: Circ.easeOut,
       x: 500
   });
   TweenLite.from("#harryintro", 2.5,
   {
       opacity: 0,
       rotation: 180,
       right: 500,
       delay: 1.5
   });

   var startBtn = $("#start")


   startBtn.click(startGameHandler);

   //Get a reference to the gameScreen and output
   var gameScreen = document.querySelector("#gameScreen");
   var output = $("#output");

   // Initialize objects on the screen
   $(function()
   {
       render();
   });

   //Add a keyboard listener
   $(window).keydown(keydownHandler);

   function startGameHandler()
   {
       // Hide the intro screen, show the game screen
       introScreen.style.display = "none";
       gameScreen.style.display = "block";
   }

   //using object literals
   var board = {
       map: [
           [0, 0, 0, 0, 0, 2, 0, 3],
           [1, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 1, 0, 0, 0],
           [0, 2, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 2, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 1, 0, 0],
           [0, 0, 0, 0, 0, 0, 2, 0],
           [0, 0, 0, 0, 0, 0, 0, 0]
       ],

       gameObjects: [
           [0, 0, 0, 5, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0],
           [4, 0, 0, 0, 0, 0, 0, 0]
       ],

       renderBoard: function()
       {
           //Render the game by looping through the map arrays
           for (var row = 0; row < ROWS; row++)
           {
               for (var column = 0; column < COLUMNS; column++)
               {
                   //Create a div HTML element called cell
                   var cell = document.createElement("img");

                   //Set its CSS class to "cell"
                   cell.setAttribute("class", "cell");

                   //Add the div HTML element to the gameScreen
                   gameScreen.appendChild(cell);


                   //Find the correct image for this map cell
                   switch (this.map[row][column])
                   {

                       case SPACESHIP:
                           cell.src = "images/spaceship-icon.png";
                           break;
                       case ALIEN:
                           cell.src = "images/Alien-scared-icon.png";
                           break;
                       case MOON:
                           cell.src = "images/Rocket-Moon-icon.png";
                           break;
                   }


                   //Add the ship from the gameObjects array
                   switch (this.gameObjects[row][column])
                   {
                       case HARRY:
                           cell.src = "images/astronaut-icon.png";
                           break;

                       case MONSTER:
                           cell.src = "images/Monsters-3-icon.png";
                           break;
                   }


                   //Position the cell in the correct place
                   //with 10 pixels of space around it
                   cell.style.top = row * (SIZE) + "px";
                   cell.style.left = column * (SIZE) + "px";
               }
           }

       }



   }

   var harry = {
       food: 10,
       gold: 10,
       experience: 0,
       row: null,
       column: null,

       trade: function()
       {
           //Figure out how much food the spaceship has and how much it should cost
           var spaceShipFood = this.experience + this.gold;
           var cost = Math.ceil(Math.random() * spaceShipFood);

           //Let the player buy food if there's enough gold to afford it
           if (this.gold > cost)
           {
               this.food += spaceShipFood;
               this.gold -= cost;
               this.experience += 2;

               return "You buy " + spaceShipFood + " biscuits "; +
               " for " + cost + " gold pieces."
           }
           else
           {
               //Tell the player if he or she does not have enough gold
               this.experience += 1;
               return "You don't have enough gold to buy food."
           }
       },

       fight: function()
       {
           //The Harry's strength
           var harryStrength = Math.ceil((this.food + this.gold) / 2);

           //A random number between 1 and the Harry's strength
           var alienStrength = Math.ceil(Math.random() * harryStrength * 2);

           //Find out if the aliens are stronger than Harry
           if (alienStrength > harryStrength)
           {
               //The alien ransack the ship
               var stolenGold = Math.round(alienStrength / 2);
               this.gold -= stolenGold;

               //Give the player some experience for trying
               this.experience += 1;

               //Update the game message
               return "You fight and LOSE " + stolenGold + " gold pieces." +
                   " Alien's strength: " + alienStrength +
                   " Harry's strength: " + harryStrength;
           }
           else
           {
               //The player wins the aliens' gold
               var alienGold = Math.round(alienStrength / 2);
               this.gold += alienGold;

               //Add some experience
               this.experience += 2;

               //Update the game message
               return "You fight and WIN " + alienGold + " gold pieces." +
                   " Harry's strength: " + harryStrength +
                   " Alien's strength: " + alienStrength;
           }
       }
   };

   var monster = {
       row: null,
       column: null,

       move: function()
       {
           //The 4 possible directions that the monster can move
           let UP = 1;
           let DOWN = 2;
           let LEFT = 3;
           let RIGHT = 4;

           //An array to store the valid direction that
           //the monster is allowed to move in
           var validDirections = [];

           //The final direction that the monster will move in
           var direction = undefined;

           //Find out what kinds of things are in the cells 
           //that surround the monster. If the cells contain water,
           //push the corresponding direction into the validDirections array
           if (this.row > 0)
           {
               var thingAbove = board.map[this.row - 1][this.column];
               if (thingAbove === SPACE)
               {
                   validDirections.push(UP)
               }
           }
           if (this.row < ROWS - 1)
           {
               var thingBelow = board.map[this.row + 1][this.column];
               if (thingBelow === SPACE)
               {
                   validDirections.push(DOWN)
               }
           }
           if (this.column > 0)
           {
               var thingToTheLeft = board.map[this.row][this.column - 1];
               if (thingToTheLeft === SPACE)
               {
                   validDirections.push(LEFT)
               }
           }
           if (this.column < COLUMNS - 1)
           {
               var thingToTheRight = board.map[this.row][this.column + 1];
               if (thingToTheRight === SPACE)
               {
                   validDirections.push(RIGHT)
               }
           }

           //The validDirections array now contains 0 to 4 directions that the 
           //contain WATER cells. Which of those directions will the monster
           //choose to move in?

           //If a valid direction was found, Randomly choose one of the 
           //possible directions and assign it to the direction variable
           if (validDirections.length !== 0)
           {
               var randomNumber = Math.floor(Math.random() * validDirections.length);
               direction = validDirections[randomNumber];
           }

           //Move the monster in the chosen direction
           switch (direction)
           {
               case UP:
                   //Clear the monster's current cell
                   board.gameObjects[this.row][this.column] = 0;
                   //Subtract 1 from the monster's row
                   this.row--;
                   //Apply the monster's new updated position to the array
                   board.gameObjects[this.row][this.column] = MONSTER;
                   break;

               case DOWN:
                   board.gameObjects[this.row][this.column] = 0;
                   this.row++;
                   board.gameObjects[this.row][this.column] = MONSTER;
                   break;

               case LEFT:
                   board.gameObjects[this.row][this.column] = 0;
                   this.column--;
                   board.gameObjects[this.row][this.column] = MONSTER;
                   break;

               case RIGHT:
                   board.gameObjects[this.row][this.column] = 0;
                   this.column++;
                   board.gameObjects[this.row][this.column] = MONSTER;
           }
       }

   };
   //map code
   const SPACE = 0;
   const SPACESHIP = 1;
   const ALIEN = 2;
   const MOON = 3;
   const HARRY = 4;
   const MONSTER = 5;

   //The size of each cell
   const SIZE = 68;

   //Arrow key codes
   const UP = 38;
   const DOWN = 40;
   const RIGHT = 39;
   const LEFT = 37;

   //Display the array
   var ROWS = board.map.length;
   var COLUMNS = board.map[0].length;


   //The game variables

   var gameMessage = "Use the arrow keys to get Harry to the moon.";
   var audio;

   function keydownHandler(event)
   {
       switch (event.keyCode)
       {
           case UP:

               //Find out if the ship's move will
               //be within the playing field
               if (harry.row > 0)
               {
                   //If it is, clear the ship's current cell
                   board.gameObjects[harry.row][harry.column] = 0;

                   //Subract 1 from the ship's row
                   //to move it up one row on the map
                   harry.row--;

                   //Apply the ship's new updated position to the array
                   board.gameObjects[harry.row][harry.column] = HARRY;
               }
               break;

           case DOWN:
               if (harry.row < ROWS - 1)
               {
                   board.gameObjects[harry.row][harry.column] = 0;
                   harry.row++;
                   board.gameObjects[harry.row][harry.column] = HARRY;
               }
               break;

           case LEFT:
               if (harry.column > 0)
               {
                   board.gameObjects[harry.row][harry.column] = 0;
                   harry.column--;
                   board.gameObjects[harry.row][harry.column] = HARRY;
               }
               break;

           case RIGHT:
               if (harry.column < COLUMNS - 1)
               {
                   board.gameObjects[harry.row][harry.column] = 0;
                   harry.column++;
                   board.gameObjects[harry.row][harry.column] = HARRY;
               }
               break;
       }

       //find out what kind of cell Harry is on
       switch (board.map[harry.row][harry.column])
       {
           case SPACESHIP:
               gameMessage = harry.trade();
               break;

           case ALIEN:
               gameMessage = harry.fight();
               break;

           case MOON:
               endGame();
               break;
       }

       //Move the monster
       monster.move();

       //Find out if the ship is touching the monster
       if (board.gameObjects[harry.row][harry.column] === MONSTER)
       {
           endGame();
       }
       //Subtract some food each turn
       harry.food--;

       //Find out if the ship has run out of food or gold
       if (harry.food <= 0 || harry.gold <= 0)
       {
           endGame();
       }

       //Render the game
       render();
   }

   function endGame()
   {
       if (board.map[harry.row][harry.column] === MOON)
       {
           //Calculate the score
           var score = harry.food + harry.gold + harry.experience;

           //Display the game message
           gameMessage
               = "Harry made it to the Moon for his 10th birthday celebrations!! " + "<br>Final Score: " + score;
           //jQuery audio sound
           $('audio#pop')[0].play();

           $("#header").html("Harry has Safely Landed on the Moon.....!");
       }
       else if (board.gameObjects[harry.row][harry.column] === MONSTER)
       {
           gameMessage
               = "Harry has been swallowed by a space monster!";
           //jQuery audio sound
           $('audio#end')[0].play();
           $("#header").html("GAME OVER");

       }
       else
       {
           //Display the game message if the player has run out of gold or food
           if (harry.gold <= 0)
           {
               gameMessage += " Harry's run out of gold!";
           }
           else
           {
               gameMessage += " Harry's run out of food!";
           }

           gameMessage
               += " Harry's falls back to earth!";
           //jQuery audio sound
           $('audio#end')[0].play();
           $("#header").html("GAME OVER");

       }

       //Remove the keyboard listener to end the game
       $(window).off("keydown");
       $("#gameScreen").fadeOut(3000);
   }

   //looping to figure out where Harry us in gameObjects Array
   for (var row = 0; row < ROWS; row++)
   {
       for (var column = 0; column < COLUMNS; column++)
       {
           if (board.gameObjects[row][column] === HARRY)
           {
               harry.row = row;
               harry.column = column;
           }

           if (board.gameObjects[row][column] === MONSTER)
           {
               monster.row = row;
               monster.column = column;
           }
       }
   }

   function render()
   {

       //Clear the stage of img tag cells
       //from the previous turn

       if (gameScreen.hasChildNodes())
       {
           for (var i = 0; i < ROWS * COLUMNS; i++)
           {
               gameScreen.removeChild(gameScreen.firstChild);
           }
       }

       board.renderBoard();

       //Display the game message
       output.html(`${gameMessage}<br>Gold: ${harry.gold}, Food: ${harry.food}, Experience: ${harry.experience}`);

   }