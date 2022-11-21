// --------------------------------Atributos------------------------------------
let lastTime = 0; //guarda el tiempo anterior
let dropInterval = 1000; //intervalo por defecto de caida de la ficha
let dropCounter = 0;//cuenta el intervalo de tiempo transcurrido
let pause = true; //pausa al juego
//colores 
/* array of colors that will be used to paint each piece of the set */
const colors = [
    null,
    '#9f00ef',
    'yellow',
    'orange',
    'blue',
    '#00edef',
    'green',
    'red'
    ];

//Para mantener la información de las piezas y el puntaje
const player = {
    //posición por defecto
    pos: {x:0, y:0},
    //la pieza
    matriz: null,
    //puntaje
    score: 0,
    //nivel
    level: 0,
    //lineas
    lines: 0,
    //pieza siguiente
    next: null
}
// --------------------------Canvas Pieza Siguiente---------------------------- 
//siguiente pieza
/* creation of the canvas where the next piece will be placed */
const canvasNext = document.getElementById("nextPiece");
const contexNext = canvasNext.getContext("2d");
/*canvas size*/
contexNext.scale(19,19);

// -----------------------------Canvas Tetris --------------------------------- 
//seleccionamos el elemeto canvas por su id
const canvas = document.getElementById("tetris");
//creamos una constante para el contexto del canvas
const contex = canvas.getContext("2d");
//Establecemos las filas y columnas de nuestro tetris
var rows = 10; //Número de filas
var columns = 20; //Número de Columnas
//Establecemos el tamaño del canvas tetris acorde al tamaño de nuestra ventana de navegador
if(window.innerHeight >= 992){ //si el tamaño de la ventana es mayor o igual a  992 px
    canvas.width = 400; //el ancho del canvas es 400px
    canvas.height = 800; //el alto del canvas es 800px
    contex.scale(40, 40); //Escala de filas y columnas 40x40px
//si el tamaño de la ventana está entre 650px y 992px
} else if (window.innerHeight >=650 && window.innerHeight < 992){
    canvas.width = 300; //el ancho del canvas es 300px
    canvas.height = 600; // el alto del canvas es 600px
    contex.scale(30, 30);//Escala de filas y columnas 30x30px  
//si el tamaño de la ventana es menor a 650px
} else {
      canvas.width = 200;//el ancho del canvas es 200px
      canvas.height = 400; // el alto del canvas es 400px
      contex.scale(20, 20); //Escala de filas y columnas 20x20px  
}

//Función que recibe el ancho y alto y crea el tabletro de tetris en el canvas
function createMatriz(width, height) {
    //declaramos una array vacía
    const matriz = [];
    //se repite el ciclo hasta que retorne falso (height-- = 0)
    while (height--) {
        //A la matriz le insertamos un nuevo array con el tamaño del width y lo llenamos de ceros
        matriz.push(new Array(width).fill(0));
    }
    //retornamos la matriz
    return matriz;
}
//Creamos una matriz con las filas y columnas preestablecidas y la guardamos en la constante grid
const grid = createMatriz(rows, columns);


// -------------------------------- Piezas ------------------------------------

//crea las piezas 
/*function that will be called to create a part that will be invoked depending on which letter is displayed*/
function createPiece(tipo) {
    //Evaliamos si el argumento *tipo* cumple con lagunos de los casos
    switch (tipo) {
        //Si *tipo = "T"*
        case 'T':
            //Devolvemos una matriz con la ficha T para rellenar del color *colors[1]*
            return [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ];
        //Si *tipo = "O"*
        case 'O':
            //Devolvemos una matriz con la ficha O para rellenar del color *colors[2]*
            return [
                [2, 2],
                [2, 2]
            ]; 
        //Si *tipo = "L"*
        case 'L':
            //Devolvemos una matriz con la ficha L para rellenar del color *colors[3]*
            return [
                [0, 3, 0],
                [0, 3, 0],
                [0, 3, 3]
            ];
        //Si *tipo = "J"*
        case 'J':
            //Devolvemos una matriz con la ficha J para rellenar del color *colors[4]*
            return [
                [0, 4, 0],
                [0, 4, 0],
                [4, 4, 0]
            ];  
        //Si *tipo = "I"*
        case 'I':
            //Devolvemos una matriz con la ficha I para rellenar del color *colors[5]*
            return [
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0]
            ]; 
        //Si *tipo = "S"*
        case 'S':
            //Devolvemos una matriz con la ficha S para rellenar del color *colors[6]*
            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0]
            ]; 
        //Si *tipo = "Z"*
        case 'Z':
            //Devolvemos una matriz con la ficha Z para rellenar del color *colors[7]*
            return [
                [7, 7, 0],
                [0, 7, 7],
                [0, 0, 0]
            ];
    }
}

