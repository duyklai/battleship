const Board = require('../src/Gameboard');

describe('testing gameboard', () => {
  let board = null;
  beforeEach(() => {
    board = Board();
  });

  // Serializes to the same string error
  // test.only('Ship placed correctly', () => {
  //   const carrier = Ship(
  //     'Carrier',
  //     5,
  //     { x_coor: 3, y_coor: 3 },
  //     { x_coor: 3, y_coor: 7 }
  //   );
  //   let board = [...Array(10)].map(e => Array(10));
  //   count = 0;
  //   while (count < 5) {
  //     board[3][3 + count] = carrier;
  //     count++;
  //   }
  //   expect(game.placeShip(3, 3, 'Carrier')).toEqual(board);
  // });

  test('Return undefined when placing ship will cause out of bounds for x', () => {
    expect(board.placeShip(7, 2, 'Carrier')).toBeUndefined();
  });

  test('Return undefined when placing y will cause outOfBounds', () => {
    expect(board.placeShip(4, 8, 'Carrier')).toBeUndefined();
  });

  test('Returns true when ship has been hit', () => {
    board.placeShip(2, 2, 'Carrier');
    expect(board.receiveAttack(2, 4)).toBeTruthy();
  });

  test('Returns false when attack misses', () => {
    board.placeShip(2, 2, 'Carrier');
    expect(board.receiveAttack(2, 8)).toBeFalsy();
  });

  test('Returns null when attacking an already attacked spot', () => {
    board.placeShip(2, 2, 'Carrier');
    board.receiveAttack(2, 8);
    expect(board.receiveAttack(2, 8)).toBeNull();
  });
});
