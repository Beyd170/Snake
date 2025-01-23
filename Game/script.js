const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const canvasSize = 400;
let gameSpeed = 100;
let gameLoopInterval;
let snake = [{ x: 10, y: 10 }];
let food = {};
let dx = 0; // Изначально стоит
let dy = 0; // Изначально стоит
let score = 0;
let gameOverBool = false;
let gameStarted = false; // Флаг для контроля начала игры

function initGame() {
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    dx = 0; // Стоит в начале
    dy = 0; // Стоит в начале
    score = 0;
    gameOverBool = false;
    gameStarted = false; // Игра еще не началась
    draw(); // Рисуем начальный экран
}

function generateFood() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize));
    const y = Math.floor(Math.random() * (canvasSize / gridSize));
    return { x, y };
}

function update() {
    if (gameStarted) { // Обновляем только если игра началась
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            food = generateFood();
        } else {
            snake.pop();
        }

        if (head.x < 0 || head.x >= canvasSize / gridSize || head.y < 0 || head.y >= canvasSize / gridSize || checkSelfCollision()) {
            gameOver();
            return;
        }
    }
}

function checkSelfCollision() {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}


function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    if (!gameStarted) {
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Нажмите Пробел чтобы Начать', canvasSize / 2, canvasSize / 2);
        return; // Не рисуем змею если игра не началась
    }

    // Рисуем змею
    ctx.fillStyle = 'green';
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });

    // Рисуем еду
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText('Space: ' + score, 10, 20);
}

function gameOver() {
    clearInterval(gameLoopInterval);
    alert('Игра окончена! Ваш счет: ' + score);
    initGame();
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !gameStarted) {
        gameStarted = true;
        // задаем начальное направление движения змеи
        dx = 1;
        dy = 0;
        gameLoopInterval = setInterval(gameLoop, gameSpeed);
    } else if (gameStarted) {
        const key = event.key;
        switch (key) {
            case 'ArrowUp':
                if (dy !== 1) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
                if (dy !== -1) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
                if (dx !== 1) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
                if (dx !== -1) { dx = 1; dy = 0; }
                break;
        }
    }
});


initGame();

function gameLoop() {
    if (gameStarted && !gameOverBool) {
        update();
        draw();
    }
}