const { Console } = require("console-mpds");
const console = new Console();
playMasterMain();

function playMasterMain() {
    let repeatGame;
    do {
        playGame();
        repeatGame = createYesNoDialog('Quieres jugar de nuevo?');
   } while (repeatGame.read());
    console.writeln("¡Hasta pronto!");
}

function playGame() {
    let game = {
        MAX_ATTEMPTS: 10,
        CODE_LENGTH: 4,
        totalPlayers : 2,
        //secretCode: getSecretCode(CODE_LENGTH, totalPlayers),

    }
}

function createYesNoDialog(dialogText) {
    return {
        afirmative: true,
        negative: false,
        read: function () {
            let error;
            do {
                let answer = console.readString(`${dialogText} ("si/no"):`);
                if (answer === 'si') {
                    return this.afirmative;
                }
                if (answer === 'no') {
                    return this.negative;
                }
                console.writeln('Has introducido una respuesta incorrecta');
                error = true;
            }while(error);
        }
    }
}


/* function repeatGame() {
    let repeat;
    let validResponse;
    do {
      repeat = console.readString("Quieres jugar otra vez? (s/n)");
      validResponse = repeat === "s" || repeat === "n";
      if (validResponse) {
        return repeat === "s";
      } else {
        console.writeln("\nPor favor, introduce una respuesta correcta.");
      }
    } while (!validResponse);
  } */