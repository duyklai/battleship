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
// REMOVE
let placingOnGrid = false;

// Function to create DOM/UI for status side board
function setupStatusBoard() {
  // Array of all possible ships
  let ships = [
    'Carrier',
    'Battleship',
    'Destroyer',
    'Submarine',
    'Patrol Boat'
  ];
  // Container for holding ships to place and start button
  // Maybe for ships destroyed??? REMOVE
  const ship_div = document.createElement('div');
  ship_div.className = 'ship-div';
  let ship_div_title = document.createElement('h2');
  ship_div_title.innerHTML = 'Place your ships';
  ship_div.appendChild(ship_div_title);
  for (let ship of ships) {
    let ship_names = document.createElement('p');
    ship_names.className = 'ships';
    ship_names.innerHTML = ship;
    ship_names.addEventListener('click', function(e) {
      // Allow user to place ship after clicking on ship name
      placingOnGrid = true;
    });
    ship_div.appendChild(ship_names);
  }

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

  // TEMPORARY SHIP CREATION AND PLACEMENTS
  // REMOVE
  playerBoard.placeShip(1, 1, 'Carrier');
  playerBoard.placeShip(2, 2, 'Battleship');
  playerBoard.placeShip(4, 3, 'Destroyer');
  playerBoard.placeShip(6, 4, 'Submarine');
  const shipBoard = playerBoard.placeShip(7, 3, 'Patrol');

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
      if (typeof shipBoard[i][j] === 'object') {
        square.style.backgroundColor = 'black';
      }
      // Adding event listener onclick
      square.addEventListener('mouseenter', placementMouseOver, false);
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
  computerBoard.placeShip(1, 1, 'Carrier');
  computerBoard.placeShip(2, 2, 'Battleship');
  computerBoard.placeShip(4, 3, 'Destroyer');
  computerBoard.placeShip(6, 4, 'Submarine');
  const shipBoard = computerBoard.placeShip(7, 3, 'Patrol');

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
        let attack = computerBoard.receiveAttack(
          e.target.dataset.coordinateX,
          e.target.dataset.coordinateY
        );

        if (attack) {
          e.target.style.backgroundColor = 'red';
          playerTwo.computerPlay();
        } else if (attack == null) {
        } else {
          playerTwo.computerPlay();
          e.target.style.backgroundColor = 'white';
        }

        // REMOVE
        if (computerBoard.sunkenAll()) {
          console.log('all ships down');
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
  console.log(self);
  if (placingOnGrid) console.log('placing ship');
}

export default { initialSetup };
