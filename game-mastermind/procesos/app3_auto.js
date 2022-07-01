const { Console } = require("console-mpds");
const console = new Console(); // process oriented programmingplayMastermind();function playMastermind() {
do {
    playGame();
} while (isResumed());
function playGame() {
    const COMBINATION_LENGTH = 4;
    const COMBINATION_TYPE = ['manual', 'auto'];
    const MAX_ATTEMPTS = 10;

    console.writeln(`\n----- MASTERMIND -----\n\n`);
    const secretCombination = getProposedCombination(COMBINATION_LENGTH, COMBINATION_TYPE[1]);
    let nAttempt = 0;
    let attemptMsg = (attempt) => `\n${attempt} intento (s):`;
    showMsg(attemptMsg(nAttempt));
    let proposedCombinations = [];
    let proposedResults = [];
    let foundCombination = false;
    do {
        proposedCombinations[nAttempt] = getProposedCombination(COMBINATION_LENGTH, COMBINATION_TYPE[0]);
        proposedResults[nAttempt] = getProposedResults(
            proposedCombinations[nAttempt],
            secretCombination
        );
        foundCombination = isFoundCombination(proposedResults[nAttempt], COMBINATION_LENGTH);
        //showAttempMsg(nAttempt + 1);
        showMsg(attemptMsg(nAttempt + 1));
        showBoard(proposedCombinations, proposedResults);
        nAttempt++;
    } while (!foundCombination && nAttempt < MAX_ATTEMPTS);
    console.writeln(`${foundCombination === true ? "\nEnhorabuena has ganado!" : "\nLo siento has perdido!"}`);

    function showMsg(msg) {
        console.writeln(msg);
    }
    function getProposedCombination(combinationLength, combinationType) {
        const VALID_COLORS = ["r", "g", "b", "y", "c", "m"];
        let proposedCombination = "";
        if (combinationType === 'auto') {
            proposedCombination = getSecretCombination(combinationLength, VALID_COLORS);
        } else {
            do {
                proposedCombination = console.readString("Propón una combinación:");
            } while (
                !isValidCombination(proposedCombination, VALID_COLORS, combinationLength)
            );
        }
        return proposedCombination;

        function getSecretCombination(length, validColors) {
            let combination = [];
            for (let i = 0; i < length; i++) {
                let duplicated = false;
                do {
                    let index = parseInt(Math.random() * validColors.length);
                    combination[i] = validColors[index];
                    duplicated = checkDuplicated(validColors[index], combination);
                } while (duplicated)
            }
            return combination;
        }

        function isValidCombination(proposedCombination, validColors, combinationLength) {
            let valid = true;
            let msg;
            if (proposedCombination.length !== combinationLength) {
                msg = `La longitud de la combinación propuesta es incorrecta`;
                valid = false;
            } else if (!isValidColor(proposedCombination, validColors)) {
                msg = `Colores incorrectos, deben ser: rgybmc`;
                valid = false;
            } else {
                let duplicated = false;
                for (let i = 0; !duplicated && i < proposedCombination.length - 1; i++) {
                    duplicated = checkDuplicated(proposedCombination[i], proposedCombination);
                }
                if (duplicated) {
                    msg = 'La combinación propuesta contiene colores repetidos';
                    valid = false;
                }
            }
            if (!valid) {
                showMsg(msg);
            }
            return valid;
         }

        function isValidColor(proposedCombination, validColors) {
            let numberOfValids = 0;
            for (const proposedColor of proposedCombination) {
                for (let i = 0; i < validColors.length; i++) {
                    if (proposedColor === validColors[i]) {
                        numberOfValids++;
                    }
                }
            }
            return numberOfValids === proposedCombination.length;
        }
        function checkDuplicated(color, proposedCombination) {
            let repetitions = 0;
            for (proposed of proposedCombination) {
                if (color === proposed) {
                    repetitions++;
                }
            }
            return repetitions > 1;
        }
    }
    function getProposedResults(proposedCombination, secretCombination) {
        let blacks = 0;
        let whites = 0;
        for (let i = 0; i < proposedCombination.length; i++) {
            let match = false;
            for (let j = 0; !match && j < secretCombination.length; j++) {
                match = false;
                if (proposedCombination[i] === secretCombination[j]) {
                    if (i === j) {
                        blacks++;
                        match = true;
                    } else {
                        whites++
                    }
                }
            }
        }
        return [blacks, whites];
    }

    function isFoundCombination(proposedResults, combinationLength) {
        return proposedResults[0] === combinationLength;
    }

    function showBoard(proposedCombination, result) {
        const blanksIndex = 0;
        const whiteIndex = 1;
        for (let i = 0; i < proposedCombination.length; i++) {
            console.writeln(
                `${proposedCombination[i]} --> ${result[i][blanksIndex]} negras y ${result[i][whiteIndex]} blancas`
            );
        }
    }
}

function isResumed() {
    let answer;
    let error;
    do {
        answer = console.readString("Quieres jugar otra vez? (s/n)");
        error = answer !== "s" && answer !== "n";
        if (error) {
            console.writeln("\nPor favor, introduce una respuesta correcta.");
        } else if (answer === "n") {
            console.writeln("\nFin del juego, hasta pronto!");
        }
    } while (error);
    return answer === "s";
}
