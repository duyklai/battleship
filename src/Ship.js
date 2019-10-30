const Ship = (input_name, input_length, input_start, input_end) => {
  const name = input_name;
  const length = input_length;
  let sunk = false;
  // hit_marker will be an array of objects keeping track of the ship's x/y coordinates
  let hit_marker = [];

  // Once the ship object has been created, fill in the x/y coordinates that this object occupied
  if (input_start.y_coor == input_end.y_coor) {
    for (let i = input_start.x_coor; i <= input_end.x_coor; i++) {
      hit_marker.push({ x: i, y: input_start.y_coor, hit: false });
    }
  } else {
    for (let i = input_start.y_coor; i <= input_end.y_coor; i++) {
      hit_marker.push({ x: input_start.x_coor, y: i, hit: false });
    }
  }

  // Function to return the length of ship
  // Length will be set when ship object gets created
  const getLength = () => {
    return length;
  };

  // Function to mark that the ship was hit according to ship's length
  const hit = (input_x, input_y) => {
    let index = hit_marker.indexOf(
      hit_marker.find(pos => pos.x == input_x && pos.y == input_y)
    );
    hit_marker[index].hit = true;
    return hit_marker;
  };

  // Function to return if ship is fully damaged (sunk) or not
  const isSunk = () => {
    if (hit_marker.every(pos => pos.hit == true)) {
      console.log('we did it');
      sunk = true;
    }
    return sunk;
  };

  return { hit, isSunk, getLength };
};

module.exports = Ship;
