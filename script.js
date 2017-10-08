var field;
var processingQueue = [];
var fieldLines = 1;
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

      field[i][6] = bomb;
    }

  }

  for (var i = 0; i < fieldLines; i++) {
    for (var j = 0; j < fieldColumns; j++) {
      var slot = field[i][j];
      if (!slot) {
        slot = new Slot();
        slot.isBomb = false;
        field[i][j] = slot;
      }
      slot.x = i;
      slot.y = j;
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
        if (slot.processed) {
          if (slot.bombsAround > 0) {
            cell.innerHTML = slot.bombsAround;
          }
          else if (slot.isBomb){
            cell.innerHTML = "Bomb";
          }
        }
      }
    }
  }
}

function onSlotClicked(i, j) {

  var clickedSlot = field[i][j];
  if (clickedSlot.isBomb) {
    youLose();
    showBombs();
  }
  else {
    processSlot(i, j);
    if (allFieldsProcessed()) {
      alert("You win");
    }
  }
}

function processSlot(i, j) {
  var clickedSlot = field[i][j];
  if (!clickedSlot.processed) {
    clickedSlot.processed = true;
    processingQueue.push(clickedSlot);
    processQueue();
  }
}

function processQueue() {

  var currentPosition = processingQueue.pop();

  if (currentPosition) {
    if (!currentPosition.isBomb) {
        currentPosition.bombsAround = numberOfBombsInNeighborhood(currentPosition.x, currentPosition.y);
        if (currentPosition.bombsAround == 0) {
          alert("sem bombas em volta");
          var unprocessedNeighboors = getUnprocessedNeighboors(currentPosition.x, currentPosition.y);
          alert(unprocessedNeighboors);
          for (var i = 0; i < unprocessedNeighboors.length; i++) {
            var current = unprocessedNeighboors[i];
            current.processed = true;
            processingQueue.push(current);
          }
        }
    }

    // alert(processingQueue);
    drawField();
    processQueue();
  }
  return;
}

function allFieldsProcessed() {
  for (var i = 0; i < fieldLines; i++) {
    for (var j = 0; j < fieldColumns; j++) {
      var slot = field[i][j];
      if (!slot.processed && !slot.isBomb) {
        return false;
      }
    }
  }
  return true;
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
  for (var i = 0; i < neighboors.length; i++) {
    var slot = neighboors[i];
  }
  var bombsAround = 0;
  for (var i = 0; i < neighboors.length; i++) {
    var position = neighboors[i];
    if (position.isBomb) {
      bombsAround ++;
    }
  }

  return bombsAround;
}

function getElementAtPosition(i, j) {

  if (i >= 0 && j >= 0 && i < fieldColumns && j < fieldLines) {
    alert("Tem elemento");
    return field[i][j];
  }
  else {
    alert("Nao tem elemento i:" + i + " j:" + j);
    return;
  }
}

function getNeighboors(i, j) {

    var neighboors = [];

    var upperLeft = getElementAtPosition(i-1, j-1)
    var upper = getElementAtPosition(i, j-1);
    var upperRight = getElementAtPosition(i+1, j-1);
    var left = getElementAtPosition(i-1, j);
    var right = getElementAtPosition(i+1, j);
    var underLeft = getElementAtPosition(i-1, j+1);
    var under = getElementAtPosition(i, j+1);
    var underRight = getElementAtPosition(i+1, j+1);

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

function showBombs() {
  for (var i = 0; i < fieldLines; i++) {
    for (var j = 0; j < fieldColumns; j++) {
      var slot = field[i][j];
      if (!slot.processed) {
        processSlot(i, j);
      }
    }
  }
}
