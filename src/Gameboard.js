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
    // Return error?
    if (checkBounds(x, y, ship_obj.getLength())) return;
    while (length < ship_obj.getLength()) {
      shipBoard[x][y + length] = ship_obj;
      length++;
    }
    console.log(shipBoard);
    //numOfShips++; REMOVE
    return shipBoard;
  };

  const receiveAttack = (x, y) => {
    hitBoard[x][y] = 'x';
    //if (hitBoard[x][y] === shipBoard[x][y]) { REMOVE
    if (typeof shipBoard[x][y] === 'object') {
      shipBoard[x][y].hit(x, y);
      if (shipBoard[x][y].isSunk()) {
        numOfShips++;
      }
      return true;
    } else return false;
  };

  // Function returns whether all ships has been sunk
  const sunkenAll = () => {
    console.log(numOfShips);
    return numOfShips === 5 ? true : false;
  };

  // Private function
  const checkBounds = (x, y, length) => {
    if (x + length > 10 || y + length > 10) return true;
    return false;
  };

  return { placeShip, receiveAttack, sunkenAll };
};

module.exports = Gameboard;
