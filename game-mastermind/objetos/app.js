const { Console } = require("console-mpds");
const console = new Console();
playMasterMain();

function playMasterMain() {
    let continueDialog = initYesNoDialog('Quieres jugar de nuevo?');
    do {
        const game = initGame();
        game.play();
        continueDialog.read();
    } while (continueDialog.isAfirmative());
}

function initGame() {
    let game = {
        turn: 0,
        MAX_PLAYERS: 2,
        MAX_ATTEMPTS: 4,
        nAttempt: 0,
        COLORS: ["r", "g", "b", "y", "c", "m"],
        COMBINATION_LENGTH: 4,
        totalPlayers: 2,
        //secretCombination: initSecretCombination(this.COLORS, this.COMBINATION_LENGTH),
        //proposedCombination: initProposedCombination(),

        play: function () {

            const secretCombination = initSecretCombination(this.COLORS, this.COMBINATION_LENGTH);
            console.writeln(`combination: ${secretCombination.setSecretCombination()}`)
            let proposedCombination = initProposedCombination(this.COLORS, this.COMBINATION_LENGTH);
            do {
                proposedCombination.getProposedCombination();
            } while (!this.isGameOver(proposedCombination.getProposedAttemps()))
        },

        isGameOver: function (attemps) {
            return  attemps === this.MAX_ATTEMPTS;
        },
        getColors: function () {
            return this.COLORS;
        },
        getCombinationLength: function () {
            return this.COMBINATION_LENGTH;
        }
    }

    function initSecretCombination(colors, length) {

        return {
            colors: colors,
            length: length,

            setSecretCombination: function () {
                let combination = [];
                let arrayIndex = [];
                let index;
                for (let i = 0; i < length; i++) {
                    do {
                        index = parseInt(Math.random() * this.colors.length);
                    } while (this.isRepeated(index, arrayIndex))
                    arrayIndex[i] = index;
                    combination[i] = this.colors[index];
                }
                return combination;
            },

            isRepeated: function (element, arrayElements) {
                let isRepeated = false;
                for (let i = 0; i < arrayElements.length; i++) {
                    if (element === arrayElements[i]) {
                        isRepeated = true;
                    }
                }
                return isRepeated;
            },
            getcombination: function () {
                return this.combination;
            }
        }
    }

    function initProposedCombination(colors, combinationLength) {
        
        
        return {
            proposedCombinations: [],
            combintionaLength: combinationLength,
            getProposedCombination: function () {
                let proposedCombination;
                do {
                    proposedCombination = console.readString(`Propón una combinación: `);
                } while (!this.isValidCombination(proposedCombination));
                this.proposedCombinations[this.proposedCombinations.length] = proposedCombination;
            },

            getProposedAttemps: function () {
                return this.proposedCombinations.length;
            },

            isValidCombination: function (proposedCombination) {
                let isValid = true;
                if (proposedCombination.length !== combinationLength) {
                    isValid = false;
                    console.writeln(`La longitud de la combinación propuesta es incorrecta`);
                } else if (!this.isValidColors(proposedCombination)) {
                    isValid = false;
                    console.writeln(`Colores incorrectos, deben ser: rgybmc`);
                } else if (this.checkRepeatedColors(proposedCombination)) {
                    isValid = false;
                    console.writeln(`La combinación propuesta contiene colores repetidos`);
                }
                return isValid;
            },

            isValidColors : function(proposedCombination){
                return true;
            },

            checkRepeatedColors(proposedCombination){
                return false;
            }
        }
    }


    function showBoard() {
        let msg = `\n${nAttempt + 1} intento${nAttempt + 1 == 1 ? '' : 's'}:\
                 \n****\n`;
        for (let i = 0; i < this.proposedCombination, length; i++) {
            msg += `${proposedCombination[i]} --> ${result[i][indexBlacks]} negras y ${result[i][indexWhites]} blancas\n`;
        }
        console.writeln(msg);
    }

    /* getAmountDialog: function(min, max, question) {
        return {
            min: min,
            max: max,
            question: question,
            answer: 0,
 
            read: function () {
                let error = false;
                do {
                    this.answer = console.readNumber(`${this.question} ("${this.min}-${this.max}"):`);
                    error = !this.isAfirmative() && !this.isNegative();
                    if (error) {
                        console.writeln('Has introducido una respuesta incorrecta');
                    }
                } while (error);
            }
        }
    } */

    return game;


}


function initYesNoDialog(dialogText) {
    return {
        dialogText: dialogText,
        answer: '',
        read: function () {
            let error = false;
            do {
                this.answer = console.readString(`${this.dialogText} ("si/no"):`);
                error = !this.isAfirmative() && !this.isNegative();
                if (error) {
                    console.writeln(`Has introducido una respuesta incorrecta ${this.answer}`);
                }
            } while (error);
        },

        isAfirmative: function () {
            return this.answer === 'si';
        },

        isNegative: function () {
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