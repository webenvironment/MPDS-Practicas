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

function initGame() {

    return {
        play() {
            do {
                board.show();
                board.placeToken();
            } while (!board.isWinner());
        }
    }
}
function initBoard() {
    let that = {
        TOKEN_EMPTY: ' ',
        tokens: [
            [TOKEN_EMPTY, TOKEN_EMPTY, TOKEN_EMPTY],
            [TOKEN_EMPTY, TOKEN_EMPTY, TOKEN_EMPTY],
            [TOKEN_EMPTY, TOKEN_EMPTY, TOKEN_EMPTY]
        ],

    }

    return {
        turn: initTurn(),
        show() {
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
        },

        placeToken() {
            let origin = [];
            let target = [];
            if (this.turn.isMovementTurn()) {
                origin = this.readOrigin();
            }
            target = this.readTarget();
        },

        getTokenPlaced() {
            let empties = 0;
            for (let i = 0; i < tokens.length; i++) {
                for (let j = 0; j < tokens[i].length; j++) {
                    if (tokens[i][j] === TOKEN_EMPTY) {
                        empties++;
                    }
                }
            }
            return 
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
