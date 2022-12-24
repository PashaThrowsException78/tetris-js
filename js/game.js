const tetrisElem = document.getElementById("tetris");
const context = tetrisElem.getContext("2d");
const canvasNextFigureElem = document.getElementById("nextFigure");
const figureContext = canvasNextFigureElem.getContext("2d");
const scoreElem = document.getElementById("score");
const levelElem = document.getElementById("level");

// tetramino figures in different flips

const O = [
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ]
];


const I = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ],
    [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ]
];

const J = [
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ]
];

const L = [
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ]
];

const S = [
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];

const T = [
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];

const Z /* осуждаю */ = [
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]
    ]
];

// tetramino colors map
const TETRAMINOES = [
    [I, "#ff1191"],
    [J, "#4f0088"],
    [L, "#00ee00"],
    [O, "#f6ef04"],
    [S, "#ff0404"],
    [T, "#f56702"],
    [Z, "#02027a"]
];

const ROWS = 20;
const COL = COLUMN = 10;
const SQUARE_SIZE = squareSize = 25;
const CELL_COLOR = "#ffffff";

let isOver = false;
let score = 0;
let delay = 500;
let level = 1;

let nextFigureBoard = [];
let board = [];
for (let r = 0; r < ROWS; ++r) {
    board[r] = [];
    nextFigureBoard[r] = [];
    for (let c = 0; c < COL; ++c) {
        board[r][c] = CELL_COLOR;
        nextFigureBoard[r][c] = CELL_COLOR;
    }
}
document.addEventListener("keydown", onPressKeyboard);

drawBoard();
drawNextTetrominoBoard();

Tetromino.prototype.fill = function (color) {
    for (let r = 0; r < this.activeTetromino.length; ++r) {
        for (let c = 0; c < this.activeTetromino.length; ++c) {
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

Tetromino.prototype.draw = function () {
    this.fill(this.color);
}

Tetromino.prototype.clear = function () {
    this.fill(CELL_COLOR);
}

Tetromino.prototype.clearNextFigureBoard = function () {
    this.fillNextFigureBoard(CELL_COLOR);
}

Tetromino.prototype.fillNextFigureBoard = function (color) {
    for (let row = 0; row < this.activeTetromino.length; ++row) {
        for (let col = 0; col < this.activeTetromino.length; ++col) {
            if (this.activeTetromino[row][col]) {
                drawNextTetrominoSquare(this.x + col - 3, this.y + row + 1, color);
            }
        }
    }
}

Tetromino.prototype.drawNextFigureBoard = function () {
    this.fillNextFigureBoard(this.color);
}

Tetromino.prototype.moveDown = function () {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.clear();
        this.y++;
        this.draw();
    } else {
        this.lock();
        currentTetramino = nextTetramino;
        nextTetramino.clearNextFigureBoard();
        nextTetramino = randomTetramino();
        nextTetramino.drawNextFigureBoard();
    }
}

Tetromino.prototype.forceDrop = function () {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.clear();
        while (!this.collision(0, 1, this.activeTetromino)) {
            this.y++;
        }
        this.draw();
    } else {
        this.lock();
        currentTetramino = nextTetramino;
        nextTetramino.clearNextFigureBoard();
        nextTetramino = randomTetramino();
        nextTetramino.drawNextFigureBoard();
    }
}

Tetromino.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.clear();
        this.x++;
        this.draw();
    }
}

Tetromino.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.clear();
        this.x--;
        this.draw();
    }
}

Tetromino.prototype.rotate = function () {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let direction = 0;
    if (!this.collision(0, 0, nextPattern)) {
        if (this.x > COL / 2) {
            direction = -1;
        } else {
            direction = 1;
        }
    }
    if (!this.collision(direction, 0, nextPattern)) {
        this.clear();
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

Tetromino.prototype.lock = function () {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            if (!this.activeTetromino[r][c]) {
                continue;
            }
            if (this.y + r < 1) {
                endGame();
                isOver = true;
                break;
            }
            if (!isOver) {
                board[this.y + r][this.x + c] = this.color;
            }
        }
    }

    let completedRows = 0;
    for (let r = 0; r < ROWS; r++) {
        let isRowCompleted = true;
        for (let c = 0; c < COL; c++) {
            isRowCompleted = isRowCompleted && (board[r][c] !== CELL_COLOR);
        }
        if (isRowCompleted) {
            for (let y = r; y > 1; y--) {
                for (let c = 0; c < COL; c++) {
                    board[y][c] = board[y - 1][c];
                }
            }
            for (let c = 0; c < COL; c++) {
                board[0][c] = CELL_COLOR;
            }
            completedRows++;
        }
    }

    score += completedRows * 100;
    drawBoard();
    scoreElem.innerHTML = score;
}

Tetromino.prototype.collision = function (x, y, tetramino) {
    for (let row = 0; row < tetramino.length; row++) {
        for (let col = 0; col < tetramino.length; col++) {
            if (!tetramino[row][col]) {
                continue;
            }
            let newX = this.x + col + x;
            let newY = this.y + row + y;

            if (newX < 0 || newX >= COL || newY >= ROWS) {
                return true;
            }
            if (newY < 0) {
                continue;
            }
            if (board[newY][newX] !== CELL_COLOR) {
                return true;
            }
        }
    }
    return false;
}

let currentTetramino = randomTetramino();
let nextTetramino = randomTetramino();
nextTetramino.drawNextFigureBoard();

let dropStart = Date.now();

function randomTetramino() {
    let tetraminoBlank = Math.floor(Math.random() * TETRAMINOES.length);
    return new Tetromino(TETRAMINOES[tetraminoBlank][0], TETRAMINOES[tetraminoBlank][1]);
}

function onPressKeyboard(event) {
    if (event.code === "ArrowLeft") {
        currentTetramino.moveLeft();
    } else if (event.code === "ArrowUp") {
        currentTetramino.rotate();
    } else if (event.code === "ArrowRight") {
        currentTetramino.moveRight();
    } else if (event.code === "Space") {
        currentTetramino.forceDrop();
    }
    scoreElem.innerHTML = score;
}

function drop() {
    recalculateLevel();

    let dt = Date.now() - dropStart;
    if (dt >= delay) {
        currentTetramino.moveDown();
        dropStart = Date.now();
    }
    if (!isOver) {
        requestAnimationFrame(drop);
    }
}

function drawSquare(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    context.strokeRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
}

function drawBoard() {
    for (let row = 0; row < ROWS; ++row) {
        for (let col = 0; col < COL; ++col) {
            drawSquare(col, row, board[row][col]);
        }
    }
}

function drawNextTetrominoSquare(x, y, color) {
    figureContext.fillStyle = color;
    figureContext.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    figureContext.strokeRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
}

function drawNextTetrominoBoard() {
    for (let row = 0; row < ROWS; ++row) {
        for (let col = 0; col < COL; ++col) {
            drawNextTetrominoSquare(col, row, nextFigureBoard[row][col]);
        }
    }
}

function recalculateLevel() {
    if (level === 1 && score >= 100) {
        level = 2;
        delay = 100;
    } else if (level === 2 && score >= 2000) {
        level = 3;
        delay = 400;
    } else if (level === 3 && score >= 3000) {
        level = 4;
        delay = 300;
    } else if (level === 4 && score >= 5000) {
        level = 5;
        delay = 200;
    } else if (level === 5 && score >= 10000) {
        level = 6;
        delay = 100;
    } else if (level === 6 && score >= 20000) {
        level = 7;
        delay = 50;
    }

    levelElem.innerHTML = level;
}

function Tetromino(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;
    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.x = 3;
    this.y = 0;
}

