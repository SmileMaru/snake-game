const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d"); 
// getContext() method會回傳一個 canvas 的drawing context
// drawing context 可以用來在 canvas 畫圖

// snake
const unit = 20;
const row = canvas.height / unit; // 320/20 = 16
const column = canvas.width / unit; // 320/20 = 16

let snake = []; // array中的每個元素，都是一個object
// object的工作是，儲存身體的 x,y座標
function createSnake() {
    snake[0] = {
        x: 80,
        y: 0,
    };
    snake[1] = {
        x: 60,
        y: 0,
    };
    snake[2] = {
        x: 40,
        y: 0,
    };
    snake[3] = {
        x: 20,
        y: 0,
    };
}
// 執行最高分數 function
loadHighestScore();
// 初始遊戲分數
let score  = 0;
document.getElementById("myScore").innerHTML = "遊戲分數: " + score;

// 果實是一個 obj
class Fruit {
    constructor() {
        this.x = Math.floor(Math.random() * column) * unit; // 以unit 的倍數隨機出現在canvas
        this.y = Math.floor(Math.random() * row) * unit;
    }
    drawFruit() {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, unit, unit);
    }

    pickALocation() {
        let overlapping = false;
        let new_x;
        let new_y;

        // 確認蛇和果實有沒有重疊
        function checkOverlap(new_x, new_y) {
            for (let i = 0; i < snake.length; i++) {
                if (new_x == snake[i].x && new_y == snake[i].y){
                    overlapping = true;
                    return;
                } else {
                    overlapping = false;
                }
            }
        }

        do {
            new_x = Math.floor(Math.random() * column) * unit;
            new_y = Math.floor(Math.random() * row) * unit;
            checkOverlap(new_x, new_y); 
        } while (overlapping);

        this.x = new_x;
        this.y = new_y;
    }
}

// 初始設定
createSnake();
let myFruit = new Fruit();

// 控制方向
window.addEventListener("keydown", changeDirection); // 監聽keydown 改變方向的設定

let d = "Right";

function changeDirection(e){
    if (e.key == "ArrowRight" && d != "Left"){ // 向右
        d = "Right";
        // console.log("向右");
    } else if(e.key == "ArrowDown" && d != "Up"){ // 向下
        d = "Down";
        // console.log("向下");
    } else if(e.key == "ArrowLeft" && d != "Right"){ // 向左
        d = "Left";
        // console.log("向左");
    }else if(e.key == "ArrowUp" && d != "Down"){ // 向上
        d = "Up";
        // console.log("向上");
    }

    // 每次按上下左右鍵之後，在下一幀被畫出來之前，
    // 不接受任何的keydown 事件
    // 可防止連續按鍵導致蛇在邏輯上 game over
    window.removeEventListener("keydown", changeDirection);
}

function draw() {
// 每次畫圖之前，確認蛇有沒有咬到自己
for(let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
        clearInterval(myGame);
        alert("Game over");
        return;
    }
}


    ctx.fillStyle = "black"; // 背景設定為黑色
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
    // 左上角的位置(0, 0), 畫布的寬, 畫布的高

    myFruit.drawFruit();

    // 畫出蛇
    for (let i = 0; i < snake.length; i++) {
        if (i == 0) {
            ctx.fillStyle = '#55FFAD'; // 頭的顏色
        }else {
            ctx.fillStyle = "#BBFFDE"; // 身體的顏色
        }
        ctx.strokeStyle = "white"; // 身體框線顏色

        // 蛇的穿牆功能
        if (snake[i].x >= canvas.width) { // 如x 的位置 >= 畫布寬，回到x=0
            snake[i].x = 0;
        }
        if (snake[i].x < 0) { // 如x 的位置 < 0，回到x = 畫布寬 -unit
            snake[i].x = canvas.width - unit;
        }
        if (snake[i].y >= canvas.height) { // 如y 的位置 >= 畫布高，回到y=0
            snake[i].y = 0;
        }
        if (snake[i].y < 0) { // 如y < 0，畫布高 -unit
            snake[i].y = canvas.height - unit; 
        }

        // x, y, width, height
        ctx.fillRect(snake[i].x, snake[i].y, unit, unit); // 蛇身體填色
        ctx.strokeRect(snake[i].x, snake[i].y, unit, unit); // 身體框線填色
        }

    // 以目前的d變數方向，來決定蛇的下一幀要放在哪個座標
    let snakeX = snake[0].x; // snake[0]是一個物件，但snake[0].x是個number
    let snakeY = snake[0].y;
    if (d == "Left") {
        snakeX -= unit;
    }else if (d == "Up") {
        snakeY -= unit;
    }else if (d == "Right") {
        snakeX += unit;
    }else if (d == "Down") {
        snakeY += unit;
    }

    let newHead = {
        x: snakeX, // 上面算出來的值
        y: snakeY, // 上面算出來的值
    };

    // 確認蛇是否有吃到果實
    if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
        console.log("吃到了");
        myFruit.pickALocation(); // 重新隨機出現
        // 畫出新果實
        // 更新score
        score++;
        document.getElementById("myScore").innerHTML = "遊戲分數: " + score;
    }else {
        snake.pop();// 刪除最後面的值
    }
    
    snake.unshift(newHead); // 刪除最前面的值
    window.addEventListener("keydown", changeDirection);
}

// snake moving
let myGame = setInterval(draw, 100); // 每0.1秒就會執行一次 draw

function loadHighestScore() {
    console.log(localStorage.getItem("highestScore"));
    
}
