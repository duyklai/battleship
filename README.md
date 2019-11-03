# Battleship: Goals

Main focus for this project was a combination of a little bit of unit testing, reviewing DOM manipulation, and usage of javascript factory function/module.

This is the current [Online Demo](https://duyklai.github.io/battleship/)

# Instruction: How to play

Battleship is a guessing game. Each player starts with 5 ships, which can be placed on the 10 x 10 board. Player can place their ships by clicking on the name of the ships on the left bar and choose a space on the board for it. The ship MUST fit inside of the board and CANNOT overlap with other ships. Once both players have placed their ships, they take turn choosing a square on the board to attack. The attack will be marked white if missed and red if it hits a part of a ship. The game ends when one player sinks all of the ships of their opponents.

## The 5 Ships

- Carrier (length: 5)
- Battleship (length: 4)
- Destroyer (length: 3)
- Submarine (length: 3)
- Patrol (Boat) (length: 2)

# Features

This project features many changes on the webpage. Players have a helper "phantom" ship which indicates where the Player can place their ship. The "phantom" ship disappears if the user hovers over a position which causes the ship to go out of bounds. Player also have a rotate function which allows the Player to turn the ship 90 degree and place them vertically instead. The computer places its ship immediately and ready to start the game when the Player is also ready. Once game starts, the computer will take its turn right after the Player takes their turn. In the current build, the game does not allow user to attack the same square if they have already choosen it before (to prevent losing a turn) and computer will not take its move until the player chooses a valid attack. The ship fleet on the left becomes a ship tracker after the game starts, telling the player which ship they have sunk (currently does not support ship tracker for computer).

# Instruction: How to build

## Running on local machine

After cloning the repository, in the project directory, you can run:

### `npm install`

Then,

### `npm run build`

Included is the basic webpack index.html and the style.css already attached.
Launching `/dist/index.html` will launch the game on your browser.

# Future todos/improvements:

- Better AI guessing/educated guesses
- Support for two players battle
