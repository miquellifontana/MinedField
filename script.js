var field[][];

function Slot() {
  this.isBomb = false;
  this.wasSued = false;
  this.bombsAround = 0;
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

function onSlotClicked(slot, i, j){
  drawField();
}
