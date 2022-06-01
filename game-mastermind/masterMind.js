const { Console } = require("console-mpds");
const console = new Console();
playMasterMain();

function playMasterMain() {
  do {
    playGame();
  } while (repeatGame());
  console.writeln("Bye! See you next time");
}

function playGame() {
  
  const MAX_ROUNDS = 6;
  const CODE_LENGTH = 4;

  const totalPlayers = getTotalPlayers();
  const secretCode = getSecretCode(CODE_LENGTH,totalPlayers);
  console.writeln(`El código secreto es: ****`);
 
  let proposedCode = [];
  let breakerResults = [];
  let codeFound = false;
  let msg;
  
  for (let i = 0; !codeFound && i < MAX_ROUNDS; i++) {
    proposedCode[i] =  getProposedCode(CODE_LENGTH, i);
    breakerResults[i]=[];
    codeFound = getRoundResult(proposedCode[i], secretCode,breakerResults[i]);
    
    drawBoard(MAX_ROUNDS, proposedCode, breakerResults);
    if (codeFound) {
      msg = `Felicidades, has encontrado el código en ${i + 1} intentos.`;
    } else {
      msg = `Oh, has perdido, ¡Prueba otra vez!`;
    }
  }  
  console.writeln(msg);
  
  function getTotalPlayers(){
    let totalPlayers;
    let error = false;
    
    do{
      totalPlayers = console.readNumber("Introduce el número de jugadores (1-2)");
      error = totalPlayers !== 1 && totalPlayers !== 2;
      if(error){
        console.writeln('Por favor, responda 1 o 2');
      }
    }while (error)
    return totalPlayers;
  }
  function getSecretCode(CODE_LENGTH,totalPlayers) {
    const autoCode = totalPlayers === 1; 
    if(!autoCode){
      console.writeln(`Hola CodeMaker, Introduce el código secreto.`);
    }
    return getCode(CODE_LENGTH,autoCode);
  }

  function getProposedCode(CODE_LENGTH, roundNumber) {
    console.writeln(
      `Ronda ${roundNumber + 1}\nHola CodeBraker, por favor introduce un código válido.`
    );
    const proposedCode = getCode(CODE_LENGTH);
    return proposedCode;
  }

  function getCode(length,autoCode = false) {
    const COLORS = ["red", "green", "yellow", "blue", "white", "orange"];
    let code = [];
  
    for (let i = 0; i < length; i++) {
      if(autoCode === false){
        showMenu(COLORS);
        code[i] = askColor(i, COLORS.length);
      }
      else{
        let randomNumber = Math.random() * COLORS.length;
        code[i] = randomNumber - randomNumber % 1 +1;
      }
    }
    return code;

    function showMenu(COLORS) {
      console.writeln(`Choice one color:`);
      
      for (let i = 0; i < COLORS.length; i++) {
        console.writeln(`${i + 1}: ${COLORS[i]}`);
      }
    }
  }
  

  function askColor(codeColumn, colorsLength) {
    let choice;
    do {
      choice =
        console.readNumber(
          `Choise a color for column number ${
            codeColumn + 1
          } (1-${colorsLength}): `
        ) - 1;
    } while (choice < 0 || colorsLength - 1 < choice);
    return choice;
  }

  function getRoundResult(proposedCode, secretCode,resultsRound) {
    const NO_MATCH = 0;
    const MATCH = 1;
    const PLACED = 2;
    const TOTAL_PLACED = proposedCode.length * PLACED;
    let score = 0;
    for (let i = 0; i < proposedCode.length; i++) {
      let match = false;
      for (let j = 0; !match && j < proposedCode.length; j++) {
        if (proposedCode[i] == secretCode[j]) {
          resultsRound[i] = i === j ? PLACED : MATCH;
          match = true;
        }
        else {
          resultsRound[i] = NO_MATCH;
        }
      }
      score += resultsRound[i]
    }
    return score === TOTAL_PLACED;
  }


  function drawBoard(maxRounds, proposedCodes, results) {
   
    console.writeln("********** proposedCombination *****            ***RESULTsS*****");
    
    const COLORS_PICTURE = ["🔴", "🟢", "🟡", "🔵", "⚪", "🟠"];
    const RELUSTS_PICTURE = ["◾", "◻️", "✅"];
    for (let i = 0; i < maxRounds; i++) {
      let boardRow = "";
      const EMPTY_PICTURE = "⚫";
      const codeLenght = proposedCodes[0].length;
      if (i < proposedCodes.length) {
        for (let color of proposedCodes[i]) {
          boardRow += `-- ${COLORS_PICTURE[color]} `;
        }
        boardRow += "-------------------- || ";
        for (let result of results[i]) {
          boardRow += `-- ${RELUSTS_PICTURE[result]} `;
        }
      } else {
        for (j = 0; j < codeLenght ; j++) {
          boardRow += `-- ${EMPTY_PICTURE} `;
        }
      }
      //boardRow +=' --'
      console.writeln(boardRow);
    }
  }
}

function repeatGame() {
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
}
