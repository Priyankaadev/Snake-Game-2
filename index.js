document.addEventListener("DOMContentLoaded", () => {
    const gameArena = document.getElementById("game-arena");
    const leaderboard = document.getElementById('leaderboard');
    const arenaSize = 500;
    const cellSize = 20;
    let scores = 0;
    let gameStarted = false;
    let food={x:300, y:200};
    let snake = [{x:160, y:200}, {x:140, y:200}, {x:120, y:200}];
    let dx = cellSize;
    let dy = 0;
    let gameSpeed = 200;
    let intervalId ;

    function drawDiv(x, y, className) {
        const div = document.createElement('div');
        div.classList.add(className);
        div.style.top = `${y}px`;
        div.style.left = `${x}px`;
        return div;
    }
    function drawLeaderboard() {
        leaderboard.innerHTML = '<h2>Leaderboard</h2><table><tr><th>Name</th><th>Score</th></tr>';
        scoreBoardList.forEach(entry => {
            const row = `<tr><td>${entry.name}</td><td>${entry.score}</td></tr>`;
            leaderboard.innerHTML += row;
        });
        leaderboard.innerHTML += '</table>';
    }
    function drawFoodAndSnake() {
        gameArena.innerHTML = ''; // if previously something is drawn remove it 
        //wipe out everything and redraw with new coordinates when snake moves.

        snake.forEach((snakeCell) => {
            const element = drawDiv(snakeCell.x, snakeCell.y, 'snake');
            gameArena.appendChild(element);
        })
        const foodElement = drawDiv(food.x, food.y, 'food');
        gameArena.appendChild(foodElement);

    }
    function moveFood(){
        let newX, newY;
        do{
            newX = Math.floor(Math.random()*((arenaSize - cellSize)/cellSize))*cellSize;
            newY = Math.floor(Math.random()*((arenaSize - cellSize)/cellSize))*cellSize;
        }while(snake.some(snakeCell => snakeCell.x == newX && snakeCell.y == newY))
            food={  x: newX, y: newY }
        }
    
    function updateSnake(){
         // calculate new coordinate the snake head will go to
         const newHead = { x: snake[0].x + dx, y: snake[0].y + dy }
         snake.unshift(newHead); //add the new head
         if (newHead.x == food.x && newHead.y == food.y) {
             //collision
             scores += 5;
             if (gameSpeed > 30) {
                 gameSpeed-=10; 
                 clearInterval(intervalId);
                 gameLoop()
             }
             
             moveFood();
         } else { snake.pop(); }
         //remove the last cell
    }
    function isGameOver(){
        //check snake body hit
        for(i=1; i<snake.length; i++){
            if(snake[0].x ==snake[i].x && snake[0].y == snake[i].y) return true; //game over
        }
        //check collision
        const isHittingLeftWall = snake[0].x < 0;
        const isHittingTopWall = snake[0].y < 0;
        const isHittingRightWall = snake[0].x >= arenaSize;
        const isHittingDownWall = snake[0].y >= arenaSize;

        return isHittingDownWall || isHittingLeftWall || isHittingRightWall || isHittingTopWall; //game over
    }
    function gameLoop(){
        intervalId = setInterval(()=>{
            if(!gameStarted) return;
            if(isGameOver()){
                gameStarted = false;                
              
                alert(`Game Over, Score = ${scores} `)
                window.location.reload();
                leaderboard()
                return;
            }
            drawFoodAndSnake();
            updateSnake()
            drawScoreBoard();
            
            scores++;
         
        },gameSpeed)
    }

    function changeDirection(e){
        e.preventDefault();
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;

        const keyPressed = e.keyCode;
        const isGoingUp = dy == -cellSize
        const isGoingDown = dy == cellSize
        const isGoingLeft = dx == -cellSize
        const isGoingRight = dx == cellSize;

        if (keyPressed == LEFT_KEY && !isGoingRight) {
            dy = 0; dx = -cellSize
        }
        if (keyPressed == RIGHT_KEY && !isGoingLeft) {
            dy = 0; dx = cellSize
        }
        if (keyPressed == UP_KEY && !isGoingDown) {
            dy = -cellSize; dx = 0
        }
        if (keyPressed == DOWN_KEY && !isGoingUp) {
            dy = cellSize; dx = 0
        }
    }
    function runGame(){
        if(!gameStarted){
            gameStarted = true;
            gameLoop();
            document.addEventListener('keydown', changeDirection)
        }
    }
    function initiateGame(){
        const score = document.createElement('div');
        score.id = 'scores';
        document.body.insertBefore(score, gameArena);

        const label = document.createElement('label');
        label.id = 'name';
        label.textContent = 'Player Name: '
        document.body.insertBefore(label, gameArena);
        const input = document.createElement('input');
        input.id = 'name';
        document.body.insertBefore(input, gameArena);
        
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.classList.add('start-button');
        document.body.appendChild(startButton);

        startButton.addEventListener('click', ()=>{
            startButton.style.display = 'none';
            runGame();

        })
    }
    initiateGame()
});