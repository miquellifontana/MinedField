var field;
var processingQueue = [];

var thisGame;
var gameHistory = new Array();

var players = new Array();
var mapPlayersByName = new Array();

function Player(name, victories, defeats) {
  this.name;
  this.victories;
  this.defeats;
}

function GameSettings(fieldLines, fieldColumns, totalBombs, playerName) {
  this.fieldLines = fieldLines;
  this.fieldColumns = fieldColumns;
  this.totalBombs = totalBombs;
  this.playerName = playerName;
  this.totalSlotsOpened = 0;
  this.begin;
  this.end;
  this.ended = false;
  this.victory = false;
  this.player = null;
}

function Game() {
  this.thisGame = null;
}

function Slot() {
  this.isBomb = false;
  this.isOpen = false;
  this.isVisible = false;
  this.processed = false;
  this.bombsAround = 0;
  this.y = null;
  this.x = null;
}

function reloadGame() {
  readInfo();

  field = new Array(thisGame.fieldLines);
  fillField();
  setBombs();
  drawField();
  closeModal();
}

function readInfo() {
  var form = document.forms["form_info"];

  var fieldLines = form["lines"].value;
  var fieldColumns = form["columns"].value;
  var totalBombs = form["bombs"].value;

  if (fieldLines < 1) {
    alert("Número de linhas inválido");
    return;
  }

  if (fieldColumns < 1) {
    alert("Número de colunas inválido");
    return;
  }

  if (totalBombs < 0) {
    alert("Número de bombas inválido");
    return;
  }

  if ((fieldLines * fieldColumns) < totalBombs) {
    alert("Quantidade de bombas maior que o tamanho do campo");
    return;
  }

  var playerName = form["player"].value;

  var thisPlayer = mapPlayersByName[playerName];
  if (thisPlayer == undefined) {
    thisPlayer = {
      name: playerName,
      victories: 0,
      defeats: 0
    };
    mapPlayersByName[playerName] = thisPlayer;
    players.push(thisPlayer);
  }

  thisGame = new GameSettings(fieldLines, fieldColumns, totalBombs, playerName);
  thisGame.player = thisPlayer;
  gameHistory.push(thisGame);
}

/**
 * Popula a matriz do tabuleiro
 */
function fillField() {
  for (var i = 0; i < thisGame.fieldLines; i++) {
    field[i] = new Array(thisGame.fieldColumns);

    for (var j = 0; j < thisGame.fieldColumns; j++) {
      slot = new Slot();
      slot.isBomb = false;
      slot.x = i;
      slot.y = j;

      field[i][j] = slot;
    }
  }
}

/**
 * Insere as bombas no tabuleiro
 */
function setBombs() {
  var bombsSetted = 0;

  while (bombsSetted < thisGame.totalBombs) {
    var i = getRandomPosition(thisGame.fieldLines);
    var j = getRandomPosition(thisGame.fieldColumns);
    var slot = field[i][j];

    if (!slot.isBomb) {
      slot.isBomb = true;
      bombsSetted++;
    }
  }

  for (var i = 0; i < 10; i++) {
    if (bombsSetted < thisGame.totalBombs) {
      var bomb = new Slot();
      bomb.isBomb = true;
      field[i][i] = bomb;
    }
  }
}

/**
 * Retorna um número aleatório valido para ser uma das posições de uma Bomba na Matriz do campo.
 */
function getRandomPosition(maxElementsFromMatrix) {
  var maxPosition = maxElementsFromMatrix - 1;
  // var position = (-0.3 + Math.random() * (maxPosition)) + 1;
  var position = ((Math.random() * (maxPosition)) * maxPosition) % maxPosition;

  if (position > maxPosition) {
    position = maxPosition;
  }
  if (position < 1) {
    position = 0;
  }

  return Math.round(position);
}
/**
 * Desenha do tabuleiro a partir da matriz
 */
