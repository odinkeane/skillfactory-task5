const SIZE_X = 10;
const SIZE_Y = 10;
const SNAKE_SIZE = 2;
const LevelSpeed = {
    'easy': 500,
    'medium': 150,
    'hard': 75
};
let dirX = 0;
let dirY = 0;


class GameObject {
    static sizeObject = 50;
    static getPosition(element, add = 0) {
        return Number(element.replace('px', '')) + add;
    }

    constructor(x, y, color, place) {
        this.x = x;
        this.y = y;
        this.size = GameObject.sizeObject;
        this.element = document.createElement('div');
        this.color = color;
        this.place = place;
        this._create();
    }
    _create() {
        const style = this.element.style;
        style.position = 'absolute';
        style.left = `${this.x}px`;
        style.top = `${this.y}px`;
        style.width = `${this.size}px`;
        style.height = `${this.size}px`;
        style.background = this.color;
        style.border = "1px solid black";
        style.boxSizing = "border-box";
    }
    _drawNewPosition() {
        const style = this.element.style;
        style.left = `${this.x}px`;
        style.top = `${this.y}px`;
    }


    setCoord(newPosition) {

        this.x = newPosition[0];
        this.y = newPosition[1];

        this._drawNewPosition();
    }
    getCoord() {
        return [Number(this.x), Number(this.y)];
    }
    _in(object) {
        return (this.x <= object[0] && object[0] < this.x + this.size && this.y <= object[1] && object[1] < this.y + this.size) ? true : false;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    hide() {
        this.element.style.display = "none";
    }
    show() {
        this.element.style.display = "block";
    }

}

class Cell extends GameObject {
    constructor(x, y, color, place) {
        super(x, y, color, place);
        place.appendChild(this.element);
    }
}
class Apple extends GameObject {
    constructor(place) {
        const x = Math.floor(Math.random() * SIZE_X) * GameObject.sizeObject;
        const y = Math.floor(Math.random() * SIZE_Y) * GameObject.sizeObject;
        const halfSize = GameObject.sizeObject / 1.25;
        const linearGradient = 'linear-gradient(to top, rgba(128,0,0,0.7) 50%,rgba(255,128,128,0.7))'
        super(x + halfSize / 8, y + halfSize / 8, linearGradient, place);
        this._setAddStyle(halfSize);
        this.halfSize = halfSize;
        place.appendChild(this.element);
    }
    _setAddStyle(halfSize) {
        const style = this.element.style;
        let scale = 1;
        let delta = 0.03;
        style.width = halfSize + 'px';
        style.height = halfSize + 'px';
        style.borderRadius = '50%';
        style.boxShadow = '1px 2px 5px rgba(0,0,0,0.9)';
        setInterval(() => {
            if (scale > 1 || scale < 0.9) { delta = -delta; }
            scale += delta;
            style.transform = `scale(${scale})`;
            // console.log(scale);
        }, 70);
    }

    _getObjectsLocation(objects) {
        let locations = [];
        for (let object of objects) {
            locations.push(object.getCoord());
        }
        return locations;
    }


    setNewCoord(objects) {
        const snakeLocation = this._getObjectsLocation(objects);
        let inSnake = true;
        let newX;
        let newY;
        while (inSnake) {
            inSnake = false;
            newX = Math.floor(Math.random() * SIZE_X) * this.size;
            newY = Math.floor(Math.random() * SIZE_Y) * this.size;
            for (let location of snakeLocation) {
                if (newX == location[0] && newY == location[1]) inSnake = true;
            }
        }
        this.setCoord([newX + this.halfSize / 8, newY + this.halfSize / 8]);
    }
}

class Snake extends GameObject {
    constructor(x, y, place) {
        const color = 'radial-gradient(circle, rgba(254,237,214,0.3), rgba(167,166,206, 0.3)), url("snake-scale.jpg")';
        super(x, y, color, place)
        this._setAddStyle();
        this.place = place;
        this.place.appendChild(this.element);
    }
    _setAddStyle() {
        const style = this.element.style;
        style.borderRadius = '50%';
        style.backgroundSize = 'cover';
    }
    deleteVisibleElement() {
        this.place.removeChild(this.element);
    }

}

class SnakeHead extends Snake {
    constructor(x, y, place) {
        super(x, y, place);
        const color = 'radial-gradient(circle, rgba(54,37,214,0.7), rgba(67,66,206, 0.7)), url("snake-scale.jpg")'
        this.element.style.background = color;
        this.quanApple = 0;
    }

