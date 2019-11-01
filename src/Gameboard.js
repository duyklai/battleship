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

  // Function to place the ship
  // Returns shipBoard if ship has been placed successfully
  // Returns false otherwise
  const placeShip = (x, y, Ship_name) => {
    let length = 0;
    for (let ship in ships) {
      if (ship == Ship_name) {
        ship_obj = Ship(
          Ship_name,
          ships[Ship_name],
          { x_coor: x, y_coor: y },
          { x_coor: x, y_coor: y + ships[Ship_name] - 1 }
        );
      }
    }
    // Return error? REMOVE
    if (checkBounds(x, y, ship_obj.getLength())) return;
    while (length < ship_obj.getLength()) {
      shipBoard[x][y + length] = ship_obj;
      length++;
    }
    return shipBoard;
  };

  // Returns true if attack hits ship
  // IMPORTANT: Returns null if spot has been taken
  // Else returns false
  const receiveAttack = (x, y) => {
    if (typeof shipBoard[x][y] === 'object') {
      shipBoard[x][y].hit(x, y);
      if (shipBoard[x][y].isSunk()) {
        numOfShips++;
      }
      hitBoard[x][y] = 'x';
      console.log('hit ship');
      return true;
    } else if (hitBoard[x][y] == 'x') {
      console.log('same mark');
      return null;
    } else if (hitBoard[x][y] == undefined) {
      hitBoard[x][y] = 'x';
      console.log('hit nothing');
      return false;
    }
  };

  // Function returns whether all ships has been sunk
  const sunkenAll = () => {
    // console.log(numOfShips); REMOVE
    return numOfShips === 5 ? true : false;
  };

  // Debug function REMOVE
  const getShipBoard = () => {
    return shipBoard;
  };

  const getHitBoard = () => {
    return hitBoard;
  };

  // Private function
  // Function to check if ship placements are inbound according to length
  const checkBounds = (x, y, length) => {
    if (x + length > 10 || y + length > 10) return true;
    return false;
  };

  // Function to check if attack is has hit the spot before or not
  const checkAttack = (x, y) => {
    if (hitBoard[x][y] == 'x') return true;
    else if (hitBoard[x][y] == undefined) return false;
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
