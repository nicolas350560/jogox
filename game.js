// Configuração do jogo
const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const playerHealthElement = document.getElementById('playerHealth');

let playerX = 375; // Posição inicial X do jogador
let playerY = 275; // Posição inicial Y do jogador
let playerHealth = 100;

const playerSpeed = 5;
const enemySpeed = 2;

// Inimigos e tiros
const enemies = [];
const bullets = [];
const bulletSpeed = 10;

// Função para criar inimigos
function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = `${Math.random() * (gameArea.offsetWidth - 40)}px`;
    enemy.style.top = `${Math.random() * (gameArea.offsetHeight - 40)}px`;
    gameArea.appendChild(enemy);
    enemies.push({element: enemy, x: parseFloat(enemy.style.left), y: parseFloat(enemy.style.top)});
}

// Função para desenhar o jogador
function drawPlayer() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

// Função para mover o jogador
function movePlayer() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            playerY = Math.max(0, playerY - playerSpeed);
        } else if (e.key === 'ArrowDown') {
            playerY = Math.min(gameArea.offsetHeight - 50, playerY + playerSpeed);
        } else if (e.key === 'ArrowLeft') {
            playerX = Math.max(0, playerX - playerSpeed);
        } else if (e.key === 'ArrowRight') {
            playerX = Math.min(gameArea.offsetWidth - 50, playerX + playerSpeed);
        }
        drawPlayer();
    });
}

// Função para disparar uma bala
function shootBullet() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = `${playerX + 25}px`; // Posição do meio do jogador
    bullet.style.top = `${playerY}px`;
    bullet.style.width = '10px';
    bullet.style.height = '20px';
    bullet.style.backgroundColor = 'yellow';
    gameArea.appendChild(bullet);
    bullets.push({element: bullet, x: playerX + 25, y: playerY, direction: 'up'});
}

// Função para mover as balas
function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed; // Move para cima

        // Atualiza a posição da bala
        bullet.element.style.top = `${bullet.y}px`;

        // Remove a bala se sair da tela
        if (bullet.y < 0) {
            gameArea.removeChild(bullet.element);
            bullets.splice(index, 1);
        }
    });
}

// Função para mover os inimigos
function moveEnemies() {
    enemies.forEach((enemy) => {
        // Movendo os inimigos para a posição do jogador
        if (enemy.x < playerX) enemy.x += enemySpeed;
        if (enemy.x > playerX) enemy.x -= enemySpeed;
        if (enemy.y < playerY) enemy.y += enemySpeed;
        if (enemy.y > playerY) enemy.y -= enemySpeed;

        enemy.element.style.left = `${enemy.x}px`;
        enemy.element.style.top = `${enemy.y}px`;

        // Verificar colisão entre inimigos e o jogador
        if (Math.abs(enemy.x - playerX) < 40 && Math.abs(enemy.y - playerY) < 40) {
            playerHealth -= 1;
            playerHealthElement.textContent = playerHealth;
            if (playerHealth <= 0) {
                alert('Game Over!');
                playerHealth = 100; // Resetando a vida para 100
                playerHealthElement.textContent = playerHealth;
                resetGame();
            }
        }
    });
}

// Função para verificar colisão entre balas e inimigos
function checkBulletCollisions() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (Math.abs(bullet.x - enemy.x) < 20 && Math.abs(bullet.y - enemy.y) < 20) {
                // Remove a bala e o inimigo
                gameArea.removeChild(bullet.element);
                gameArea.removeChild(enemy.element);
                bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
            }
        });
    });
}

// Função de reinício do jogo
function resetGame() {
    // Limpar inimigos e balas
    enemies.forEach(enemy => gameArea.removeChild(enemy.element));
    bullets.forEach(bullet => gameArea.removeChild(bullet.element));
    enemies.length = 0;
    bullets.length = 0;

    // Criar novos inimigos
    for (let i = 0; i < 5; i++) {
        createEnemy();
    }

    // Resetar jogador
    playerX = 375;
    playerY = 275;
    drawPlayer();
}

// Loop principal do jogo
function gameLoop() {
    moveBullets();
    moveEnemies();
    checkBulletCollisions();

    requestAnimationFrame(gameLoop);
}

// Começar o jogo
movePlayer();
setInterval(() => createEnemy(), 3000); // Criar inimigos a cada 3 segundos
setInterval(shootBullet, 500); // Atirar automaticamente a cada 0.5 segundos
gameLoop();