    move(dirX, dirY) {
        this.x += this.size * dirX;
        this.y += this.size * dirY;
        this._drawNewPosition();
        // console.log(this.x, this.y);
    }

    eat(apple) {
        return this._in(apple);
    }
    crossroad(elements, start = 0) {
        for (let i = 1; i < elements.length; i++) {
            if (this._in([elements[i].getX(), elements[i].getY()])) {
                return true;
            }
        }
        return false;
    }

    outOfField(x, y) {
        return (this.x < 0 || this.x >= x * this.size || this.y < 0 || this.y >= y * this.size)
    }

}

class gameOverCell extends Cell {
    constructor(x, y, color, place) {
        super(0, 0, color, place);
        this._setStyleParameters(x, y)
    }
    _setStyleParameters(x, y) {
        const style = this.element.style;
        const div = document.createElement('div');
        div.innerHTML = "You lose<br>Press R to restart";
        div.style.padding = "25px 50px";
        div.style.borderRadius = "25px";
        div.style.background = "rgba(0,0,0,0.9)";
        this.element.appendChild(div);
        style.width = `${x}px`;
        style.height = `${x}px`;
        style.display = "flex";
        style.alignItems = "center";
        style.justifyContent = "center";
        style.zIndex = 10;
        style.textAlign = "center";
        style.color = "rgb(128,10,20)";
        style.textShadow = "0px 0px 1px darkgreen"
        style.fontSize = "32px";
        style.fontWeight = "bold";
        style.display = "none";
    }

    show() {
        this.element.style.display = "flex";
    }

    hide() {
        this.element.style.display = "none";
    }

}


class Field {
    constructor(place, sizeX = SIZE_X, sizeY = SIZE_Y) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.Cells = [];
        this.cellSize = (window.innerHeight - 24) / this.sizeY;
        GameObject.sizeObject = this.cellSize;
        this.place = place;
        this._generateField();
        this._generateBack();
        this.gameOverCell = new gameOverCell(this.sizeX * this.cellSize, this.sizeY * this.cellSize, "rgba(0,0,0,0.7)", this.place);

    }


    showGameOverList() {
        this.gameOverCell.show();
    }
    hideGameOverList() {
        this.gameOverCell.hide();
    }

    _generateBack() {
        let style = this.place.style;
        style.width = this.sizeX * this.cellSize + 'px';
        style.height = this.sizeX * this.cellSize + 'px';
        style.border = "3px solid black";
        style.background = 'url(snake.jpg)';
    }

    _generateField() {
        for (let i = 0; i < this.sizeX; i++) {
            let newRow = [];
            for (let j = 0; j < this.sizeY; j++) {
                const cell = new Cell(this.cellSize * i, this.cellSize * j, ((j + i) % 2) ? 'rgba(52,128,52,0.4)' : 'rgba(0,128,0,0.4)', this.place);
                newRow.push(cell);
            }
            this.Cells.push(newRow);
        }
    }

    getCellSize() {
        return this.cellSize;
    }



}

