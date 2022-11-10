//Variables
let lastTime = 0;
let dropInterval = 1000; //valor por defecto de caida de la ficha
let dropCounter = 0;

const canvas = document.getElementById("tetris");
const contex = canvas.getContext("2d");
contex.scale(25,25); //Filas y columnas


//crea el tablero
function createMatriz(width, height) {
    const matriz = [];
    while (height--) {
        matriz.push(new Array(width).fill(0));
    }
    return matriz;
}
const grid = createMatriz(25, 25);

const player = {
    pos: {x:0, y:0},
    matriz: null
}


//crea las piezas 
function createPiece(tipo) {
    if(tipo === 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ];
    } else if (tipo === 'O') {
        return [
            [1, 1],
            [1, 1]
        ];        
    } else if (tipo === 'L') {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1]
        ];  
    } else if (tipo === 'J') {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0]
        ];  
    } else if (tipo === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]
        ];  
    } else if (tipo === 'S') {
        return [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ];  
    } else if (tipo === 'Z') {
        return [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ];  
    }
}

//recorre la matrix
function drawMatriz(matriz, offset) {
    matriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0) {
                contex.fillStyle = "red";
                contex.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

//Color del lienzo
function draw() {
    contex.fillStyle = "#000";
    contex.fillRect(0, 0, canvas.width, canvas.height);
    drawMatriz(grid, {x:0, y:0});
    drawMatriz(player.matriz, player.pos);
}
//Colición
function collide(grid, player) {
    const matriz = player.matriz;
    const offset = player.pos;
    for(let y = 0; y < matriz.length; y++) {
        for(let x = 0; x < matriz[y].length; x++) {
            if(matriz[y][x] !== 0 && (grid[y + offset.y] && grid[y + offset.y][x + offset.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}


//Dibuja la figura en el tablero y la deja estática
function merge(grid, player) {
    player.matriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                grid[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

//Resetea la posición de la ficha
function playerReset() {
    player.matriz = createPiece("L");
    player.pos.x = 0;
    player.pos.y = 0;
}
playerReset();
//movimiento de la ficha hacia abajo
function palyerDrop() {
    player.pos.y ++;
    dropCounter = 0;
    //Colisión
    if(collide(grid, player)) {
        player.pos.y --;
        //Ponemos estática la pieza
        merge(grid, player);
        //Reseteamos los valores de posición de las fichas 
        playerReset();
    }
    
}

//movimiento ficha hacia la derecha/izquierda
function playerMove(direction) {
    player.pos.x += direction;
    //colisión
    if(collide(grid, player)) {
        player.pos.x -= direction;
    }
}

//Rotación
function rotate (matriz) {
    for(let y = 0; y < matriz.length; y++) {
        for(let x = 0; x < y; x++) {
            [matriz[x][y], matriz[y][x]] = [matriz[y][x], matriz[x][y]];
        }
    }
    matriz.forEach(row => row.reverse());
}


//Rota la ficha
function playerRotate() {
    const pos = player.pos.x;
    rotate(player.matriz);
    //colición
    let offset = 1;
    while(collide(grid, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if(offset > player.matriz[0].length) {
            rotate(player.matriz);
            player.pos.x = pos;
            return;
        }
    } 


}

//Establece el temporizador
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if(dropCounter > dropInterval) {
        palyerDrop();
    }
    draw();
    requestAnimationFrame(update);
}
update();

//Añade el vento de las teclas
document.addEventListener("keydown",event =>{
    //console.log(event.key);
    if(event.key === "ArrowDown") {
        palyerDrop();
    } else if(event.key === "ArrowLeft") {
        playerMove(-1);
    }else if (event.key === "ArrowRight") {
        playerMove(1);
    } else if (event.key === "ArrowUp") {
        playerRotate();
    }
});