function drawField() {
  var tableField = document.getElementById("bodyTableField");
  tableField.innerHTML = "";

  for (var i = 0; i < thisGame.fieldLines; i++) {
    var row = tableField.insertRow(i);

    for (var j = 0; j < thisGame.fieldColumns; j++) {
      var slot = field[i][j];
      var cell = row.insertCell(j);
      cell.setAttribute("onclick", "onSlotClicked(" + i + ", " + j + ")");

      if (slot != null) {

        if (slot.isOpen || slot.isVisible) {
          if (slot.bombsAround > 0) {
            cell.innerHTML = slot.bombsAround;
          }

          if (slot.isBomb) {
            cell.innerHTML = "";
            cell.className = "openBomb"
          } else {
            cell.className = "openSlot"
          }
        } else {
          cell.className = null;
        }

        if (slot.isVisible && !slot.isBomb && !slot.isOpen) {
          cell.className = null;
        }
      }

    }
  }
}

function onSlotClicked(i, j) {
  if (thisGame.ended) {
    alert("Jogo finalizado com " + (thisGame.victory ? "vitória" : "derrota")
      + ". Favor iniciar um novo jogo.")
    return;
  }
  if (thisGame.begin == undefined) {
    thisGame.begin = performance.now();
  }

  var clickedSlot = field[i][j];
  if (clickedSlot.isOpen) {
    return;
  }

  clickedSlot.isOpen = true;
  if (clickedSlot.isBomb) {
    youLose();
    makeSlotsVisible();
  } else {
    processSlot(i, j, true);
    if (allSlotsOpen()) {
      youWin();
    }
  }

  drawField();
}

/**
 * Processa o slot da posição especificada da matriz.
 *
 * @param i Índice da linha correspondente ao slot na matriz.
 * @param j Índice da coluna correspondente ao slot na matriz.
 * @param openSlots flag que indica se será necessário abrir os slots processados.
 */
function processSlot(i, j, openSlots) {
  var clickedSlot = field[i][j];
  if (!clickedSlot.processed) {
    clickedSlot.processed = true;

    if (openSlots) {
      clickedSlot.isOpen = true;
    }
    processingQueue = new Array();
    processingQueue.push(clickedSlot);
    processQueue(openSlots);
  }
}

/**
 * Processa recursivamente os slots que estão na fila de processamento,
 * adicionando os slots vizinhos à fila caso necessário.
 *
 * @param openSlots flag que indica se será necessário abrir os slots processados.
 */
function processQueue(openSlots) {

  var currentPosition = processingQueue.pop();

  if (currentPosition) {
    if (!currentPosition.isBomb) {
      currentPosition.bombsAround = numberOfBombsInNeighborhood(currentPosition.x, currentPosition.y);
      if (currentPosition.bombsAround == 0) {
        var unprocessedNeighboors = getUnprocessedNeighboors(currentPosition.x, currentPosition.y);
        for (var i = 0; i < unprocessedNeighboors.length; i++) {
          var current = unprocessedNeighboors[i];
          current.processed = true;
          if (openSlots) {
            current.isOpen = true;
          }
          processingQueue.push(current);
        }
      }
    }

    processQueue(openSlots);
  }
  return;
}

/**
 * Verifica se todos os slots do jogo foram abertos.
 */
function allSlotsOpen() {
  for (var i = 0; i < thisGame.fieldLines; i++) {
    for (var j = 0; j < thisGame.fieldColumns; j++) {
      var slot = field[i][j];
      if (!slot.isOpen && !slot.isBomb) {
        return false;
      }
    }
  }
  return true;
}

function getUnprocessedNeighboors(i, j) {
  var neighboors = getNeighboors(i, j);
  var unprocessedNeighboors = [];

  for (var i = 0; i < neighboors.length; i++) {
    var current = neighboors[i];
    if (!current.processed) {
      unprocessedNeighboors.push(current);
    }
  }

  return unprocessedNeighboors;
}

function numberOfBombsInNeighborhood(i, j) {
  var neighboors = getNeighboors(i, j);
  for (var i = 0; i < neighboors.length; i++) {
    var slot = neighboors[i];
  }
  var bombsAround = 0;
  for (var i = 0; i < neighboors.length; i++) {
    var position = neighboors[i];
    if (position.isBomb) {
      bombsAround++;
    }
  }

  return bombsAround;
}

function getElementAtPosition(i, j) {

 if (i >= 0 && j >= 0 && j < thisGame.fieldColumns && i < thisGame.fieldLines) {
    return field[i][j];
  } else {
    return;
  }
}