class Game {
    constructor(objects, sizeX = 10, sizeY = 10, timer = 500, through = false, speedUp = false) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.place = objects.place;
        this.scoreNow = objects.now;
        this.scoreBest = objects.best;
        this.zeroCount = 4;
        this.field = new Field(this.place, this.sizeX, this.sizeY);
        this.apple = new Apple(this.place);
        this.snake = [];
        this.quanApple = 0;
        this.quanAppleBest = this._getBestScore();
        this.scoreNow.innerHTML = this._setScore(this.quanApple, this.zeroCount);
        this.scoreBest.innerHTML = this._setScore(this.quanAppleBest, this.zeroCount);
        this.timer = timer;
        this.actualTimer = timer;
        this.through = through;
        this.speedUp = speedUp;
        this.isRun = true;
        this._addListenerPress();
    }


    _setScore(score, zeroQuan) {
        return String(score).padStart(zeroQuan, '0');
    }

    _getBestScore() {
        let bestScore = localStorage.getItem('best-score');
        if (bestScore == null) bestScore = 0;
        return bestScore;
    }


    _gameOver() {
        this.isRun = false;
        this.apple.hide();
        for (let snakeElement of this.snake) {
            snakeElement.hide();
        }
        this.field.showGameOverList();
    }

    _inVariants(key, elements) {
        for (let e of elements) {
            if (e == key) { return true; }
        }
        return false;
    }




    _setParameters() {
        const x = Math.floor(this.sizeX / 2 - 1) * GameObject.sizeObject;
        const y = Math.floor(this.sizeY / 2 - 1) * GameObject.sizeObject;
        for (let i = 0; i < SNAKE_SIZE; i++) {
            if (this.snake.length == 0) {
                this.snake.push(new SnakeHead(x + i * GameObject.sizeObject, y, this.place));
                continue;
            }
            this.snake.push(new Snake(x + i * GameObject.sizeObject, y, this.place));
        }
    }

    _deleteSnake() {
        for (let snake of this.snake) {
            snake.deleteVisibleElement();
        }
        while (this.snake.length > 0) {
            this.snake.pop();
        }
    }


    _newGame() {
        if (this.snake.length > 0) {
            this._deleteSnake();
        }
        dirX = 0;
        dirY = 0;
        this._setParameters();
        this.apple.setNewCoord(this.snake);
        this.timer = this.actualTimer;
        this.apple.show();
        this.field.hideGameOverList();
        this.scoreNow.innerHTML = this._setScore(this.quanApple = 0, this.zeroCount);
        this.isRun = true;
    }



    _addListenerPress() {
        window.addEventListener('keypress', (event) => {
            if (this._inVariants(event.key, 'wWцЦ')) { dirY = -1; dirX = 0; }
            if (this._inVariants(event.key, 'sSыЫ')) { dirY = 1; dirX = 0; }
            if (this._inVariants(event.key, 'aAфФ')) { dirY = 0; dirX = -1; }
            if (this._inVariants(event.key, 'dDвВ')) { dirY = 0; dirX = 1; }
            if (event.key == ' ') { dirY = 0; dirX = 0; }
            if (this._inVariants(event.key, 'кКrR')) { this._newGame(); }
        });
    }

    setHaveWall(haveWall) {
        this.through = !haveWall;
        console.log(this.through);
        if (dirX != 0 || dirY != 0 || this.quanApple > 0) {
            this._newGame();
        }
    }
    setSpeedUp(haveSpeedUp) {
        this.speedUp = haveSpeedUp;
        if (dirX != 0 || dirY != 0 || this.quanApple > 0) {
            this._newGame();
        }
    }
    setLevel(level) {
        this.timer = level;
        this.actualTimer = this.timer;
        clearInterval(this.running);
        this.run();
    }


    run(newGame = 1) {
        if (newGame){
            this._newGame();
        }
        
        this.running = setInterval(() => {
            if (this.isRun) {
                if (!(dirX === 0 && dirY === 0)) {
                    for (let i = this.snake.length - 1; i > 0; i--) {
                        this.snake[i].setCoord(this.snake[i - 1].getCoord());
                    }
                    this.snake[0].move(dirX, dirY);

                    if (this.snake[0].eat(this.apple.getCoord())) {
                        this.quanApple += Math.floor(((500 - this.timer / 2)) / 100) + 1;
                        this.scoreNow.innerHTML = this._setScore(this.quanApple, this.zeroCount);
                        if (this.quanApple > this.quanAppleBest) {
                            this.quanAppleBest = this.quanApple;
                            this.scoreBest.innerHTML = this._setScore(this.quanAppleBest, this.zeroCount);
                            localStorage.setItem('best-score', this.quanAppleBest);
                        }
                        this.snake.push(new Snake(this.snake[this.snake.length - 1].getX(), this.snake[this.snake.length - 1].getY(), this.place));
                        this.apple.setNewCoord(this.snake);
                        if (this.speedUp) {
                            this.timer -= (this.timer / 50);
                            console.log(this.timer);
                            clearInterval(this.running);
                            this.run(0);
                        }

                    }

                    if (this.snake[0].outOfField(this.sizeX, this.sizeY)) {
                        console.log(this.through);
                        if (this.through) {

                            if (this.snake[0].getX() < 0) this.snake[0].setCoord([(this.sizeX - 1) * this.field.getCellSize(), this.snake[0].getY()]);
                            if (this.snake[0].getX() >= this.sizeX * this.field.getCellSize()) this.snake[0].setCoord([0, this.snake[0].getY()]);
                            if (this.snake[0].getY() < 0) this.snake[0].setCoord([this.snake[0].getX(), (this.sizeY - 1) * this.field.getCellSize()]);
                            if (this.snake[0].getY() >= this.sizeY * this.field.getCellSize()) this.snake[0].setCoord([this.snake[0].getX(), 0]);

                        } else {
                            this._gameOver();
                        }
                    }

                    if (this.snake[0].crossroad(this.snake, 1)) {
                        this._gameOver();
                    }
                }
            }
        }, this.timer);
    }
}


