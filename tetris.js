const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.createElement("div");
scoreDisplay.style.position = "absolute";
scoreDisplay.style.top = "10px";
scoreDisplay.style.left = "50%";
scoreDisplay.style.transform = "translateX(-50%)";
scoreDisplay.style.color = "white";
scoreDisplay.style.fontSize = "20px";
scoreDisplay.style.fontFamily = "Arial, sans-serif";
scoreDisplay.style.background = "rgba(0, 0, 0, 0.5)";
scoreDisplay.style.padding = "10px";
scoreDisplay.style.borderRadius = "5px";
document.body.appendChild(scoreDisplay);

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

const COLORS = ["cyan", "blue", "orange", "yellow", "green", "purple", "red"];
const SHAPES = [
    [[1, 1, 1, 1]],
    [[1, 1, 1], [0, 0, 1]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1], [1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1, 1], [0, 1, 0]],
    [[1, 1, 0], [0, 1, 1]]
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentPiece = getRandomPiece();
let position = { x: 3, y: 0 };
let score = 0;
updateScore();

function getRandomPiece() {
    let type = Math.floor(Math.random() * SHAPES.length);
    return { shape: SHAPES[type], color: COLORS[type] };
}

function rotatePiece() {
    let rotated = currentPiece.shape[0].map((_, i) => currentPiece.shape.map(row => row[i])).reverse();
    if (isValidMove(rotated, 0, 0)) {
        currentPiece.shape = rotated;
    }
}

function drawGrid() {
    ctx.strokeStyle = "#444";
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
}

function drawPiece(piece, pos) {
    ctx.fillStyle = piece.color;
    piece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell) {
                ctx.fillRect((pos.x + c) * BLOCK_SIZE, (pos.y + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

function isValidMove(shape, offsetX, offsetY) {
    return shape.every((row, r) => 
        row.every((cell, c) => {
            if (!cell) return true;
            let newX = position.x + c + offsetX;
            let newY = position.y + r + offsetY;
            return newX >= 0 && newX < COLS && newY < ROWS && (newY < 0 || !board[newY][newX]);
        })
    );
}

function mergePiece() {
    currentPiece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell) {
                board[position.y + r][position.x + c] = currentPiece.color;
            }
        });
    });
    clearLines();
}

function clearLines() {
    let linesCleared = 0;
    board = board.filter(row => {
        if (row.every(cell => cell)) {
            linesCleared++;
            return false;
        }
        return true;
    });
    while (board.length < ROWS) {
        board.unshift(Array(COLS).fill(0));
    }
    score += linesCleared * 100;
    updateScore();
}

function updateScore() {
    scoreDisplay.innerText = `Score: ${score}`;
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    board.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell) {
                ctx.fillStyle = cell;
                ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
    drawPiece(currentPiece, position);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && isValidMove(currentPiece.shape, -1, 0)) position.x--;
    if (event.key === "ArrowRight" && isValidMove(currentPiece.shape, 1, 0)) position.x++;
    if (event.key === "ArrowDown" && isValidMove(currentPiece.shape, 0, 1)) position.y++;
    if (event.key === "ArrowUp") rotatePiece();
    drawBoard();
});

function gameLoop() {
    if (isValidMove(currentPiece.shape, 0, 1)) {
        position.y++;
    } else {
        mergePiece();
        currentPiece = getRandomPiece();
        position = { x: 3, y: 0 };
        if (!isValidMove(currentPiece.shape, 0, 0)) {
            alert("Game Over");
            board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        }
    }
    drawBoard();
    setTimeout(gameLoop, 500);
}

gameLoop();