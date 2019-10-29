const Ship = require('../src/Ship');

test('Hit function returning array of ship', () => {
  const cruiser = Ship('Cruiser', 3);
  expect(cruiser.hit(2)).toEqual([undefined, undefined, true]);
});

test('isSunk returns false when ship only been hit once', () => {
  const patrol_boat = Ship('Patrol Boat', 2);
  patrol_boat.hit(1);
  expect(patrol_boat.isSunk()).toBe(false);
});

test('isSunk returns true when ship has been hit the appropriate number of times ', () => {
  const patrol_boat = Ship('Patrol Boat', 2);
  patrol_boat.hit(0);
  patrol_boat.hit(1);
  expect(patrol_boat.isSunk()).toBe(true);
});
