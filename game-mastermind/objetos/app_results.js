const { Console } = require("console-mpds");
const console = new Console();
const mastermind = initMastermind();
mastermind.start();

function initMastermind() {
    return {
        continueDialog: initYesNoDialog('Quieres jugar de nuevo?'),
        start() {
            do {
                const game = initGame();
                game.play();
                this.continueDialog.read();
            } while (this.continueDialog.isAfirmative());
        }
    }
}
function initGame() {
    return {
        play: function () {
            console.writeln(`----- MASTERMIND -----`);
            const board = initBoard();
            //board.setSecretCombination();
            //let proposedCombination = initProposedCombination();
            do {
                board.addProposedCombination();
                board.show();
            } while (!board.isGameOver());
            if (board.isWinner()) {
                console.writeln(`Enhorabuena, has ganado!!!!`);
            } else {
                console.writeln(`Lo siento, has perdido!!!!`);
            }
        }
    }
}

function initBoard(gameSettings) {
    const MAX_ATTEMPTS = 4;
    let proposedCombinations = [];
    let secretCombination = initSecretCombination();
    let results = [];
    return {
        addProposedCombination() {
            let proposedCombination = initProposedCombination();
            proposedCombinations.push(proposedCombination.read());
            results.push(secretCombination.getResults(proposedCombinations[proposedCombinations.length - 1]));
        },

        show() {
            for (let i = 0; i < proposedCombinations.length; i++) {
                console.writeln(`\n${i + 1} intentos(s):`);
                console.writeln(`${proposedCombinations[i]}---->${results[i].getBlacks()} + ${results[i].getWhites()}`);
            }
        },

        isWinner() {
            return results[results.length - 1].getBlacks() === proposedCombinations[results.length - 1].length;
        },

        isGameOver() {
            return this.isWinner() || proposedCombinations.length === MAX_ATTEMPTS;
        }
    }
}

function initSecretCombination(gameSettings) {
    let secretCombination = [];
    let combination = initCombination();
    let getSecretCombination = function () {

        let color;
        for (let i = 0; i < combination.getCombinationLength(); i++) {
            do {
                color = combination.getRandomColor();
            } while (combination.checkRepeatedColors(color, secretCombination));
            secretCombination[i] = color;
        }
    };
    return {
        getResults(proposedCombination) {
            let blacks = 0;
            let whites = 0;
            for (let i = 0; i < combination.length; i++) {
                for (let j = 0; j < secretCombination.length; j++) {
                    if (combination[i] === secretCombination[j]) {
                        if (i === j) {
                            blacks++;
                        } else {
                            whites++;
                        }
                    }
                }
            }
            return initResults(blacks, whites);
        }
    }
}

function initResults(blacks, whites) {
    /* const blacks = blacks;
    const whites = whites; */
    return {
        getBlacks() {
            return blacks;
        },
        getWhites() {
            return whites;
        }
    }
}
function initCombination() {
    let that = {
        COMBINATION_LENGTH: 4,
        COLORS: 'rgbycm',
        isValidColors(combination) {
            let valid = true;
            for (let i = 0; valid && i < this.COMBINATION_LENGTH; i++) {
                valid = this.containsColor(combination[i])
            }
            return valid;
        },
        containsColor(color) {
            for (let i = 0; i < this.COLORS.length; i++) {
                if (this.COLORS[i] === color) {
                    return true;
                }
            }
            return false;
        },
        checkRepeatedColors(combination) {
            let repeated = false;
            for (let i = 0; !repeated && i < combination.length; i++) {
                for (let j = i + 1; !repeated && j < combination.length; j++) {
                    repeated = combination[j] === combination[i];
                }
            }
            return repeated;
        }

    }
    return {

        getRandomColor() {
            return this.getColors()[parseInt(Math.random() * this.getColors().length)];
        },

        isValidCombination: function (combination) {
            let isValid = true;
            if (combination.length !== that.COMBINATION_LENGTH) {
                isValid = false;
                console.writeln(`La longitud de la combinación propuesta es incorrecta`);
            } else if (!that.isValidColors(combination)) {
                isValid = false;
                console.writeln(`Colores incorrectos, deben ser: rgybmc`);
            } else if (that.checkRepeatedColors(combination)) {
                isValid = false;
                console.writeln(`La combinación propuesta contiene colores repetidos`);
            }
            return isValid;
        },


    }

}


function initProposedCombination(gameSettings) {
    let proposedCombination;
    return {
        read: function () {
            combination = initCombination();
            do {
                proposedCombination = console.readString(`Propón una combinación: `);
            } while (!combination.isValidCombination(proposedCombination));
            return proposedCombination;
        },
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


