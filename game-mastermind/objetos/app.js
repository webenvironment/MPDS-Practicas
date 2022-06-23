const { Console } = require("console-mpds");
const console = new Console();
playMasterMain();

function playMasterMain() {
    let continueDialog = initYesNoDialog('Quieres jugar de nuevo?');
    do {
        const game = initGame();
        game.play();
        continueDialog.read(); 
   } while (repeatGame.isAfirmative);
}

function initGame() {
    let game = {
        turn : 0,
        MAX_PLAYERS : 2,
        MAX_ATTEMPTS: 10,
        CODE_LENGTH: 4,
        totalPlayers : 2,
        secretCode: [],
        proposedCombination: [],

        play: function(){
            this.secretCode = getSecretCode();
        },

        getAmountDialog(min,max,question){
            return {
                min: min,
                max: max,
                question: question,
                answer: 0,

                read: function () {
                    let error = false;
                    do {
                        answer = console.readNumber(`${this.question} ("${this.min}-${this.max}"):`);
                        error = !this.isAfirmative() && !this.isNegative();
                        if (error) {
                            console.writeln('Has introducido una respuesta incorrecta');
                        }
                    }while(error);
                },
            }
        },
        getSecretCode: function(){

        },


    }
}

function initYesNoDialog(dialogText) {
    return {
        dialogText : dialogText,
        answer : '',
        read: function () {
            let error = false;
            do {
                answer = console.readString(`${this.dialogText} ("si/no"):`);
                error = !this.isAfirmative() && !this.isNegative();
                if (error) {
                    console.writeln('Has introducido una respuesta incorrecta');
                }
            }while(error);
        },
        
        isAfirmative: function(){
            return this.answer === 'si';
        },

        isNegative: function(){
            return this.answer === 'no';
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