/* this function scrolls through the card and any non-zero number that it finds "Y" or "X" 
   it will paint it with the color that it gets from the COLORS array.*/
function drawMatriz(matriz, offset) {
    /* loops that traverse the main matrix by rows and columns to search for a value other than "0" in order to paint it with the corresponding color */    
    matriz.forEach((row, y) => {
        //recorremos nuestra filas y ejecutamos una función anonima que tiene por parámetros el valor del elemento(cuadrito) y su posición
        row.forEach((value, x) => {
            //Sien en el cuadrito hay un valor diferente de cero
            if(value !== 0) {
                //se determina el color según su valor y el array de colores (1,2,3,4,5,6,7)
                contex.fillStyle = colors[value];
                //Rellena el rectagunlo del color
                contex.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

//Dibuja la matriz de la siguiente pieza y la pieza siguiente
function drawMatrizNext(matriz, offset) {
    /* initial color of the canvas  */
    contexNext.fillStyle = "rgb(2, 10, 25)";
    /* position from which position to which position the canvas is to be painted */
    contexNext.fillRect(0, 0, canvasNext.width, canvasNext.height);

    /* loops that traverse the main matrix by rows and columns to search for a value other than "0" in order to paint it with the corresponding color */
    matriz.forEach((row, y) => {
        //recorre los elementos de cada fila
        row.forEach((value, x) => {
            //si el valor del elemento es diferente de cero
            if(value !== 0) {
                /* scrolls through the card and any non-zero number that is found "Y" or "X"
                will be painted with the color it gets from the COLORS array.*/
                contexNext.fillStyle = colors[value];
                //Rellena el rectagunlo del color
                contexNext.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

//Funcion que dibuja el tetris(canvas) y la matriz de la ficha siguiente
function draw() {
    /* It is saying from where to where the canvas will
    be painted both in height and width.  */
    contex.fillStyle = "#000";
    //Crea un rectangulo del tamaño del tetris(canvas) y lo rellena de color #000
    contex.fillRect(0, 0, canvas.width, canvas.height);
    /* call to the function that as a parameter is passed the matrix and the initial position where the part will be painted */
    drawMatriz(grid, {x:0, y:0});
    /* calls the function again in order to mark the piece on the board and make it visible to the user */
    drawMatriz(player.matriz, player.pos);
    //dibuja la matriz de la ficha siguiente
    drawMatrizNext(player.next, {x : 1, y : 1});
}

// --------------------------------- Colisiones --------------------------------
//Función que evita que colisione la pieza y se salga de pantalla, recibe la matriz del tetris (grid) y la ficha(player)
function collide(grid, player) {
    //guardamos la pieza en una constante
    const matriz = player.matriz;
    //Guardamos la posición de la pieza en una constante
    const offset = player.pos;
    //Recorremos la pieza que guardamos en *matriz* por sus filas
    for(let y = 0; y < matriz.length; y++) {
        //recorremos cada elemeto de las filas
        for(let x = 0; x < matriz[y].length; x++) {
            //si el elemento tiene un valor dieferente de cero y la nueva posición que quiere la pieza tiene un valor diferente de cero
            if(matriz[y][x] !== 0 && (grid[y + offset.y] && grid[y + offset.y][x + offset.x]) !== 0) {
                //Retorna que la ficha ha colisionado
                return true;
            }
        }
    }
    //Retorna que la ficha aún no ha colisionado
    return false;
}


//Función que dibuja la ficha(player.matriz) en el *grid* y la deja estática
function merge(grid, player) {
    //Recorremos las filas de la ficha
    player.matriz.forEach((row, y) => {
        //recorremos cada elemento de las filas
        row.forEach((value, x) => {
            //si el elemento tiene un valor diferente de cero
            if (value !== 0) {
                //En la posición de la grilla donde se encuentra ese elemento le ponemos el valor del elemento
                grid[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}
//Funcion para mostrar la modal y poner el fondo oscuro
function showModal(id) {
    //muestra la modal
    var modal = document.getElementById(id);
    modal.style.display = 'block';
    modal.classList.add('show');
    modal.setAttribute("role", "dialog");
    //Pone el fondo oscuro
    var body = document.getElementById("body");
    body.insertAdjacentHTML('afterend', '<div class="modal-backdrop"></div>');
    //retornamos la variable modal
    return modal;
}

// ---------------------------------- Jugar -----------------------------------
//Da play al juego
function playGame(id, modal){
    //selecciona el elemento por su id
    var play = document.getElementById(id);
    play.addEventListener('click', () => {
        //quita el modal
        modal.style.display = 'none';
        //quita el fondo oscuro
        document.querySelector('div.modal-backdrop').remove();
        //quita el pause al juego
        pausar();
        //solo para el botón de jugar de nuevo
        if(id == "btn-again-yes") {
            //deja en ceros la matriz grande
            grid.forEach(row => row.fill(0));
            //resetea el valor del puntaje
            player.score = 0;
            //resetea el valor del nivel
            player.level = 0;
            //resetea el valor de la lineas
            player.lines = 0;

            updateScore();
        } 
    });
}

// ------------------------------ Salir del juego ---------------------------
//función para salir del juego 
function exitGame(id){
    pausar();
    //selecciona el elemento por su id
    var play = document.getElementById(id);
    //le añadimos el evento click
    play.addEventListener('click', () => {
        //recargamos la página
        window.location.reload();
    });
}

// --------------------- Posición y forma de las fichas -----------------------
//Función que da la posición y forma de la ficha
function playerReset() {
    //piezas aleatorias
    const pieces = 'ILJOTSZ';
    //reduce el tiempo a medida que aumenta de niveles
    dropInterval = 1000 - (player.level * 50);
    //Si aún no existe una ficha siguiente
    if (player.next === null) {
        //creamos la ficha con forma aleatoria
        player.matriz = createPiece(pieces[pieces.length * Math.random() | 0]);
    //di ya existe una pieza siguiente
    } else {
        //ponemos la pieza siguiente en el canvas del tetris
        player.matriz = player.next;
    }
    //Creamos una nueva pieza y la ponemos en el canvas de pieza siguiente
    player.next = createPiece(pieces[pieces.length * Math.random() | 0]);
    //Centramos la posición de la pieza horizontalmente
    player.pos.x = (grid[0].length/2 | 0) - (player.matriz[0].length/2 | 0);
    //Ponemos la pieza verticalmente en la parte de arriba
    player.pos.y = 0;
    //Si la pieza colisiona, indica que el juego ha terminado
    if(collide(grid, player)) {
        //mostramos la ventana modal de *Game Over*
        var modal = showModal("myModal2");
        //añadimos el evento click al botón jugar de nuevo
        playGame("btn-again-yes",modal );
        //añadimos el evento click al botón no jugar de nuevo
        exitGame("btn-again-no");
    }

}

//Borra las lineas completadas
function gridSweep() {
    let rowCount = 1;
    outer : for (let y = grid.length - 1; y > 0; y--){
        for (let x = 0; x < grid[y].length; x++) {
            if(grid[y][x] === 0) {
                continue outer;
            }
            
        }

        const row = grid.splice(y,1)[0].fill(0);
        grid.unshift(row);
        y ++;
       
        //puntaje
        player.score += rowCount * 10;
        //lineas
        player.lines ++;
        //aumenta de nivel
        rowCount *= 2;
        if(player.lines % 3 === 0) player.level ++;
    }
}
//Ejcutamos la función player reset por primera vez
playerReset();


// -------------------- Datos del juego en Pantalla ----------------------------
//Función que muestra los valores de puntaje, lineas y nivel
function updateScore(){
    //Escribe el valor de puntaje en el elemento html con id="score"
    document.getElementById('score').innerHTML = player.score;
    //Escribe el valor de lineas en el elemento html con id="lines"
    document.getElementById('lines').innerHTML = player.lines;
    //Escribe el valor del nivel en el elemento html con id="level"
    document.getElementById('level').innerHTML = player.level;
}
//Ejecuta la función updateScore()
updateScore();

// ---------------------- Movimiento de las Fichas -----------------------------
//movimiento de la ficha hacia abajo
function playerDrop() {
    //Aumentamos la posición en la vertical de la ficha
    player.pos.y ++;
    //Reiniciamos el contador del intervalo de tiempo
    dropCounter = 0;
    //Si existe alguna colisión
    if(collide(grid, player)) {
        //Reestablecemos la pieza a su posición anterior
        player.pos.y --;
        //Ponemos estática la pieza
        merge(grid, player);
        //Reseteamos los valores de posición de las fichas 
        playerReset();
        //borra las lineas
        gridSweep();
        //actualizamos los valores en la vista (html)
        updateScore();
    }
    
}

//movimiento ficha hacia la izquierda 
function playerMoveLeft() { 
    //Disminuimos la posición de la ficha en la horizontal
    player.pos.x += -1; 
    //Si existe alguna colisión
    if(collide(grid, player)) { 
        //Reestablecemos la pieza a su posición anterior
        player.pos.x -= -1; 
    } 
} 
//movimiento ficha hacia la derecha 
function playerMoveRight() {
    //Aumentamos la posición de la ficha en la horizontal 
    player.pos.x += 1; 
    //Si existe alguna colisión
    if(collide(grid, player)) { 
        //Reestablecemos la pieza a su posición anterior
        player.pos.x -= 1; 
    } 
}

// ---------------------- Rotación de las fichas -----------------------------
//Función que rota la ficha(matriz)
function rotate (matriz) {
    //Recorremos la matriz
    for(let y = 0; y < matriz.length; y++) {
        for(let x = 0; x < y; x++) {
            //cambiamos el la filas por columnas y las columnas por filas
            [matriz[x][y], matriz[y][x]] = [matriz[y][x], matriz[x][y]];
        }
    }
    //Invierte la posición de los elementos dentro de las filas
    matriz.forEach(row => row.reverse());
}


//Permite rotar la ficha si no curre una colisión
function playerRotate() {
    //Guardamos la posición de la ficha,para que en caso de que exista una colisión se pueda devolver a la posición original
    const pos = player.pos.x;
    //Ejecutamos la funcion *rotate* y le pasamos la ficha como parámetro
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

// ---------------------- Tiempo del Juego -------------------------------
//Establece el temporizador (el tiempo por defecto es cero)
function update(time = 0) {
    //se ejecuta solo si el juego no está pausado
    if(!pause) {
        //La diferencia de tiempo entre en tiempo anterior y el actual
        const deltaTime = time - lastTime;
        //actualizamos el tiempo anterior al nuevo
        lastTime = time;
        //adicionamos la diferencia de tiempo al dropCounter
        dropCounter += deltaTime;
        //Si dropCounter es mayor que el intervalo por defecto
        if(dropCounter > dropInterval) {
            //Hacemos caer la ficha
            playerDrop();
        }
        //Pintamos y/o actualizamos el tetris(canvas)
        draw();
        //collback -> función recursiva, volvemos a ejecutar la función
        requestAnimationFrame(update);
    }
}
//Ejecutamos la función update() por pimera vez
update();

// ---------------------- Eventos del teclado -------------------------------
//Función que añade el evento keydown a las teclas
document.addEventListener("keydown",event =>{
    //Mecanismo de control que determina las funciones a ejecutar segun la llave de
    //la tecla que disparó el evento 
    switch (event.key) {
        //Si la tecla es fecha abajo
        case "ArrowDown":
            //Ejecutamos la función playerDrop() para hacer que la ficha baje más rápido
            playerDrop();
            //finaliza la ejecución de la función
            break;
        //Si la tecla es fecha izquierda
        case "ArrowLeft":
            //Ejecutamos la función playerMove(-1) para hacer que la ficha
            //se mueva una posición a la izquierda
            playerMoveLeft();
            //finaliza la ejecución de la función
            break;
        //Si la tecla es fecha derecha
        case "ArrowRight":
            //Ejecutamos la función playerMove(1) para hacer que la ficha
            //se mueva una posición a la derecha
            playerMoveRight();
            //finaliza la ejecución de la función
            break;
        //Si la tecla es fecha arriba
        case "ArrowUp":
            //Ejecutamos la función playerRotate() para hacer que la ficha rote
            playerRotate();
            //finaliza la ejecución de la función
            break;
    };
});

// ---------------------- Pausa del Juego -------------------------------
//Pausa el juego
function pausar() {
    //Si la variable pause es verdadera
    if(pause) {
        //cambia el valor de la variable pause a falso
        pause = false;
        //Restablece el movimiento de la ficha y el temporizador
        update();
        //Añade el evento click a los botones en la pantalla
        //Añade la función de bajar la ficha al dar click en el botón fecha abajo
        document.getElementById("down").addEventListener('click',playerDrop ); 
        //Añade la función de mover  a la izquierda la ficha al dar click en el botón fecha izquierda
        document.getElementById("left").addEventListener('click',playerMoveLeft); 
        //Añade la función de mover a la derecha la ficha al dar click en el botón fecha derecha
        document.getElementById("right").addEventListener('click',playerMoveRight);
        //Añade la función de rotar la ficha al  dar click al botón flecha de arriba 
        document.getElementById("up").addEventListener('click', playerRotate );
    //Si la variable pause es falsa
    } else {
        //cambia el valor de la variable pause a verdadero
        pause = true;
        //Remueve el evento click del botón flecha abajo
        document.getElementById("down").removeEventListener('click', playerDrop );
        //Remueve el evento click del botón flecha izquierda 
        document.getElementById("left").removeEventListener('click',playerMoveLeft);
        //Remueve el evento click del botón flecha derecha 
        document.getElementById("right").removeEventListener('click',playerMoveRight );
        //Remueve el evento click del botón flecha arriba 
        document.getElementById("up").removeEventListener('click', playerRotate );
    }
}

// --------------------- Despúes de que la Página Carga Completamente -------------------------------
//Función que se ejecuta al cargar completamente la página
window.onload = function() {
    //Muestra la modal el mesanje de bienvenida con las instrucciones para jugar
    var modal = showModal("myModal");
    //Añadimos el evento click al boton con el id="btn-play" para ocultar el mensaje
    //de bienvenida (modal) e iniciar el juego
    playGame("btn-play",modal);
}




     
