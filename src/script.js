//Variables 
let lastTime = 0;
let dropInterval = 1000; //valor por defecto de caida de la ficha 
let dropCounter = 0;

const canvas = document.getElementById("tetris");
const canvasNext = document.getElementById("nextPiece");
const contex = canvas.getContext("2d");
const contexNext = canvasNext.getContext("2d")

contex.scale(25, 25); //Filas y columnas 
contexNext.scale(19,19)
const grid = createMatriz(25, 25);
const color = [
    null,
    'red',
    'blue',
    'violet',
    'green',
    'purple',
    'orange',
    'pink'
]
const player = {
    pos: { x: 0, y: 0 },
    matriz: null,
    next:null,
    score: 0,
    lineas: 0,
    level: 0
}

function createPiece(tipo) {
    if (tipo === "T") {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ]
    } else if (tipo === "O") {
        return [
            [2, 2],
            [2, 2],
        ]
    } else if (tipo === "L") {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3]
        ]
    } else if (tipo === "J") {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0]
        ]
    } else if (tipo === "I") {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0]
        ]
    } else if (tipo === "S") {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0]
        ]
    } else if (tipo === "Z") {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]
        ]
    }
}


//crea el tablero 
function createMatriz(width, height) {
    const matriz = [];
    while (height--) {
        matriz.push(new Array(width).fill(0));
    }
    return matriz;
}



//recorre la matrix 
function drawMatriz(matriz, offset) {
    matriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                contex.fillStyle = color[value];
                contex.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function drawMatrizNext(matriz, offset){
    contexNext.fillStyle = "#020a19";
    contexNext.fillRect(0,0, canvasNext.width, canvasNext.height);

    matriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                contexNext.fillStyle = color[value];
                contexNext.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function colider(grid, player) {
    const matriz = player.matriz;
    const offset = player.pos;

    for (let y = 0; y < matriz.length; y++) {
        for (let x = 0; x < matriz[y].length; x++) {
            if (matriz[y][x] !== 0 && (grid[y + offset.y] && grid[y + offset.y][x + offset.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function merge(grid, player) {
    player.matriz.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                grid[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function gridSweep() {
    let rowCount = 1;
    outer: for (let y = grid.length - 1; y > 0; --y) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 0) {
                continue outer;

            }
        }
        const row = grid.splice(y, 1)[0].fill(0);
        grid.unshift(row);
        y++

        player.score += rowCount * 10;
        player.lineas++;
        rowCount *= 2;
        if (player.lineas % 3 === 0) player.level++;
    }
}



//Color del lienzo 
function draw() {
    contex.fillStyle = "#000";
    contex.fillRect(0, 0, canvas.width, canvas.height);
    drawMatriz(grid, { x: 0, y: 0 });
    drawMatriz(player.matriz, player.pos);
    drawMatrizNext(player.next, {x: 1, y:1});
}

//movimiento de la ficha hacia abajo 
function palyerDrop() {
    player.pos.y++;
    if (colider(grid, player)) {
        player.pos.y--;
        merge(grid, player);
        playerReset();
        gridSweep()
        updateScore();
    }
    dropCounter = 0;
}


function playerMove(direccion) {
    player.pos.x += direccion;
    if (colider(grid, player)) {
        player.pos.x -= direccion;
    }
}

function playerRotate() {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matriz);
    while (colider(grid, player)) {
        player.pos.x += offset;
        offset = - (offset + (offset > 0 ? 1 : -1));
        if (offset > player.matriz[0].length) {
            rotate(player.matriz);
            player.pos.x = pos;
            return;
        }
    }

}

function rotate(matriz) {
    for (let y = 0; y < matriz.length; y++) {
        for (let x = 0; x < y; x++) {
            [matriz[x][y], matriz[y][x]] = [matriz[y][x], matriz[x][y]];
        }
    }

    matriz.forEach(row => row.reverse());
}

function playerReset() {
    const pieces = 'ILJOTSZ'
    dropInterval = 1000 - (player.level*100);
    //dibuja la pieza en la matriz de siguiente y/o grande
    if (player.next === null) {
        player.matriz = createPiece(pieces[pieces.length * Math.random() | 0]);
    } else {
        player.matriz = player.next;
    }
    player.next = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.x = (grid[0].length / 2 | 0) - (player.matriz[0].length / 2 | 0);
    player.pos.y = 0;
    if(colider (grid, player)){
        grid.forEach(row => row.fill(0));
        player.score = 0;
        player.level = 0;
        player.lineas = 0;
        updateScore();
    }

}

//Añade el vento de tecla abajo 
document.addEventListener("keydown", event => {
    console.log(event.key);
    if (event.key === "ArrowDown") {
        palyerDrop();
    } else if (event.key === "ArrowLeft") {
        playerMove(-1);
    } else if (event.key === "ArrowRight") {
        playerMove(1);
    } else if (event.key === "ArrowUp") {
        playerRotate();
    }
});

function updateScore() {
    document.getElementById("score").innerHTML = player.score;
    document.getElementById("lineas").innerHTML = player.lineas;
    document.getElementById("level").innerHTML = player.level;
}

//Establece el temporizador 
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        palyerDrop();
    }
    draw();
    requestAnimationFrame(update);
}

playerReset()
update();