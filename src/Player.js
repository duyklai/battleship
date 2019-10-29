const Player = input_name => {
  const name = input_name;

  const playerPlay = () => {
    // Player takes turn
  };

  const computerPlay = () => {
    // Computer takes turn
    x_play = Math.getRandomInt(9);
    y_play = Math.getRandomInt(9);
    // Check to make sure coordinates has not been play
    while (Gameboard.receiveAttack(x_play, y_play)) {
      // Try again with new coordinates
      x_play = Math.getRandomInt(9);
      y_play = Math.getRandomInt(9);
    }
  };

  // Private functions
  const getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  return { playerPlay, compuerPlay };
};

module.exports = Player;
