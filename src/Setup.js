/**
 * Responsible for initial create and attaching handlers to DOM of webpage
 * Will be creating both grids for players and "sidebars"
 * **/
const Board = require('../src/Gameboard');
const Player = require('../src/Player');
const Handler = require('../src/EventsHandler');

let handler = Handler();

// Function to create DOM/UI for status side board
function setupStatusBoard() {
  // Array of all possible ships and associated length
  let ships = [
    ['Carrier', 5],
    ['Battleship', 4],
    ['Destroyer', 3],
    ['Submarine', 3],
    ['Patrol', 2]
  ];
  // Container for holding ships fleet, start game, enemy ships sunk, and refresh/restart
  const ship_div = document.createElement('div');
  ship_div.className = 'ship-div';
  let ship_div_title = document.createElement('h2');
  ship_div_title.innerHTML = 'Place your ships:';
  ship_div.appendChild(ship_div_title);
  // "Printing" out the fleet of available ships
  for (let i = 0; i < ships.length; i++) {
    let ship_names = document.createElement('p');
    ship_names.className = ships[i][0];
    ship_names.innerHTML = ships[i][0];

    // Change the currently selected ship to the one the player clicked on
    ship_names.addEventListener(
      'click',
      handler.selectShip(ships[i][0], ships[i][1])
    );
    // Outline the currently selected ship
    ship_names.addEventListener('click', handler.changeSelectShip(), false);
    ship_div.appendChild(ship_names);
  }
  // Add rotate button
  const ship_rotate_button = document.createElement('button');
  ship_rotate_button.className = 'ship-rotate';
  ship_rotate_button.innerHTML = 'Rotate';
  ship_rotate_button.addEventListener('click', handler.changeDirection());
  ship_div.appendChild(ship_rotate_button);

  return ship_div;
}

// Function to create DOM/UI for Player's board
function setupPlayer() {
  // Constant variables used for creating grid
  const GRID_SIZE = 10;
  const GRID_STRING = '1fr ';

  // Container for player's side
  const player_div = document.createElement('div');
  player_div.className = 'player-div';
  const player_fleet = document.createElement('h2');
  player_fleet.className = 'fleet';
  player_fleet.innerHTML = 'Your Fleet';
  player_div.appendChild(player_fleet);

  // Container for player's board
  const player_grid = document.createElement('div');
  player_grid.className = 'player-grid';

  // Making the gameboard object for player's board
  let playerBoard = Board();

  // Creating grid for player's board
  player_grid.style.gridTemplateRows = GRID_STRING.repeat(GRID_SIZE);
  player_grid.style.gridTemplateColumns = GRID_STRING.repeat(GRID_SIZE);
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      // Creating "square" cell for grid
      let square = document.createElement('div');
      square.classList.add('square');
      // Adding coordinates of square as data
      square.dataset.coordinateX = i;
      square.dataset.coordinateY = j;

      // Adding listeners to help player place ship once selected
      square.addEventListener(
        'mouseenter',
        handler.placementMouseOver(),
        false
      );
      square.addEventListener('mouseleave', handler.placementMouseOut());
      // Adding listeners once the player decides to place the ship
      square.addEventListener(
        'click',
        handler.clickToPlace(playerBoard),
        false
      );
      player_grid.appendChild(square);
    }
  }

  player_div.appendChild(player_grid);
  return [player_div, player_grid, playerBoard];
}

// Function to create DOM/UI for Computer's board
function setupComputer() {
  // Constant variables used for creating grid
  const GRID_SIZE = 10;
  const GRID_STRING = '1fr ';

  // Container for computer's board
  // FUTURE TODO: add functionality for second player
  const comp_div = document.createElement('div');
  comp_div.className = 'comp-div';
  const comp_fleet = document.createElement('h2');
  comp_fleet.className = 'fleet';
  comp_fleet.innerHTML = 'Enemy Fleet';
  comp_div.appendChild(comp_fleet);

  // Container for player's board
  const comp_grid = document.createElement('div');
  comp_grid.className = 'comp-grid';

  // Making the game object for computer's board
  let computerBoard = Board();
  // Handles the random placements of ships for the computer's board
  handler.compRandomPlace(computerBoard);

  // Creating grid for computer's board
  comp_grid.style.gridTemplateRows = GRID_STRING.repeat(GRID_SIZE);
  comp_grid.style.gridTemplateColumns = GRID_STRING.repeat(GRID_SIZE);
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      // Creating "square" cell for grid
      let square = document.createElement('div');
      square.classList.add('square');
      // Adding coordinates of square as data
      square.dataset.coordinateX = i;
      square.dataset.coordinateY = j;
      // Adding Adding listeners on squares to collect player's attack location
      square.addEventListener(
        'click',
        handler.clickToAttack(computerBoard),
        false
      );
      square.addEventListener('click', handler.updateSunkShips(computerBoard));
      comp_grid.appendChild(square);
    }
  }
  comp_div.appendChild(comp_grid);
  return [comp_div, comp_grid, computerBoard];
}

// Function to create DOM and text for instructions on how to play the game
function createInstruction() {
  const instruction_div = document.createElement('div');
  instruction_div.className = 'instruction-div';

  let instruction_title = document.createElement('h2');
  instruction_title.className = 'instruction-title';
  instruction_title.innerHTML = 'How to play:';
  instruction_div.appendChild(instruction_title);

  let instruction_list = document.createElement('ul');
  let instruction = document.createElement('li');
  instruction.innerHTML = 'Select a ship on the left';
  instruction_list.appendChild(instruction);
  instruction = document.createElement('li');
  instruction.innerHTML =
    'Place it on your board without going outside of board OR overlapping with other ships';
  instruction_list.appendChild(instruction);
  instruction = document.createElement('li');
  instruction.innerHTML = 'Click "Start Game" when ready';
  instruction_list.appendChild(instruction);
  instruction = document.createElement('li');
  instruction.innerHTML =
    "Take guess at squares of the enemy's board to destroy all five enemy ships";
  instruction_list.appendChild(instruction);
  instruction = document.createElement('li');
  instruction.innerHTML = "First player to destroy all 5 of the enemy's ship";
  instruction_div.appendChild(instruction_list);

  return instruction_div;
}

function initialSetup() {
  // Initial / Global variables
  const body = document.querySelector('body');

  // Creating and appending header
  const header = document.createElement('header');
  header.innerHTML = 'Battleship';
  // Prepending towards the end for good structural javascript

  const instruction_div = createInstruction();

  // Most outer div containing all contents
  const content_div = document.createElement('div');
  content_div.className = 'content-div';

  // setupStatusBoard() returns div element associated to status board
  let statusBoard = setupStatusBoard();
  // setupPlayer/setupComputer returns [div grid of player/comp, board of player/comp]
  let [playerDiv, playerGrid, playerBoard] = setupPlayer();
  let [compDiv, compGrid, compBoard] = setupComputer();

  content_div.appendChild(statusBoard);
  content_div.appendChild(playerDiv);
  content_div.appendChild(compDiv);
  body.prepend(content_div);
  body.prepend(instruction_div);
  body.prepend(header);

  // Setups up player objects and pass it to EventsHandler
  handler.setPlayerOne(Player('player', compBoard, compGrid));
  handler.setPlayerTwo(Player('computer', playerBoard, playerGrid));
}

export default { initialSetup };
