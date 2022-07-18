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
                if(!board.isTicTacToe()){
                    board.nextTurn();
                }
            } while (!board.isTicTacToe());
            board.show();
            board.showWinner();
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
        getCoordinate(title){
            let coordinate = [];
            coordinate[0] = console.readNumber(`Fila ${title}`);
            coordinate[1] = console.readNumber(`Columna ${title}`);
        }

    }

    return {
        turn: initTurn(),
        show() {
            const HORIZONTAL_SEPARTOR = `-------------`;
            const VERTICAL_SEPARATOR = `|`;
            let msg = ``;
            for (let i = 0; i < that.tokens.length; i++) {
                msg += `${HORIZONTAL_SEPARTOR}\n`;
                for (let j = 0; j < that.tokens[i].length; j++) {
                    msg += `${VERTICAL_SEPARATOR} ${that.tokens[i][j]} `;
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
                origin = initCoordinate();
                origin.read('origen ')
            }
            target = initCoordinate();
            target.read('destino ');
            if(that.turn.isMovementTurn()){
                token[origin]= TOKEN_EMPTY;
            }
            token[target]=this.turn.getActiveToken();
        },
        isTicTacToe(){

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
