var field[][];
var processingQueue = [];

function Slot() {
    this.isBomb = false;
    this.processed = false;
    this.bombsAround = 0;
    this.y = null;
    this.x = null;
}

function reloadGame(){
    setBombs();
    drawField();
}

/**
 * Popula a matriz do tabuleiro
 */
function setBombs(){
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
    // td.onclick = "metodo(this, i, j)"
}

function onSlotClicked(i, j) {

  Slot clickedSlot = field[i][j];

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

  Slot currentPosition = processingQueue.pop();

  if (currentPosition) {
    if (!currentPosition.isBomb) {
        currentPosition.numberOfBombsInNeighborhood = numberOfBombsInNeighborhood(currentPosition.x, currentPosition.y);
        if (!(currentPosition.numberOfBombsInNeighborhood > 0)) {
          var unprocessedNeighboors = getUnprocessedNeighboors(currentPosition.x, currentPosition.y);
          for (var i = 0; i < unprocessedNeighboors.length; i++) {
            Slot current = unprocessedNeighboors[i];
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
    Slot current = neighboors[i];
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
    var Slot position = neighbors[i];
    if (position.isBomb) {
      bombsAround ++;
    }
  }

  return bombsAround;
}

function getNeighboors(i, j) {

    var neighboors = [];

    Slot upperLeft = field[i-1][j-1];
    Slot upper = i, j-1
    Slot upperRight = i+1, j-1
    Slot left = i-1, j
    Slot right = i+1, j
    Slot underLeft = i-1, j+1
    Slot under = i, j+1
    Slot underRight = i+1, j+1

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
