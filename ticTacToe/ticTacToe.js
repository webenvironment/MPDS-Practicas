const { Console } = require("console-mpds");
const console = new Console();


playTicTacToe();

function playTicTacToe() {
    let continueDialog = initYesNoDialog(`¿Quieres jugar otra partida? `);
    do {
      const game = initGame();
      game.play();
      continueDialog.read();
    } while (continueDialog.isAffirmative());
  }
  
function initGame(){
    
    return{
        play(){
            
        }
    }
}



  function initYesNoDialog(dialogText) {
    return {
        dialogText: dialogText,
        answer: '',
        read: function () {
            let error = false;
            do {
                this.answer = console.readString(`${this.dialogText} ("si/no"):`);
                error = !this.isAffirmative() && !this.isNegative();
                if (error) {
                    console.writeln(`Has introducido una respuesta incorrecta ${this.answer}`);
                }
            } while (error);
        },

        isAffirmative: function () {
            return this.answer === 'si';
        },

        isNegative: function () {
            return this.answer === 'no';
        }
    }
}
