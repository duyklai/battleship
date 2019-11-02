/**
 * Responsible for creating and modifiying DOM of webpage
 * Will be creating both grids for players and "sidebars"
 * **/
const Board = require('../src/Gameboard');
//const Ship = require('../src/Ship'); REMOVE
const Player = require('../src/Player');

// maybe not remove
let playerOne;
let playerTwo;
// maybe not remove
let placingOnGrid = false;
let startingGame = false;
let direction = 'horizontal';
let currentShip = null;
let ship_length = 0;

// Function to create DOM/UI for status side board
function setupStatusBoard() {
  // Array of all possible ships
  let ships = [
    ['Carrier', 5],
    ['Battleship', 4],
    ['Destroyer', 3],
    ['Submarine', 3],
    ['Patrol', 2]
  ];
  // Container for holding ships to place and start button
  // Maybe for ships destroyed??? REMOVE
  const ship_div = document.createElement('div');
  ship_div.className = 'ship-div';
  let ship_div_title = document.createElement('h2');
  ship_div_title.innerHTML = 'Place your ships';
  ship_div.appendChild(ship_div_title);
  for (let i = 0; i < ships.length; i++) {
    let ship_names = document.createElement('p');
    ship_names.className = ships[i][0];
    ship_names.innerHTML = ships[i][0];
    ship_names.addEventListener('click', function(e) {
      // Allow user to place ship after clicking on ship name
      placingOnGrid = true;
      currentShip = ships[i][0];
      ship_length = ships[i][1];
    });
    ship_div.appendChild(ship_names);
  }
  // Rotate button
  const ship_rotate_button = document.createElement('button');
  ship_rotate_button.className = 'ship-rotate';
  ship_rotate_button.innerHTML = 'Rotate';
  ship_rotate_button.addEventListener('click', function() {
    if (direction == 'horizontal') direction = 'vertical';
    else direction = 'horizontal';
  });
  ship_div.appendChild(ship_rotate_button);

  return ship_div;
}

// Function to create DOM/UI for Player's board
function setupPlayer() {
  // Constant variables used for creating grid
  const GRID_SIZE = 10;
  const GRID_STRING = '1fr ';

  // Container for player's board
  const player_div = document.createElement('div');
  player_div.className = 'player-div';

  // Making the gameboard object for player's board
  let playerBoard = Board();

  // Creating grid for player's board
  player_div.style.gridTemplateRows = GRID_STRING.repeat(GRID_SIZE);
  player_div.style.gridTemplateColumns = GRID_STRING.repeat(GRID_SIZE);
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      // Creating "square" cell for grid
      let square = document.createElement('div');
      square.classList.add('square');
      // Adding coordinates of square as data
      square.dataset.coordinateX = i;
      square.dataset.coordinateY = j;
      // MAYBE REMOVE
      // if (typeof shipBoard[i][j] === 'object') {
      //   square.style.backgroundColor = 'black';
      // }
      // Adding event listener onclick
      square.addEventListener('mouseenter', placementMouseOver, false);
      square.addEventListener('mouseleave', placementMouseOut, false);
      square.addEventListener('click', function(e) {
        if (placingOnGrid) {
          let x = parseInt(e.target.dataset.coordinateX, 10);
          let y = parseInt(e.target.dataset.coordinateY, 10);
          console.log(direction);
          let shipBoard = playerBoard.placeShip(x, y, currentShip, direction);
          if (direction == 'vertical') {
            for (let i = x; i < x + ship_length; i++) {
              if (typeof shipBoard[i][y] === 'object') {
                let element = document.querySelector(
                  `[data-coordinate-x='${i}'][data-coordinate-y='${y}']`
                );
                element.classList.add('selected');
              }
            }
          } else if (direction == 'horizontal') {
            for (let i = y; i < y + ship_length; i++) {
              if (typeof shipBoard[x][i] === 'object') {
                let element = document.querySelector(
                  `[data-coordinate-x='${x}'][data-coordinate-y='${i}']`
                );
                element.classList.add('selected');
              }
            }
          }
          // Remove ship fleet after placing
          let ship = document.querySelector(`.${currentShip}`);
          ship.parentNode.removeChild(ship);
          // If all ships have been placed, replace the rotate button with start
          let rotate_btn = document.querySelector('.ship-rotate');
          if (rotate_btn.parentNode.childNodes.length == 2) {
            const start_game = document.createElement('button');
            start_game.className = 'start-game';
            start_game.innerHTML = 'Start Game';
            start_game.addEventListener('click', function() {
              startingGame = true;
              // Adding sunked ships counter
            });
            rotate_btn.parentNode.appendChild(start_game);
            rotate_btn.parentNode.firstChild.innerHTML =
              'You have placed all the ships. Start the game!';
            rotate_btn.parentNode.removeChild(rotate_btn);
          }
          // Reset placement conditions
          placingOnGrid = false;
          currentShip = null;
          ship_length = 0;
        }
      });
      player_div.appendChild(square);
    }
  }
  return [player_div, playerBoard];
}

