/**
 * Responsible for creating and modifiying DOM of webpage
 * Will be creating both grids for players and "sidebars"
 * **/
const Board = require('../src/Gameboard');
const Ship = require('../src/Ship');

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
  //   let cruiser = Ship('cruiser', 5);
  //   playerBoard.placeShip(1, 1, cruiser);
  //   let battleship = Ship('battleship', 4);
  //   playerBoard.placeShip(2, 2, battleship);
  //   let destroyer = Ship('destroyer', 3);
  //   playerBoard.placeShip(3, 3, destroyer);
  //   let submarine = Ship('submarine', 3);
  //   playerBoard.placeShip(4, 4, submarine);
  //   let patrol = Ship('patrol boat', 2);
  //   const shipBoard = playerBoard.placeShip(5, 5, patrol);
  const shipBoard = playerBoard.placeShip(1, 1, 'Carrier');

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
      if (shipBoard[i][j] === 'x') {
        square.style.backgroundColor = 'black';
      }
      // Adding event listener onclick
      square.addEventListener('click', function(e) {
        e.target.style.backgroundColor = 'white';
        console.log(e.target);
      });
      player_div.appendChild(square);
    }
  }
  return player_div;
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
        //e.target.style.backgroundColor = 'white';
        console.log(e.target);

        if (
          computerBoard.receiveAttack(
            e.target.dataset.coordinateX,
            e.target.dataset.coordinateY
          )
        ) {
          e.target.style.backgroundColor = 'red';
        } else {
          e.target.style.backgroundColor = 'white';
        }

        if (computerBoard.sunkenAll()) {
          console.log('all ships down');
        }
      });
      comp_div.appendChild(square);
    }
  }
  return comp_div;
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
  let playerBoard = setupPlayer();
  let compBoard = setupComputer();

  content_div.appendChild(statusBoard);
  content_div.appendChild(playerBoard);
  content_div.appendChild(compBoard);
  body.prepend(content_div);
  body.prepend(header);

  // START GAME HERE?? REMOVE
}

export default { initialSetup };
