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
            board = initBoard();
            do {
                board.show();
                board.placeToken();
                if (!board.isTicTacToe()) {
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
        MAX_TOKENS: 3,
        tokens: [],
        createBoard() {
            for (let i = 0; i < 3; i++) {
                this.tokens.push([]);
                for (let j = 0; j < this.MAX_TOKENS; j++) {
                    this.tokens[i].push(this.TOKEN_EMPTY);
                }
            }
        },
        getMaxTokens() {
            return this.MAX_TOKENS;
        },
        getTokens() {
            return this.tokens;
        },
        isMovement(turnCount) {
            if (turnCount > this.MAX_TOKENS * 2) {
                return true;
            }
            return false;
        },
        isEmpty(coordinate) {
            return this.tokens[coordinate.getRow()][coordinate.getColumn()] === this.TOKEN_EMPTY;
        },
        isPlayerToken(coordinate, turn) {
            return this.tokens[coordinate.getRow()][coordinate.getColumn()] === turn.getActiveToken();
        }
    }
    that.createBoard();
    return {

        turn: initTurn(),


        show() {
            const HORIZONTAL_SEPARTOR = `-------------`;
            const VERTICAL_SEPARATOR = `|`;
            let msg = ``;
            for (let i = 0; i < that.getTokens().length; i++) {
                msg += `${HORIZONTAL_SEPARTOR}\n`;
                for (let j = 0; j < that.getTokens()[i].length; j++) {
                    msg += `${VERTICAL_SEPARATOR} ${that.getTokens()[i][j]} `;
                }
                msg += `${VERTICAL_SEPARATOR}\n`;
            }
            msg += HORIZONTAL_SEPARTOR;
            console.writeln(msg);
        },

        placeToken() {
            let origin = [];
            let target = [];
            console.writeln(`\nTurno para: ${this.turn.getActiveToken()}`)
            if (that.isMovement(this.turn.getTurnCount())) {
                origin = initCoordinate(that.getMaxTokens());
                do {
                    origin.readCoordinate('origen ');
                    if (!that.isPlayerToken(origin, this.turn)) {
                        console.writeln(`No hay una ficha de la propiedad ${this.turn.getActiveToken()} en la celda indicada.`)
                    }
                } while (!that.isPlayerToken(origin, this.turn));
            }
            target = initCoordinate(that.getMaxTokens());
            do {
                target.readCoordinate('destino ');
                if (!that.isEmpty(target)) {
                    console.writeln(`Indique una celda vacía`);
                }
            } while (!that.isEmpty(target));
            if (that.isMovement(this.turn.getTurnCount())) {
                that.tokens[origin.getRow()][origin.getColumn()] = that.TOKEN_EMPTY;
            }
            that.tokens[target.getRow()][target.getColumn()] = this.turn.getActiveToken();
            this.turn.nextTurn();
        },
        isTicTacToe() {
            return false;
        }


    }
}

function initTurn() {
    let activeToken = 'X';
    let turnCount = 1;
    return {
        nextTurn() {
            activeToken = activeToken === 'X' ? 'O' : 'X';
            turnCount++;
        },
        getActiveToken() {
            return activeToken;
        },
        getTurnCount() {
            return turnCount;
        }

    }
}

function initCoordinate(maxTokens) {
    //let maxTokens = maxTokens;
    let row;
    let column;
    function read(title) {
        let choice;
        let error;
        do {
            choice = console.readNumber(`${title}`);
            error = choice < 1 || maxTokens < choice;
            if (error) {
                console.writeln(`Por favor un numero entre 1 y ${maxTokens} inclusives`)
            }
        } while (error);
        return choice - 1;
    }
    return {
        readCoordinate(title) {
            row = read(`Fila ${title}`);
            column = read(`Columna ${title}`);
        },
        getCoordinate() {
            return `${row}[${column}]`;
        },
        getRow() {
            return row;
        },
        getColumn() {
            return column;
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
