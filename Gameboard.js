/**
 * This factory module is responsible for keeping track of two arrays of the "gameboard".
 * One array tracks the ship positions, the other where attacks have been fired.
 * Requires the Ship factory function as "placeShip" function will create the ship objects.
 * placeShip() will assign the object's reference to each of the "square"/coordinates that the ship occupies on shipBoard array
 **/
const Ship = require('../src/Ship');
const Gameboard = () => {
  // Creates a 10 x 10 "board" (2D array) to hold positions of ships
  const shipBoard = [...Array(10)].map(e => Array(10));
  // Creates a 10 x 10 "board" (2D array) to hold positions attacks for player
  const hitBoard = [...Array(10)].map(e => Array(10));
  // Object to all possible ships and length used for Ship object creation
  const ships = {
    Carrier: 5,
    Battleship: 4,
    Destroyer: 3,
    Submarine: 3,
    Patrol: 2
  };
  let ship_obj; // Used later for Ship object creation
  let sunkShips = []; // Array of all the sunk ships
  let numOfShips = 0; // numOfShips will be incremented as ship_obj gets created
  let shipSunk = 0; // shipSunk will be incremented as ships are being sunk

  // Function to place the ship
  // Returns shipBoard: if ship has been placed successfully
  // Returns undefined: otherwise
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

  // Function to check if coordinates of attack has been hit before or not
  // Returns true: if attack on x/y coordinates HAD BEEN attacked before
  // Returns false: if attack on x/y coordinates HAS NOT BEEN attacked before
  const checkAttack = (x, y) => {
    if (hitBoard[x][y] == 'x') return true;
    else if (hitBoard[x][y] == undefined) return false;
  };

  // Function to take in sanitized/checked coordinates to check if attack hit ship or hit an empty space
  // Returns true: if attack hits ship
  // Returns false: otherwise
  const receiveAttack = (x, y) => {
    if (typeof shipBoard[x][y] === 'object') {
      shipBoard[x][y].hit(x, y);
      if (shipBoard[x][y].isSunk()) {
        sunkShips.push(shipBoard[x][y]);
        shipSunk++;
      }
      hitBoard[x][y] = 'x';
      return true;
    } else if (hitBoard[x][y] == undefined) {
      hitBoard[x][y] = 'x';
      return false;
    }
  };

  // Function to return the array of ship that have sunk so far
  // Used in EventHandlers
  const getSunkShips = () => {
    return sunkShips;
  };

  // Function returns whether all ships has been sunk
  // Returns true: when all ships sunk
  // Returns false: otherwise
  const sunkenAll = () => {
    // numOfShips should be 5 in an official game/run
    return shipSunk === numOfShips ? true : false;
  };

  // Private functions:
  // Function to strict check if ship placements are inbound according to length
  // Returns true: if x or y are in bounds respective to direction
  // Returns false: otherwise
  const checkOutOfBounds = (x, y, length, direction) => {
    if (direction == 'horizontal') {
      if (y + length > 10) return true;
    } else if (direction == 'vertical') {
      if (x + length > 10) return true;
    }
    return false;
  };

  return { placeShip, checkAttack, receiveAttack, getSunkShips, sunkenAll };
};

module.exports = Gameboard;
