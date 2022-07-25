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
            } while (this.continueDialog.isAffirmative());
        }
    }
}
function initGame() {
    return {
        play: function () {
            console.writeln(`----- MASTERMIND -----`);
            const board = initBoard();
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

function initBoard() {
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
                //console.writeln(`${proposedCombinations[i]}---->${results[i].getBlacks()} blacks + ${results[i].getWhites()} whites`);
                console.write(`${proposedCombinations[i]}---->`);
                results[i].show();
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

function initSecretCombination() {
    let that = {
        secretCombination: [],
        combination: initCombination(),

        setSecretCombination() {
            do {
                this.secretCombination.push(this.getColor());
            } while (!this.combination.isValidLength(this.secretCombination.length));
        },

        getColor() {
            let color;
            do {
                color = this.combination.getRandomColor();
            } while (this.containsColor(color));
            return color;
        },

        containsColor(color) {
            for (let secretColor of this.secretCombination) {
                if (secretColor === color) {
                    return true;
                }
            }
            return false;
        },
    }
    that.setSecretCombination();
    return {
        getResults(proposedCombination) {
            let blacks = 0;
            let whites = 0;
            for (let i = 0; i < proposedCombination.length; i++) {
                for (let j = 0; j < that.secretCombination.length; j++) {
                    if (proposedCombination[i] === that.secretCombination[j]) {
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

function initProposedCombination() {
    let that = {
        proposedCombination: '',
        combination: initCombination(),
        isValid() {
            let isValid = true;
            if (!this.combination.isValidLength(this.proposedCombination.length)) {
                isValid = false;
                console.writeln(`La longitud de la combinación propuesta es incorrecta`);
            } else if (!this.combination.isValidColors(this.proposedCombination)) {
                isValid = false;
                console.writeln(`Colores incorrectos, deben ser: rgybmc`);
            } else if (this.checkRepeatedColors()) {
                isValid = false;
                console.writeln(`La combinación propuesta contiene colores repetidos`);
            }
            return isValid;
        },
        checkRepeatedColors() {
            let repeated = false;
            for (let i = 0; !repeated && i < this.proposedCombination.length; i++) {
                for (let j = i + 1; !repeated && j < this.proposedCombination.length; j++) {
                    repeated = this.proposedCombination[j] === this.proposedCombination[i];
                }
            }
            return repeated;
        }
    }
    return {
        read() {

            do {
                that.proposedCombination = console.readString(`Propón una combinación: `);
            } while (!that.isValid());
            return that.proposedCombination;
        },
    };
}

function initCombination() {
    let that = {
        COMBINATION_LENGTH: 4,
        COLORS: 'rgbycm',

        containsColor(color) {
            for (let i = 0; i < this.COLORS.length; i++) {
                if (this.COLORS[i] === color) {
                    return true;
                }
            }
            return false;
        },
    }
    return {
        getRandomColor() {
            return that.COLORS[parseInt(Math.random() * that.COLORS.length)];
        },

        isValidLength(length) {
            return length === that.COMBINATION_LENGTH;
        },
        isValidColors(combination) {
            let valid = true;
            for (let i = 0; valid && i < that.COMBINATION_LENGTH; i++) {
                valid = that.containsColor(combination[i]);
            }
            return valid;
        },
    }
}

function initResults(blacks, whites) {
    return {
        getBlacks() {
            return blacks;
        },
        getWhites() {
            return whites;
        },
        show(){
            //console.writeln(`${this.getBlacks()} blacks + ${this.getWhites()} whites`);
            console.writeln(`${blacks} blacks + ${whites} whites`);
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


