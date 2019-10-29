const Board = require('../src/Gameboard');
const Ship = require('../src/Ship');

describe('testing gameboard', () => {
  let game = null;
  beforeEach(() => {
    game = Board();
  });

  test('Ship placed correctly', () => {
    const carrier = Ship('Carrier', 5);
    let board = [...Array(10)].map(e => Array(10));
    count = 0;
    while (count < 5) {
      board[3][3 + count] = 'x';
      count++;
    }
    expect(game.placeShip(3, 3, carrier)).toStrictEqual(board);
  });

  test('Return undefined when placing x will cause outOfBounds', () => {
    const carrier = Ship('Carrier', 5);
    expect(game.placeShip(7, 2, carrier)).toBeUndefined();
  });

  test('Return undefined when placing y will cause outOfBounds', () => {
    const carrier = Ship('Carrier', 5);
    expect(game.placeShip(4, 8, carrier)).toBeUndefined();
  });

  test('Returns true when ship has been hit', () => {
    const carrier = Ship('Carrier', 5);
    game.placeShip(2, 2, carrier);
    expect(game.receiveAttack(2, 4)).toBeTruthy();
  });

  test('Returns false when attack misses', () => {
    const carrier = Ship('Carrier', 5);
    game.placeShip(2, 2, carrier);
    expect(game.receiveAttack(2, 8)).toBeFalsy();
  });
});