function getNeighboors(i, j) {

  var neighboors = [];

  var upperLeft = getElementAtPosition(i - 1, j - 1)
  var upper = getElementAtPosition(i, j - 1);
  var upperRight = getElementAtPosition(i + 1, j - 1);
  var left = getElementAtPosition(i - 1, j);
  var right = getElementAtPosition(i + 1, j);
  var underLeft = getElementAtPosition(i - 1, j + 1);
  var under = getElementAtPosition(i, j + 1);
  var underRight = getElementAtPosition(i + 1, j + 1);

  if (upperLeft) {
    neighboors.push(upperLeft);
  }

  if (upper) {
    neighboors.push(upper);
  }

  if (upperRight) {
    neighboors.push(upperRight);
  }

  if (left) {
    neighboors.push(left);
  }

  if (right) {
    neighboors.push(right);
  }

  if (underLeft) {
    neighboors.push(underLeft);
  }

  if (under) {
    neighboors.push(under);
  }

  if (underRight) {
    neighboors.push(underRight);
  }

  return neighboors;
}

/**
 * Processa e coloca todos os slots não abertos em modo de "Visualização".
 */
function makeSlotsVisible() {
  var processedSlots = new Array();

  for (var i = 0; i < thisGame.fieldLines; i++) {
    for (var j = 0; j < thisGame.fieldColumns; j++) {
      var slot = field[i][j];

      if (!slot.isOpen) {
        slot.isVisible = true;
        processSlot(i, j, false);
        processedSlots.push(slot);
      }
    }
  }

  // "desprocesso" os slots que foram processados durante esta chamada.
  // Necessário para não interferir no restante do jogo.
  for (var i = 0; i < processedSlots.length; i++) {
    processedSlots[i].processed = false;
  }
  drawField();
}

/**
 * Remove todos os slots do modo de "Visualização".
 */
function hideSlots() {
  for (var i = 0; i < thisGame.fieldLines; i++) {
    for (var j = 0; j < thisGame.fieldColumns; j++) {
      var slot = field[i][j];
      if (slot.isVisible) {
        slot.isVisible = false;
        slot.processed = false;
      }
    }
  }

  drawField();
}

function youLose() {
  thisGame.victory = false;
  thisGame.player.defeats++;
  endGame();
  alert("Você perdeu");
}

function youWin() {
  thisGame.victory = true;
  thisGame.player.victories++;
  endGame();
  alert("Você Ganhou");
}

function endGame() {
  thisGame.end = performance.now();
  thisGame.ended = true;
  countOpenSlots();
  showHistory();
  showScore();
}

function countOpenSlots() {
  for (var i = 0; i < thisGame.fieldLines; i++) {
    for (var j = 0; j < thisGame.fieldColumns; j++) {
      var slot = field[i][j];
      if (slot.isOpen) {
        thisGame.totalSlotsOpened++;
      }
    }
  }
}

function showHistory() {
  var tableHistory = document.getElementById("bodyTableHistory");
  tableHistory.innerHTML = "";

  var rowIndex = 0;
  for (var i = 0; i < gameHistory.length; i++) {
    var game = gameHistory[i];
    if (game.ended) {
      var row = tableHistory.insertRow(rowIndex++);
      row.insertCell(0).innerHTML = game.playerName;
      row.insertCell(1).innerHTML = game.fieldLines + " X " + game.fieldColumns;
      row.insertCell(2).innerHTML = game.totalBombs;
      var tempo = Math.round(((game.end - game.begin) / 1000) * 100) / 100;
      row.insertCell(3).innerHTML = isNaN(tempo) ? 0 : tempo;
      row.insertCell(4).innerHTML = game.totalSlotsOpened;
      row.insertCell(5).innerHTML = game.victory ? "Vitória" : "Derrota";
    }
  }
}

function showScore() {
  var tableScore = document.getElementById("bodyTableScore");
  tableScore.innerHTML = "";
  for (var i = 0; i < players.length; i++) {
    var row = tableScore.insertRow(i);

    var player = players[i];
    row.insertCell(0).innerHTML = player.name;
    row.insertCell(1).innerHTML = player.victories;
    row.insertCell(2).innerHTML = player.defeats;
  }
}

/*
 * Fecha a tela modal
 */
function closeModal(){
  document.getElementById('modal').style.display = "none";
}

/*
 * Abre a tela modal
 */
function openModal() {
  document.getElementById('modal').style.display = "block";
}
