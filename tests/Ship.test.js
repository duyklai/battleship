const Ship = require('../src/Ship');

test('Hit function returning array of objects size of ship', () => {
  const destroyer = Ship(
    'Destroyer',
    3,
    { x_coor: 1, y_coor: 1 },
    { x_coor: 1, y_coor: 3 }
  );
  expect(destroyer.hit(1, 2)).toEqual([
    { x: 1, y: 1, hit: false },
    { x: 1, y: 2, hit: true },
    { x: 1, y: 3, hit: false }
  ]);
});

test('isSunk returns false when ship only been hit once', () => {
  const patrol_boat = Ship(
    'Patrol Boat',
    2,
    { x_coor: 2, y_coor: 2 },
    { x_coor: 2, y_coor: 3 }
  );
  patrol_boat.hit(2, 2);
  expect(patrol_boat.isSunk()).toBe(false);
});

test('isSunk returns true when ship has been hit the appropriate number of times ', () => {
  const patrol_boat = Ship(
    'Patrol Boat',
    2,
    { x_coor: 2, y_coor: 2 },
    { x_coor: 2, y_coor: 3 }
  );
  patrol_boat.hit(2, 2);
  patrol_boat.hit(2, 3);
  expect(patrol_boat.isSunk()).toBe(true);
});