// Function to create DOM/UI for Computer's board
function setupComputer() {
  // Constant variables used for creating grid
  const GRID_SIZE = 10;
  const GRID_STRING = '1fr ';

  // Container for computer's board
  // Potentially second player?? REMOVE
  const comp_div = document.createElement('div');
  comp_div.className = 'comp-div';

  // Making the game object for computer's board
  let computerBoard = Board();

  // TEMPORARY SHIP CREATION AND PLACEMENTS
  // REMOVE
  computerBoard.placeShip(1, 1, 'Carrier', direction);
  computerBoard.placeShip(2, 2, 'Battleship', direction);
  computerBoard.placeShip(4, 3, 'Destroyer', direction);
  computerBoard.placeShip(6, 4, 'Submarine', direction);
  const shipBoard = computerBoard.placeShip(7, 3, 'Patrol', direction);

  // Creating grid for computer's board
  comp_div.style.gridTemplateRows = GRID_STRING.repeat(GRID_SIZE);
  comp_div.style.gridTemplateColumns = GRID_STRING.repeat(GRID_SIZE);
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      // Creating "square" cell for grid
      let square = document.createElement('div');
      square.classList.add('square');
      // Adding coordinates of square as data
      square.dataset.coordinateX = i;
      square.dataset.coordinateY = j;
      // Used to light up where ship is
      // REMOVE
      if (typeof shipBoard[i][j] === 'object') {
        square.style.backgroundColor = 'black';
      }
      // Adding event listener onclick
      square.addEventListener('click', function(e) {
        //console.log(e.target);
        if (startingGame) {
          let attack = computerBoard.receiveAttack(
            e.target.dataset.coordinateX,
            e.target.dataset.coordinateY
          );

          if (attack) {
            e.target.style.backgroundColor = 'red';
            startingGame = playerTwo.computerPlay();
          } else if (attack == null) {
          } else {
            startingGame = playerTwo.computerPlay();
            e.target.style.backgroundColor = 'white';
          }

          if (computerBoard.sunkenAll()) {
            startingGame = false;
            // might not need this REMOVE
            placingOnGrid = false;
            let ship_div = document.querySelector('.ship-div');
            ship_div.firstChild.innerHTML =
              'You have sunk all of the enemies ship. You won!';
            ship_div.removeChild(ship_div.lastChild);
          }
        }
      });
      comp_div.appendChild(square);
    }
  }
  return [comp_div, computerBoard];
}

function initialSetup() {
  // Initial / Global variables
  const body = document.querySelector('body');

  // Creating and appending header
  const header = document.createElement('header');
  header.innerHTML = 'Battleship';
  // Prepending towards the end for good structural javascript

  // Most outer div containing all contents
  const content_div = document.createElement('div');
  content_div.className = 'content-div';

  let statusBoard = setupStatusBoard();
  let [playerDiv, playerBoard] = setupPlayer();
  let [compDiv, compBoard] = setupComputer();

  content_div.appendChild(statusBoard);
  content_div.appendChild(playerDiv);
  content_div.appendChild(compDiv);
  body.prepend(content_div);
  body.prepend(header);

  // START GAME HERE?? REMOVE
  startGame(playerBoard, compBoard, playerDiv, compDiv);
}

// Create players for game REMOVE
function startGame(playerBoard, compBoard, playerDiv, compDiv) {
  playerOne = Player('player', compBoard, compDiv);
  playerTwo = Player('computer', playerBoard, playerDiv);
}

function placementMouseOver(e) {
  var self = e.target;
  if (placingOnGrid) {
    let x = parseInt(self.dataset.coordinateX, 10);
    let y = parseInt(self.dataset.coordinateY, 10);
    let el_arr = [];

    if (direction == 'horizontal') {
      if (y + ship_length <= 10) {
        for (let i = y; i < y + ship_length; i++) {
          let element = document.querySelector(
            `[data-coordinate-x='${x}'][data-coordinate-y='${i}']`
          );
          el_arr.push(element);
          element.classList.add('phantom');
        }
      }
    } else {
      if (x + ship_length <= 10) {
        for (let i = x; i < x + ship_length; i++) {
          let element = document.querySelector(
            `[data-coordinate-x='${i}'][data-coordinate-y='${y}']`
          );
          el_arr.push(element);
          element.classList.add('phantom');
        }
      }
    }
  }
}

function placementMouseOut(e) {
  var self = e.target;
  if (placingOnGrid) {
    let x = parseInt(self.dataset.coordinateX, 10);
    let y = parseInt(self.dataset.coordinateY, 10);
    let currentPhantom = document.querySelectorAll('.phantom');
    currentPhantom.forEach(node => {
      node.classList.remove('phantom');
    });
  }
}

export default { initialSetup };
