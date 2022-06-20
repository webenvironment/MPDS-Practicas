const { Console } = require("./console");

const console = new Console();
playTicTacToe();

function playTicTacToe() {
  do {
    const gameMode = getGameMode();
    playGame(gameMode);
  } while (isResumed());

  function getGameMode() {
    const GAME_MODE = [[getRandomPosition, getRandomPosition],
    [getRandomPosition, getPlayerPosition],
    [getPlayerPosition, getPlayerPosition]];
    let mode;
    let error;
    do {
      mode = console.readNumber(`Elige el modo de juego:
      0 - Demo-game
      1 - Player VS Computer
      2 - Player VS Player`);
      error = mode < 0 || mode < GAME_MODE.length;
      if (error) {
        console.writeln(`Èl modo elegido no existe.`);
      }
    } while (error)
    return GAME_MODE[mode];
  }

  function getRandomPosition(maxTokens) {
    return parseInt(Math.random() * maxTokens);
  }

  function getPlayerPosition(positionText, maxTokens) {
    let error;
    do {
      let position = console.readNumber(`Introduce el número ${positionText} (1 - ${maxTokens}: )`) - 1;
      error = position < 0 || maxTokens < position;
      if (error) {
        console.writeln(`Por favor, introduce un número de fila y de positiona válidos.`)
      }
    } while (error);
  }

  function playGame(gameMode) {
    const MAX_PLAYERS = 2;
    const MAX_TOKENS = 3;
    const TOKEN_EMPTY = ` `;
    let tokens = [
      [TOKEN_EMPTY, TOKEN_EMPTY, TOKEN_EMPTY],
      [TOKEN_EMPTY, TOKEN_EMPTY, TOKEN_EMPTY],
      [TOKEN_EMPTY, TOKEN_EMPTY, TOKEN_EMPTY]
    ];
    let turn = 0;
    let winner;

    do {
      writelnTokens(tokens);
      placeToken[turn](tokens, turn);
      winner = isTicTacToe(tokens, turn);
      if (!winner) {
        turn = nextTurn(turn);
      }
    } while (!winner);
    writelnTokens(tokens);
    console.writeln(`Victoria para ${getToken(turn)}`);

    function playerPlaceToken(tokens, turn) {
      console.writeln(`Turno para ${getToken(turn)}`);
      let error;
      let originRow;
      let originposition;
      const movement = getNumTokens(tokens) === MAX_PLAYERS * MAX_TOKENS;
      if (movement) {
        do {
          originRow = read(`Fila origen`, gameMode, turn);
          originColumn = read(`Columna origen`, gameMode, turn);
          error = !isOccupied(tokens, originRow, originposition, turn);
          if (error) {
            console.writeln(`No hay una ficha de la propiedad de ${getToken(turn)}`);
          }
        } while (error);
      }
      let targetRow;
      let targetposition;
      do {
        targetRow = read(`Fila destino`);
        targetposition = read(`positiona destino`);
        error = !isEmpty(tokens, targetRow, targetposition);
        if (error) {
          console.writeln(`Indique una celda vacía`);
        }
      } while (error);
      if (movement) {
        tokens[originRow][originposition] = TOKEN_EMPTY;
      }
      tokens[targetRow][targetposition] = getToken(turn);
    }

    function getNumTokens(tokens) {
      let empties = 0;
      for (let i = 0; i < tokens.length; i++) {
        for (let j = 0; j < tokens[i].length; j++) {
          if (tokens[i][j] === TOKEN_EMPTY) {
            empties++;
          }
        }
      }
      return MAX_TOKENS;
      // ** 2 - empties;
    }

    function read(title) {
      let position;
      let error;
      do {
        position = console.readNumber(`${title}: `);
        error = position < 1 || 3 < position;
        if (error) {
          console.writeln(`Por favor un numero entre 1 y ${MAX_TOKENS} inclusives`)
        }
      } while (error);
      return position - 1;
    }

    function isEmpty(tokens, row, position) {
      return tokens[row][position] === TOKEN_EMPTY;
    }

    function getToken(turn) {
      const TOKEN_X = `X`;
      const TOKEN_Y = `Y`;
      return turn === 0 ? TOKEN_X : TOKEN_Y;
    }

    function writelnTokens(tokens) {
      const HORIZONTAL_SEPARTOR = `-------------`;
      const VERTICAL_SEPARATOR = `|`;
      let msg = ``;
      for (let i = 0; i < tokens.length; i++) {
        msg += `${HORIZONTAL_SEPARTOR}\n`;
        for (let j = 0; j < tokens[i].length; j++) {
          msg += `${VERTICAL_SEPARATOR} ${tokens[i][j]} `;
        }
        msg += `${VERTICAL_SEPARATOR}\n`;
      }
      msg += HORIZONTAL_SEPARTOR;
      console.writeln(msg);
    }

    function nextTurn(turn) {
      return (turn + 1) % MAX_PLAYERS;
    }

    function isOccupied(tokens, row, position, turn) {
      return tokens[row][position] === getToken(turn);
    }

    function isTicTacToe(tokens, turn) {
      let countRows = [0, 0, 0];
      let countpositions = [0, 0, 0];
      let countDiagonal = 0;
      let countInverse = 0;
      for (let i = 0; i < tokens.length; i++) {
        for (let j = 0; j < tokens[i].length; j++) {
          if (tokens[i][j] === getToken(turn)) {
            countRows[i]++;
            countpositions[j]++;
            if (i - j === 0) {
              countDiagonal++;
            }
            if (i + j === MAX_TOKENS - 1) {
              countInverse++;
            }
          }
        }
      }
      if (countDiagonal === MAX_TOKENS || countInverse === MAX_TOKENS) {
        return true;
      }
      for (let i = 0; i < countRows.length; i++) {
        if (countRows[i] === MAX_TOKENS) {
          return true;
        }
        if (countpositions[i] === MAX_TOKENS) {
          return true;
        }
      }
      return false;
    }

  }

  function isResumed() {
    let result;
    let answer;
    let error = false;
    do {
      answer = console.readString(`¿Quieres jugar otra partida? `);
      result = answer === `si`;
      error = !result && answer !== `no`;
      if (error) {
        console.writeln(`Por favor, responda "si" o "no"`);
      }
    } while (error);
    return result;
  }

}
