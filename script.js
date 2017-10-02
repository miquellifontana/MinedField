var totalBombs = 3;
var fieldColumns = 10;
var fieldLines = 10;
var field;

function Slot() {
  this.isBomb = false;
  this.processed = false;
  this.bombsAround = 0;
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

function onSlotClicked(i, j){
  drawField();
}
