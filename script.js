var field;
var processingQueue = [];
var fieldLines = 10;
var fieldColumns = 10;
var totalBombs = 10;

function Slot() {
    this.isBomb = false;
    this.processed = false;
    this.bombsAround = 0;
    this.y = null;
    this.x = null;
}

function reloadGame(){
    field = new Array(fieldLines);
    setBombs();
    drawField();
}

/**
 * Popula a matriz do tabuleiro
 */
function setBombs(){
  var bombsSetted = 0;

  for (var i = 0; i < 10; i++) {
    field[i] = new Array(fieldColumns);

    if (bombsSetted < totalBombs){
      var bomb = new Slot();
      bomb.isBomb = true;
      field[i][i] = bomb;
    }

  }
  // while(bombsSetted < bombs){
  //
  // }
  // funcao distribuir as minas no tabuleiro{
  //   while bombas < bombas que eu preciso{
  //     tabuleiro[random1][random2] = bomba;
  //     bomba ++
  //   }
  // }
}

/**
 * Desenha do tabuleiro a partir da matriz
 */
function drawField(){
  var tableField = document.getElementById("bodyTableField");
  tableField.innerHTML = "";

  for (var i = 0; i < fieldLines; i++) {
    var row = tableField.insertRow(i);

    for (var j = 0; j < fieldColumns; j++) {
      var slot = field[i][j];
      var cell = row.insertCell(j);
      cell.setAttribute("onclick", "onSlotClicked(" + i + ", " + j + ")");
      if (slot != null ){
        cell.innerHTML =slot.isBomb;
      }
    }
  }
}

function onSlotClicked(i, j) {

  var clickedSlot = field[i][j];

  if (clickedSlot.isBomb) {
    youLose();
  }
  else {
    if (!clickedSlot.processed) {
      processingQueue.push(clickedSlot);
      processQueue();
    }
  }
}

function processQueue() {

  var currentPosition = processingQueue.pop();

  if (currentPosition) {
    if (!currentPosition.isBomb) {
        currentPosition.numberOfBombsInNeighborhood = numberOfBombsInNeighborhood(currentPosition.x, currentPosition.y);
        if (!(currentPosition.numberOfBombsInNeighborhood > 0)) {
          var unprocessedNeighboors = getUnprocessedNeighboors(currentPosition.x, currentPosition.y);
          for (var i = 0; i < unprocessedNeighboors.length; i++) {
            var current = unprocessedNeighboors[i];
            current.processed = true;
            processingQueue.push(current);
          }
        }
    }

    processQueue();
  }
  else {
    return;
  }
}

function youLose() {
  alert("Você perdeu");
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
  var bombsAround = 0;
  for (var i = 0; i < neighboors.length; i++) {
    var position = neighbors[i];
    if (position.isBomb) {
      bombsAround ++;
    }
  }

  return bombsAround;
}

function getNeighboors(i, j) {

    var neighboors = [];

    var upperLeft = field[i-1][j-1];
    var upper = [i][j-1];
    var upperRight = [i+1][j-1];
    var left = [i-1][j];
    var right = [i+1][j];
    var underLeft = [i-1][j+1];
    var under = [i][j+1];
    var underRight = [i+1][j+1];

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
