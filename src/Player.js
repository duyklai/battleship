const Player = (input_name, enemy_board, enemy_div) => {
  const name = input_name;
  const enemyBoard = enemy_board;
  const enemyDiv = enemy_div;

  const playerPlay = e => {
    // Player takes turn
  };

  // Function to run the computer's play
  const computerPlay = () => {
    // Computer takes turn
    let index = 0;

    // These x/y coordinates has been sanitized and checked for validity
    [x_coor, y_coor] = getRandCoord();
    enemyBoard.receiveAttack(x_coor, y_coor);

    enemyDiv.childNodes.forEach(node => {
      if (
        node.dataset.coordinateX == x_coor &&
        node.dataset.coordinateY == y_coor
      ) {
        if (typeof enemyBoard.getShipBoard()[x_coor][y_coor] === 'object') {
          enemyDiv.childNodes[index].style.backgroundColor = 'red';
        } else enemyDiv.childNodes[index].style.backgroundColor = 'white';
      }
      index++;
    });
  };

  // Private function
  const getRandCoord = () => {
    x_play = Math.floor(Math.random() * 10);
    y_play = Math.floor(Math.random() * 10);
    // Check to make sure coordinates had not been marked
    while (enemyBoard.checkAttack(x_play, y_play)) {
      // Try again with new coordinates
      x_play = Math.floor(Math.random() * 10);
      y_play = Math.floor(Math.random() * 10);
    }
    return [x_play, y_play];
  };

  return { playerPlay, computerPlay };
};

module.exports = Player;
