const { Console } = require("console-mpds");
const console = new Console();
playMasterMain();

function playMasterMain(){
    do {
        playGame();
      } while (repeatGame());
      console.writeln("Bye! See you next time");
}

function playGame(){
    let game ={
        MAX_ATTEMPTS : 10,
        CODE_LENGTH : 4,
        totalPlayers ,
        secretCode : getSecretCode(CODE_LENGTH,totalPlayers),

    }
}


function repeatGame() {
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
  }