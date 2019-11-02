const Board = require('../src/Gameboard');
const Ship = require('../src/Ship');

describe('Testing placeShip', () => {
  let board = null;
  beforeEach(() => {
    board = Board();
  });

  //Serializes to the same string error
  // test('Ship placed correctly', () => {
  //   const carrier = Ship(
  //     'Carrier',
  //     5,
  //     { x_coor: 3, y_coor: 3 },
  //     { x_coor: 3, y_coor: 7 }
  //   );
  //   let created_board = [...Array(10)].map(e => Array(10));
  //   count = 0;
  //   while (count < 5) {
  //     created_board[3][3 + count] = carrier;
  //     count++;
  //   }
  //   // console.log(board.placeShip(3, 3, 'Carrier', 'horizontal'));
  //   // console.log(created_board);
  //   expect(board.placeShip(3, 3, 'Carrier', 'horizontal')).yourMatcher(
  //     created_board
  //   );
  // });

  test('Return undefined when placing ship will cause out of bounds for x', () => {
    expect(board.placeShip(7, 2, 'Carrier', 'vertical')).toBeUndefined();
  });

  test('Return undefined when placing y will cause outOfBounds', () => {
    expect(board.placeShip(4, 8, 'Carrier', 'horizontal')).toBeUndefined();
  });
});

describe('Testing receiveAttack', () => {
  let board = null;
  beforeEach(() => {
    board = Board();
  });

  test('Returns true when ship has been hit', () => {
    board.placeShip(2, 2, 'Carrier', 'horizontal');
    expect(board.receiveAttack(2, 4)).toBeTruthy();
  });

  test('Returns false when attack misses', () => {
    board.placeShip(2, 2, 'Carrier', 'vertical');
    expect(board.receiveAttack(2, 8)).toBeFalsy();
  });

  test('Returns null when attacking an already attacked spot', () => {
    board.placeShip(2, 2, 'Carrier', 'vertical');
    board.receiveAttack(2, 8);
    expect(board.receiveAttack(2, 8)).toBeNull();
  });

  test('Returns null when attacking an already attacked ship spot', () => {
    board.placeShip(2, 2, 'Carrier', 'horizontal');
    board.receiveAttack(2, 3);
    expect(board.receiveAttack(2, 3)).toBeNull();
  });
});

describe('Testing sunkenAll', () => {
  let board = null;
  beforeEach(() => {
    board = Board();
  });

  test('Returns true when all ships(1) has been sunk', () => {
    board.placeShip(2, 2, 'Patrol', 'horizontal');
    board.receiveAttack(2, 2);
    board.receiveAttack(2, 3);
    expect(board.sunkenAll()).toBeTruthy();
  });

  test('Returns false when only 1 ship (out of 2) has been sunk', () => {
    board.placeShip(2, 2, 'Patrol', 'horizontal');
    board.placeShip(4, 4, 'Submarine', 'horizontal');
    board.receiveAttack(2, 2);
    board.receiveAttack(2, 3);
    expect(board.sunkenAll()).toBeFalsy();
  });
});
