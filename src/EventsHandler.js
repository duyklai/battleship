/**
 * This factory module is reponsible for handling all events of changes to UI.
 * Has two set functions which takes in respective Player object passed from setup.
 * selectShip() function handles player selecting ship on fleet.
 * changeDirection() function handles rotate button clicks.
 * clickToPlace() function handles player placing ships.
 * clickToAttack() function handles player "attacking" enemy board.
 * placementMouseOver() function handles "phantom" ship placement.
 * placementMouseOut() function handles board refresh.
 */
const EventHandler = () => {
  // Variables to keep track of current game status/positions
  let playerOne = null; // Currently not in used due to vs AI
  let playerTwo = null;
  let placingOnGrid = false;
  let startingGame = false;
  let direction = 'horizontal';
  let currentShip = null;
  let shipLength = 0;

  const setPlayerOne = player => {
    playerOne = player;
  };

  const setPlayerTwo = computer => {
    playerTwo = computer;
  };

  // Function returns a function to prevent addEventListener from executing the function right away
  const selectShip = (ship_name, ship_length) => {
    return function() {
      placingOnGrid = true;
      currentShip = ship_name;
      shipLength = ship_length;
    };
  };

  // Function to alternate the rotate direction of ship
  const changeDirection = () => {
    return function() {
      if (direction == 'horizontal') direction = 'vertical';
      else direction = 'horizontal';
    };
  };

  // Function to add class of "selected-ship" to the ship name that the player clicked on when PLACING ships
  const changeSelectShip = () => {
    return function(e) {
      let currentSelectedShip = document.querySelector('.selected-ship');
      if (currentSelectedShip)
        currentSelectedShip.classList.remove('selected-ship');
      // Change the currently selected ship to the event clicked on
      e.target.classList.add('selected-ship');
    };
  };

  // Function to randomly places computer's ship on computer's board
  const compRandomPlace = compBoard => {
    let numOfShipsPlaced = 0; // Currently double as index for ships as well
    let allShipsPlaced = false;
    let shipBoard; // Used to determine of placeShip was successful or not
    // Array of fleet of ships shuffled up for more randomness
    let ships = shuffle([
      'Carrier',
      'Battleship',
      'Destroyer',
      'Submarine',
      'Patrol'
    ]);
    // If not all ships have been placed, keep going
    while (!allShipsPlaced) {
      // Using a private helper which does not return function but just changes the current direction
      if (Math.floor(Math.random() * 10) % 2 == 0) changeSetDirection();
      // Generate x/y coordinates to ship placement
      xPlace = Math.floor(Math.random() * 10);
      yPlace = Math.floor(Math.random() * 10);
      shipBoard = compBoard.placeShip(
        xPlace,
        yPlace,
        ships[numOfShipsPlaced],
        direction
      );
      // If ship was placed succesfully, shipBoard will NOT BE undefined
      if (shipBoard) {
        numOfShipsPlaced++; // Increment total of placed ships
      } else continue;
      // Once all 5 ships have been placed, exit loop
      if (numOfShipsPlaced == 5) {
        direction = 'horizontal';
        allShipsPlaced = true;
      }
    }
  };

  // Function to handle creating and placing the ship visually on UI board
  // Takes in event "e" and the player's board (player_board)
  const clickToPlace = player_board => {
    // Variable e here refers to the "square" DOM that was clicked on
    return function(e) {
      const playerBoard = player_board;
      // Checking if player clicked on a ship on the status bar
      if (placingOnGrid) {
        // Parses both data of x/y coordinates to int of square target
        let x = parseInt(e.target.dataset.coordinateX, 10);
        let y = parseInt(e.target.dataset.coordinateY, 10);

        // Create the ship on "playerBoard" and set return array to shipBoard
        // placeShip() function WILL DO VALIDATION CHECK ON COORDINATES
        // shipBoard is currently an 2D array of all ships placed on board so far
        let shipBoard = playerBoard.placeShip(x, y, currentShip, direction);

        // Checking direction to determine which way to look to mark for ship placement visually
        if (direction == 'vertical') {
          for (let i = x; i < x + shipLength; i++) {
            if (typeof shipBoard[i][y] === 'object') {
              // Find the square node where the x/y coordinates matches with shipBoard array
              let element = document.querySelector(
                `[data-coordinate-x='${i}'][data-coordinate-y='${y}']`
              );
              // Class .selected will make background black
              element.classList.add('selected');
            }
          }
        } else if (direction == 'horizontal') {
          for (let i = y; i < y + shipLength; i++) {
            if (typeof shipBoard[x][i] === 'object') {
              // Find the square node where the x/y coordinates matches with shipBoard array
              let element = document.querySelector(
                `[data-coordinate-x='${x}'][data-coordinate-y='${i}']`
              );
              element.classList.add('selected');
            }
          }
        }

        // Remove ship from fleet after placing
        let ship = document.querySelector(`.${currentShip}`);
        ship.parentNode.removeChild(ship);
        // If all ships have been placed, replace the rotate button with start game button
        let rotate_btn = document.querySelector('.ship-rotate');
        if (rotate_btn.parentNode.childNodes.length == 2) {
          const start_game = document.createElement('button');
          start_game.className = 'start-game';
          start_game.innerHTML = 'Start Game';
          rotate_btn.parentNode.firstChild.innerHTML =
            'You have placed all the ships. Start the game!';
          start_game.addEventListener('click', updateStatusStartGame());

          rotate_btn.parentNode.appendChild(start_game);
          rotate_btn.parentNode.removeChild(rotate_btn);
        }

        // Reset placement conditions to prevent additional adding of ships
        placingOnGrid = false;
        currentShip = null;
        shipLength = 0;
      }
    };
  };

  // Function to handle attacking on enemy board and visual changes to UI board
  // Takes in event "e" and the enemy's board (enemy_board)
  const clickToAttack = enemy_board => {
    // Variable e here refers to the "square" DOM that was clicked on
    return function(e) {
      // Make sure all ships are placed for player and player clicked start game
      if (startingGame) {
        const computerBoard = enemy_board;
        // Initial set as null in the case that the player's attack was on a previously clicked square; will not go through the if/else check below
        let attack = null;
        let x = parseInt(e.target.dataset.coordinateX, 10);
        let y = parseInt(e.target.dataset.coordinateY, 10);
        // Get the x/y coordinates of the square the player clicked on and parse to int. receiveAttack will return how successful the attack was
        if (!computerBoard.checkAttack(x, y)) {
          attack = computerBoard.receiveAttack(x, y);
        }

        // Depending on the successfulness of attack, mark the square accordingly
        // If player clicked on previously attacked square, nothing changes
        if (attack) {
          // If attack hit ship, mark it red
          e.target.style.backgroundColor = 'red';
          // computerPlay will return whether this attack was the game ending or not
          // Change startingGame (game status) accordingly
          startingGame = playerTwo.computerPlay();
        } else if (attack == false) {
          // If attack misses, mark it white
          e.target.style.backgroundColor = 'white';
          startingGame = playerTwo.computerPlay();
        }

        // If all enemy ships have been sunk
        if (computerBoard.sunkenAll()) {
          startingGame = false; // Stop the game
          // Update the status bar to congratulate player
          let ship_div = document.querySelector('.ship-div');
          ship_div.style.height = '380px';
          ship_div.firstChild.innerHTML =
            'You have sunk all of the enemies ship. You won!';
          finalPlayerWinUpdate(computerBoard);
          const restart_game = document.createElement('button');
          restart_game.className = 'restart-game';
          restart_game.innerHTML = 'Restart Game';
          restart_game.onclick = reload();
          ship_div.appendChild(restart_game);
        }
      }
    };
  };

  // Function to update status board of the ships the players have sunk
  const updateSunkShips = compBoard => {
    return function() {
      let ship_div = document.querySelector('.ship-div');
      if (startingGame) {
        sunkShips = compBoard.getSunkShips();

        // Remove all nodes other than "title"
        while (ship_div.childNodes.length > 1) {
          ship_div.removeChild(ship_div.lastChild);
        }

        // As the sunkShips array gets filled up, update the list of sunken ships
        for (let i = 0; i < sunkShips.length; i++) {
          let ship_names = document.createElement('p');
          ship_names.className = sunkShips[i].getName();
          ship_names.innerHTML = sunkShips[i].getName();
          ship_div.appendChild(ship_names);
        }

        // Add small "restart game" button at bottom
        const restart_game = document.createElement('button');
        restart_game.className = 'mini-restart-game';
        restart_game.innerHTML = 'Restart Game';
        restart_game.onclick = reload();
        ship_div.appendChild(restart_game);
      }
    };
  };

  // Function to handle when player has selected a ship from fleet and is deciding where to place the ship
  // Will create a "phantom" ship to indicate where the ship will be place on board
  const placementMouseOver = () => {
    return function(e) {
      var self = e.target;
      // Makes sure that player has selected a ship from fleet
      if (placingOnGrid) {
        // Get the current "moused over" square
        let x = parseInt(self.dataset.coordinateX, 10);
        let y = parseInt(self.dataset.coordinateY, 10);

        // Depending on direction, mark the length of ship as black on row/column
        if (direction == 'horizontal') {
          // Only show the phantom ship if placement is valid (within board size)
          if (y + shipLength <= 10) {
            for (let i = y; i < y + shipLength; i++) {
              let element = document.querySelector(
                `[data-coordinate-x='${x}'][data-coordinate-y='${i}']`
              );
              // Add class .phantom, which marks background as black
              element.classList.add('phantom');
            }
          }
        } else if (direction == 'vertical') {
          // Only show the phantom ship if placement is valid (within board size)
          if (x + shipLength <= 10) {
            for (let i = x; i < x + shipLength; i++) {
              let element = document.querySelector(
                `[data-coordinate-x='${i}'][data-coordinate-y='${y}']`
              );
              element.classList.add('phantom');
            }
          }
        }
      }
    };
  };

  // Function to handle when player moves the cursor around the board and "refreshes" the board
  const placementMouseOut = () => {
    return function() {
      // Makes sure that player has selected a ship from fleet
      if (placingOnGrid) {
        // Select all current nodes with class .phantom and remove them
        let allCurrentPhantom = document.querySelectorAll('.phantom');
        allCurrentPhantom.forEach(node => {
          node.classList.remove('phantom');
        });
      }
    };
  };

  // Private Functions:
  // Helper function to shuffle an array. Returns the shuffled array
  // De-facto unbiased shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle
  const shuffle = array => {
    let m = array.length,
      t,
      i;

    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  };

  const updateStatusStartGame = () => {
    return function() {
      startingGame = true;
      // Adding sunken ships tracker
      let ship_status = document.querySelector('.ship-div');
      ship_status.removeChild(ship_status.lastChild);
      ship_status.firstChild.innerHTML = 'Ships you have destroyed:';

      // Adding a 'restart game' button at the bottom
      const restart_game = document.createElement('button');
      restart_game.className = 'mini-restart-game';
      restart_game.innerHTML = 'Restart Game';
      // Add reload function to button
      restart_game.onclick = reload();
      ship_status.appendChild(restart_game);
    };
  };

  // Helper function to do final update when the player is the one who won
  const finalPlayerWinUpdate = compBoard => {
    let ship_div = document.querySelector('.ship-div');
    let sunkShips = compBoard.getSunkShips();
    // Remove all nodes other than main "title"
    while (ship_div.childNodes.length > 1) {
      ship_div.removeChild(ship_div.lastChild);
    }

    // Fill the status board with all sunken ships and with strike through them
    for (let i = 0; i < sunkShips.length; i++) {
      let ship_names = document.createElement('p');
      ship_names.className = sunkShips[i].getName();
      ship_names.innerHTML = sunkShips[i].getName().strike();
      ship_div.appendChild(ship_names);
    }
  };

  // Helper function to reload page; attached to "restart game" buttons
  const reload = () => {
    return function() {
      document.location.reload();
    };
  };

  // Helper function to change direction without returning a function
  // This is different from changeDirection function above
  const changeSetDirection = () => {
    if (direction == 'horizontal') direction = 'vertical';
    else direction = 'horizontal';
  };

  return {
    setPlayerOne,
    setPlayerTwo,
    selectShip,
    changeDirection,
    changeSelectShip,
    compRandomPlace,
    clickToPlace,
    clickToAttack,
    updateSunkShips,
    placementMouseOver,
    placementMouseOut
  };
};

module.exports = EventHandler;