const fieldGame = document.querySelector('.field');
const scoreNow = document.querySelector('.score-now');
const scoreBest = document.querySelector('.score-best');

const control = document.querySelector('.control');
const gameSettings = document.querySelector('.game-settings');
const controlDiv = document.querySelector('.control-div');
const gameSettingsDiv = document.querySelector('.game-settings-div');

control.addEventListener('click', () => {
    controlDiv.style.top = (controlDiv.style.top == "100%") ? "0%" : "100%";
    gameSettingsDiv.style.top = "100%"
});
gameSettings.addEventListener('click', () => {
    gameSettingsDiv.style.top = (gameSettingsDiv.style.top == "100%") ? "0%" : "100%";
    controlDiv.style.top = "100%";
});

const wallsCheck = document.querySelector('.walls');
let haveWall = true;
wallsCheck.addEventListener('change', () => {
    haveWall = !haveWall;
    if (!haveWall) { wallsCheck.parentNode.classList.add('choose'); }
    else { wallsCheck.parentNode.classList.remove('choose'); }
    game.setHaveWall(haveWall);
});
const speedUpCheck = document.querySelector('.speed');
let haveSpeedUp = false;
speedUpCheck.addEventListener('change', () => {
    haveSpeedUp = !haveSpeedUp;
    console.log(haveSpeedUp);
    if (haveSpeedUp) { speedUpCheck.parentNode.classList.add('choose'); }
    else { speedUpCheck.parentNode.classList.remove('choose'); }
    game.setSpeedUp(haveSpeedUp);
});
let level = 'easy';
let speed = LevelSpeed[level];
function changeLevel(newLevel) {
    document.querySelector(`.${level}`).classList.remove('choose');
    level = newLevel;
    document.querySelector(`.${level}`).classList.add('choose');
    game.setLevel(LevelSpeed[level]);
}


const game = new Game({
    place: fieldGame,
    now: scoreNow,
    best: scoreBest
}, SIZE_X, SIZE_Y, speed, haveWall, haveSpeedUp);

game.run();















