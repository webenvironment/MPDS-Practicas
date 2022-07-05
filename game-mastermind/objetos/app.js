const { Console } = require("console-mpds");
const console = new Console();
let masterMind = initMasterMain();
masterMind.start();

function initMasterMain() {
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
    let gameSettings = {
        getColors() {
            const COLORS = ["r", "g", "b", "y", "c", "m"];
            return COLORS;
        },
        getMaxAttemps() {
            const MAX_ATTEMPTS = 4;
            return MAX_ATTEMPTS;
        },
        getCombinationLength() {
            const COMBINATION_LENGTH = 4;
            return COMBINATION_LENGTH;
        },
        getRandomColor() {
            return this.getColors()[parseInt(Math.random() * this.getColors.length)];
        },
        checkRepeatedColors(color, arrayColors) {
            for (let i = 0; i < arrayColors.length; i++) {
                if (arrayColors[i] === color) {
                    return true;
                }
            }
            return false;
        },
        containsColor(color) {
            for (let i = 0; i < this.getColors().length; i++) {
                if (this.getColors()[i] === color) {

                    return true;
                }
            }
            return false;
        },
        isGameOver(proposedAttemps) {
            return proposedAttemps === this.getMaxAttemps();
        }
    }

    return {
        play: function () {
            console.writeln(`----- MASTERMIND -----`);
            const board = initBoard(gameSettings);
            board.setSecretCombination();
            let proposedCombination = initProposedCombination(gameSettings);
            do {
                proposedCombination.read();
                board.addCombination(proposedCombination.getProposedCombination());
                board.getResults();
                board.show();
            } while (!gameSettings.isGameOver(board.getProposedAttemps()) || board.isWinner())
        }
    }
}

function initBoard(gameSettings) {
    let proposedCombinations = [];
    let results=[];
    return {
        secretCombination: initSecretCombination(gameSettings),
        setSecretCombination() {
            this.secretCombination.setSecretCombination()
        },
        show: function () {
            
            for (let i= 0; i<proposedCombinations.length;i++) {
                console.writeln(`${i + 1} intentos(s):`);
                console.writeln(`${proposedCombinations[i]}---->${results[i][0]} blacks + ${results[i][1]} whites`);
            }
        },

        addCombination: function (combination) {
            proposedCombinations.push(combination);
        },

        showCombination: function (combination) {
            console.writeln(combination)
        },

        getProposedAttemps() {
            return proposedCombinations.length;
        },

        getResults(){
            console.writeln(this.secretCombination.getResults(proposedCombinations.pop()));
        }
    }


}

function initSecretCombination(gameSettings) {
    let secretCombination;
    return {
        setSecretCombination: function () {
            let arrayColors = [];
            for (let i = 1; i < gameSettings.getCombinationLength; i++) {
                do {
                    let color = gameSettings.getRandomColor();
                } while (gameSettings.checkRepeatedColors(color, arrayColors));
                arrayColors[i] = color;
            }
            secretCombination = arrayColors;
        },
        getResults(combination){
            let blacks = 0;
            let whites = 0;
            for(let i=0;i<combination.length;i++){
                for (let j=0;i<secretCombination.length;j++){
                    if(combination[i]===secretCombination[j]){
                        if(i===j){
                           blacks ++;
                        }else{
                            whites ++;
                        }

                    }
                }
            }
            return [blacks,whites];
        }
    }
}

function initProposedCombination(gameSettings) {


    return {
        proposedCombination:'',

        read: function () {
            let combination;
            do {
                combination = console.readString(`Propón una combinación: `);
            } while (!this.isValidCombination(combination));
            this.setProposedCombination(combination);
        },

        setProposedCombination(combination){
            this.proposedCombination = combination;
        },

        getProposedCombination(){
            return this.proposedCombination;
        },

        isValidCombination: function (combination) {
            let isValid = true;
            if (combination.length !== gameSettings.getCombinationLength()) {
                isValid = false;
                console.writeln(`La longitud de la combinación propuesta es incorrecta`);
            } else if (!this.isValidColors(combination)) {
                isValid = false;
                console.writeln(`Colores incorrectos, deben ser: rgybmc`);
            } else if (this.checkRepeatedColors(combination)) {
                isValid = false;
                console.writeln(`La combinación propuesta contiene colores repetidos`);
            }
            return isValid;
        },

        isValidColors(proposedCombination) {
            let valid = true;
            for (let i = 0; valid && i < proposedCombination.length; i++) {
                valid = gameSettings.containsColor(proposedCombination[i])
            }
            return valid;
        },
        checkRepeatedColors(proposedCombination) {
            let repetitions = 0;
            for (let i = 0; i < proposedCombination.length; i++) {
                for (color of proposedCombination) {
                    if (color === proposedCombination[i]) {
                        repetitions++;
                    }
                }
                return repetitions > 1;

            }
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


