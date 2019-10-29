const Gameboard = () => {
  // Creates a 10 x 10 "board" (2D array)
  const shipBoard = [...Array(10)].map(e => Array(10));
  const hitBoard = [...Array(10)].map(e => Array(10));
  const numOfShips = 0;

  const placeShip = (x, y, Ship) => {
    let length = 0;
    // Return error?
    if (checkOutofBounds(x, y)) return;
    shipBoard[x][y] = 'x';
    while (length < Ship.getLength()) {
      shipBoard[x][y + length] = 'x';
      length++;
    }
    numOfShips++;
    return shipBoard;
  };

  const receiveAttack = (x, y) => {
    hitBoard[x][y] = 'x';
    if (hitBoard[x][y] === shipBoard[x][y]) return true;
    else return false;
  };

  // Private function
  const checkOutofBounds = (x, y) => {
    if (x + 5 > 10 || y + 5 > 10) return true;
    return false;
  };

  return { placeShip, receiveAttack };
};

module.exports = Gameboard;
