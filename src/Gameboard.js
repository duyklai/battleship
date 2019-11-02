/**
 * This factory module is responsible for keeping track of two arrays of the "gameboard".
 * One array tracks the ship positions, the other where attacks have been fired.
 * Requires the Ship factory function as "placeShip" function will create the ship objects.
 * placeShip() will assign the object's reference to each of the "square"/coordinates that the ship occupies on shipBoard array
 **/
const Ship = require('../src/Ship');
const Gameboard = () => {
  // Creates a 10 x 10 "board" (2D array)
  const shipBoard = [...Array(10)].map(e => Array(10));
  const hitBoard = [...Array(10)].map(e => Array(10));
  const ships = {
    Carrier: 5,
    Battleship: 4,
    Destroyer: 3,
    Submarine: 3,
    Patrol: 2
  };
  let ship_obj;
  let numOfShips = 0;
  let shipSunk = 0;

  // Function to place the ship
  // Returns shipBoard if ship has been placed successfully
  // Returns false otherwise
  const placeShip = (x, y, Ship_name, direction) => {
    // Firstly check if ship will be inbounds if placed
    if (checkOutOfBounds(x, y, ships[Ship_name], direction)) return;

    let length = 0;
    // Checking to make sure all of the squares the ship will be occupying are empty
    // Will return and break function if some squares are occupied
    while (length < ships[Ship_name]) {
      if (direction == 'horizontal') {
        if (shipBoard[x][y + length] != undefined) {
          return;
        }
      } else if (direction == 'vertical') {
        if (shipBoard[x + length][y] != undefined) {
          return;
        }
      }
      length++;
    }

    // Find the ship name in object ships and create a Ship object using name and length
    // Input start and end coordinates based on parameter "direction"
    for (let ship in ships) {
      if (ship == Ship_name) {
        if (direction == 'horizontal') {
          ship_obj = Ship(
            Ship_name,
            ships[Ship_name],
            { x_coor: x, y_coor: y },
            { x_coor: x, y_coor: y + ships[Ship_name] - 1 }
          );
        } else if (direction == 'vertical') {
          ship_obj = Ship(
            Ship_name,
            ships[Ship_name],
            { x_coor: x, y_coor: y },
            { x_coor: x + ships[Ship_name] - 1, y_coor: y }
          );
        }
      }
    }

    // Reset the length variable for marking spaces of ship on "shipBoard" array
    length = 0;
    // Fill in the shipBoard array according to direction and ship length
    while (length < ship_obj.getLength()) {
      if (direction == 'horizontal') {
        shipBoard[x][y + length] = ship_obj;
        length++;
      } else if (direction == 'vertical') {
        shipBoard[x + length][y] = ship_obj;
        length++;
      }
    }
    numOfShips++;
    return shipBoard;
  };

  // Returns true if attack hits ship
  // IMPORTANT: Returns null if spot has been taken
  // Else returns false
  const receiveAttack = (x, y) => {
    if (hitBoard[x][y] == 'x') {
      console.log('same mark');
      return null;
    } else if (typeof shipBoard[x][y] === 'object') {
      shipBoard[x][y].hit(x, y);
      if (shipBoard[x][y].isSunk()) {
        shipSunk++;
      }
      hitBoard[x][y] = 'x';
      console.log('hit ship');
      return true;
    } else if (hitBoard[x][y] == undefined) {
      hitBoard[x][y] = 'x';
      console.log('hit nothing');
      return false;
    }
  };

  // Function returns whether all ships has been sunk
  const sunkenAll = () => {
    // numOfShips should be 5 in an official game/run
    return shipSunk === numOfShips ? true : false;
  };

  // Function to check if attack is has hit the spot before or not
  // IMPORTANT: checking this in receiveAttack will cause Player.computerPlay() create and attack different coordinates
  const checkAttack = (x, y) => {
    if (hitBoard[x][y] == 'x') return true;
    else if (hitBoard[x][y] == undefined) return false;
  };

  // Debug function REMOVE
  const getShipBoard = () => {
    return shipBoard;
  };

  const getHitBoard = () => {
    return hitBoard;
  };

  // Private function
  // Function to strict check if ship placements are inbound according to length
  const checkOutOfBounds = (x, y, length, direction) => {
    if (direction == 'horizontal') {
      if (y + length > 10) return true;
    } else if (direction == 'vertical') {
      if (x + length > 10) return true;
    }
    return false;
  };

  // REMOVE DEBUG FUNCTIONS
  return {
    placeShip,
    receiveAttack,
    sunkenAll,
    getShipBoard,
    getHitBoard,
    checkAttack
  };
};

module.exports = Gameboard;
