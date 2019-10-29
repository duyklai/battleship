const Ship = (input_name, input_length) => {
  const name = input_name;
  const length = input_length;
  const sunk = false;
  const hit_marker = Array(length);
  const getLength = () => {
    return length;
  };
  const hit = x => {
    hit_marker[x] = true;
    return hit_marker;
  };

  const isSunk = () => {
    if (hit_marker.includes(undefined)) return false;
    return true;
  };

  return { hit, isSunk, getLength };
};

module.exports = Ship;
