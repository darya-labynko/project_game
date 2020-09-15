"use strict";

// Параметры экрана
var SCREEN_HEIGHT = null;
var SCREEN_WIDTH = null;
const MIN_NORMAL_WINDOW_WIDTH = 400;

//сервер
const ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";

//обновляем значение ширины и высоты окна в случае изменении параметров экрана
var updateScreenParamaters = function () {
    SCREEN_HEIGHT = document.documentElement.clientHeight - 50;
    let clientWidth = document.documentElement.clientWidth;
    if (clientWidth >= MIN_NORMAL_WINDOW_WIDTH) {
        SCREEN_WIDTH = SCREEN_HEIGHT * 0.66;
    } else {
        SCREEN_WIDTH = clientWidth - 10;
    }

};
updateScreenParamaters();

//взять случайное число для fetch password
function getRandomNumberFromDiap(n, m) {
    return Math.floor(Math.random() * (m - n + 1)) + n;
}

// Класс столкновения двух объектов
var Collision = function () {

//если объект 1 находился в области видимости объекта 2 по оси Х
    this.checkCollisionByX = function (objectA, objectB) {
        return (((objectA.xPos + objectA.width) > objectB.xPos) && (objectA.xPos < (objectB.xPos + objectB.width)));

    };
    //проверяем столкнулся ли объект 1 поверх объекта 2
    this.checkTopCollision = function (objectA, objectB) {
        if (this.checkCollisionByX(objectA, objectB)) {
            if (((objectA.yPos + objectA.height) >= objectB.yPos) && (objectA.yPos < objectB.yPos) && ((objectA.yPos + objectA.height) < (objectB.yPos + objectB.height))) {
                //если объект 1 прыгнул сверху на объект 2
                return true;
            }
        }
        return false;

    };
    //проверяем столкновение объекта 1 с объектом 2 в любом направлении
    this.checkCollision = function (objectA, objectB) {
        if (this.checkCollisionByX(objectA, objectB)) {
            //если объект 1 находился в области видимости объекта 2 по оси Х
            if (((objectA.yPos + objectA.height) > objectB.yPos) && (objectA.yPos < (objectB.yPos + objectB.height))) {
                // если объект 1 нкходится в поле объекта 2 как сверхну, так и снизу
                return true;
            }
        }
        return false;
    };
};
// вспомогательный класс с дополнительными опциями
var Utility = function () {
    var collision = new Collision();

    // рандомно отображаем платформы
    this.getRandomCoordinates = function (prevX, prevY) {
        var randomXValue = Math.floor(Math.random() * 4);
        var randomYValue = Math.floor(Math.random() * 3) + 1;
        var newX = randomXValue * SCREEN_WIDTH * 0.25;
        var newY = randomYValue * -SCREEN_HEIGHT * 0.07;
        if ((newY <= (prevY - SCREEN_HEIGHT * 0.08)) && (newY > (prevY - SCREEN_HEIGHT * 0.58))) {
            return {xCord: newX, yCord: newY};
        }
        return null;
    };

    // рандомно отображаем врагов
    this.getRandomCoordinatesForVillain = function (prevX, prevY) {
        var randomXValue = Math.floor(Math.random() * 4);
        var randomYValue = Math.floor(Math.random() * 3) + 1;
        var newX = randomXValue * SCREEN_WIDTH * 0.25;
        var newY = randomYValue * -SCREEN_HEIGHT * 0.08;
        return {xCord: newX, yCord: newY};
    };

    //проверка столкновения игрока с верхней частью платформы
    this.checkCollisionOfPlayerPlatforms = function (player, platforms) {
        for (let i = 0; i < platforms.length; i++) {
            if (collision.checkTopCollision(player.animation, platforms[i])) {
                player.animation.resetYValueAfterCollision(platforms[i].yPos);
                player.groundLevel = platforms[i].yPos;
                player.yVelocity = 0;
                player.platformType = platforms[i].type;
                platforms[i].changeSpringSprite();
                return true;
            }
        }
        return false;

    };

    //столкновение игрока с врагом в любом направлении, если игрок столкнулся с врагом сверху – убрать врага,
    // если в любом другом направлении – смерть героя
    //если не столкнулся – продолжаем движение
    this.checkCollisionOfPlayerVillains = function (player, villains) {
        for (var i = 0; i < villains.length; i++) {
            if (collision.checkCollision(player.animation, villains[i])) {
                if (collision.checkTopCollision(player.animation, villains[i])) {
                    return i;
                }
                return 'collided';
            }
        }
        return null;
    };

};

//  Класс счет
var Score = function () {

    var that = this;
    this.element = null;
    this.score = null;
    this.update = function () {
        if (that.element != null) {
            that.element.style.width = SCREEN_WIDTH + 'px';
            that.element.style.height = SCREEN_HEIGHT / 15 + 'px';
            that.element.style.top = '0px';
            that.element.style.right = '0px';
        }
    };
    //инициализируем
    this.init = function () {
        //отрисовка
        that.element = document.createElement('div');
        that.element.id = "scorePanel";
        that.element.style.position = 'absolute';
        that.element.style.zIndex = 3;
        that.element.style.textAlign = 'left';
        that.element.style.backgroundColor = 'rgba(110, 168, 220, 0.7)';
        that.element.style.fontSize = '20px';
        that.element.style.fontWeight = 'bold';
// изначальная позиция
        that.score = 0;
        this.update();
    };
    // отображение в браузере
    var render = function () {
        that.element.innerHTML = 'Score: ' + that.score;
    };
    // обновление счета
    this.updateScore = function (updateMessage) {
        //при продвижении на какую-то часть экрана вверх – прибавляется счет
        if (updateMessage === 'height') {
            that.score += 1;
        } else if (updateMessage === 'redVillain') {
            that.score += 100;
        } else if (updateMessage === 'greenVillain') {
            that.score += 200;
        }
        render();
    };
//получение текущего счета
    this.getScore = function () {
        return that.score;
    };

    //инициализируем на старте
    this.init();
};

// главный Класс игры
var Main = function (_gameDiv) {
    var that = this;
    var interval = 25;
    var setTimeInterval;
    this.width = SCREEN_WIDTH;
    this.height = SCREEN_HEIGHT;
    var gamePlatform = _gameDiv;
    gamePlatform.style.position = 'relative';
    gamePlatform.style.margin = '0 auto';
    gamePlatform.style.border = '2px dotted #FFADD0';
    var gameDiv = document.createElement('div');
    gameDiv.style.position = 'relative';
    gameDiv.style.opacity = 1;
    gameDiv.style.overflow = 'hidden';
    gamePlatform.appendChild(gameDiv);

    var background = new Background();
    var sounds = new Sounds();
    var player = new Player();
    var extraClass = new Utility();
    var score = new Score();
    var gamePlay = new GamePlay(sounds);

    var platforms = [];
    var villains = [];

    var isGameOver = false;
    var isGameStarted = false;

    var updateGameStyle = function () {
        gamePlatform.style.width = that.width + 'px';
        gamePlatform.style.height = that.height + 'px';

        gameDiv.style.width = that.width + 'px';
        gameDiv.style.height = that.height + 'px';
    };

    var updateGameWindow = function () {
        updateScreenParamaters();
        that.width = SCREEN_WIDTH;
        that.height = SCREEN_HEIGHT;
        updateGameStyle();
        gamePlay.update();
        background.update();
        score.update();
        if (isGameStarted) {
            updateBackground();
        }
    };
    //создание новых платформ
    var createPlatform = function (xPos, yPos) {
        var platform = new Platform(xPos, yPos, 'standard');
        var randomNum = Math.random();
        if (randomNum < 0.025) {
            platform = new Platform(xPos, yPos, 'jetPack');
        } else if (randomNum < 0.05) {
            platform = new Platform(xPos, yPos, 'spring');
        } else if (randomNum < 0.25) {
            platform = new Platform(xPos, yPos, 'moving');
        }
        gameDiv.appendChild(platform.element);

        platforms.push(platform);
    };

    //уничтожение ненужных платформ
    var destroyPlatform = function (platformIndex) {
        platforms[platformIndex].element.parentNode.removeChild(platforms[platformIndex].element);
        platforms.splice(platformIndex, 1);
    };

    //создание новых монстров
    var createVillain = function (xPos, yPos, type) {
        var villain = new Villain(xPos, yPos, type);
        gameDiv.appendChild(villain.element);

        villains.push(villain);
    };

    //уничтожение ненужных монстров
    var destroyVillain = function (villainIndex) {
        villains[villainIndex].element.remove();
        villains.splice(villainIndex, 1);
    };
    //создание платформ на старте
    var createPlatformsTemp = function () {
        platforms = [
            new Platform(SCREEN_WIDTH * 0.5, SCREEN_HEIGHT * 0.83, 'standard'),
            new Platform(SCREEN_WIDTH, SCREEN_HEIGHT * 0.66, 'standard'),
            new Platform(0, SCREEN_HEIGHT * 0.5, 'standard'),
            new Platform(SCREEN_WIDTH * 0.5, SCREEN_HEIGHT * 0.33, 'standard'),
            new Platform(0, SCREEN_HEIGHT * 0.17, 'standard'),
            new Platform(SCREEN_WIDTH, 0, 'standard'),
            new Platform(SCREEN_WIDTH * 0.5, 0, 'standard')
        ];

        for (var i = 0; i < platforms.length; i++) {
            gameDiv.appendChild(platforms[i].element);
        }

    };

    //создавать новые платформы по мере того, как игрок поднимается
    var updatePlatforms = function () {
        var prevX = platforms[platforms.length - 1].xPos;
        var prevY = platforms[platforms.length - 1].yPos;
        var coOrd = extraClass.getRandomCoordinates(prevX, prevY);
        if (coOrd !== null) {
            createPlatform(coOrd.xCord, coOrd.yCord);
        }
    };

    //создавать новых монстров по мере того, как игрок поднимается
    var updateVillains = function () {
        var randNum = Math.random();
        if (randNum < 0.01) {
            var coOrd;
            if (villains.length === 0) {
                coOrd = extraClass.getRandomCoordinatesForVillain(SCREEN_WIDTH * 0.25, SCREEN_HEIGHT * 0.017);
            } else {
                var prevX = villains[villains.length - 1].xPos;
                var prevY = villains[villains.length - 1].yPos;
                coOrd = extraClass.getRandomCoordinatesForVillain(prevX, prevY);
            }
            if (coOrd !== null) {
                var type = 'greenVillain';
                if (Math.random() > 0.5) {
                    type = 'redVillain';
                }
                createVillain(coOrd.xCord, coOrd.yCord - SCREEN_HEIGHT * 0.083, type);
            }
        }
    };

    //обновляем фон, платформы, монстров по мере подъема игрока
    var updateBackground = function () {

        if (player.yPos < SCREEN_HEIGHT / 2) {
            player.animation.yPos = SCREEN_HEIGHT / 2;
            score.updateScore('height');
            //update background
            background.updateFrame();
            //update villains
            for (var i = 0; i < villains.length; i++) {
                if (villains[i].yPos > SCREEN_HEIGHT) {
                    destroyVillain(i);
                } else {
                    villains[i].updateFrame(Math.abs(player.yVelocity));
                }
            }
            //update blocks
            for (var j = 0; j < platforms.length; j++) {
                if (platforms[j].yPos > SCREEN_HEIGHT) {
                    destroyPlatform(j);
                } else {
                    platforms[j].updateFrame(Math.abs(player.yVelocity));
                }
            }
            updatePlatforms();
            updateVillains();
        }
    };

    //управление столкновением игрока и монстра
    var manageCollisionOfPlayerVillains = function () {
        var collisionStatusIndex = extraClass.checkCollisionOfPlayerVillains(player, villains);
        if (collisionStatusIndex !== null) {
            if (collisionStatusIndex === 'collided') {
                if (player.isUntouchable === false) {
                    isGameOver = true;
                    sounds.playSound('finish');
                }
            } else {
                if (player.isFalling) {
                    sounds.playSound('jumpOnVillain');
                    villains[collisionStatusIndex].isDead = true;
                    player.groundLevel = villains[collisionStatusIndex].yPos;
                    score.updateScore(villains[collisionStatusIndex].type);
                }
            }
        }
    };

    //конец игры
    var gameOver = function () {
        let currentScore = score.getScore();
        gamePlay.appendNameBox(currentScore);
        gamePlay.updateHighScore();
        clearTimeout(setTimeInterval);

        var opacity = 1;
        var opacity2 = 0.0;
//обновление игры
        var timeInt = setInterval(
            function () {
                opacity -= 0.1;
                if (opacity <= 0.2) {
                    opacity2 += 0.1;
                    gamePlay.mainElement.style.opacity = opacity2;
                    gamePlay.displayGameOver();
                    displayMenu();

                    if (opacity2 >= 1) {
                        clearInterval(timeInt);
                    }
                } else {
                    gameDiv.style.opacity = opacity;
                }
            }, 50);
    };
    //настройка параметров перед игрой
    var gameSetup = function () {
        gameDiv.appendChild(background.element);
        gameDiv.appendChild(score.element);
        createPlatformsTemp();
        gameDiv.appendChild(player.element);
        appendTouchOptions(player);
    };

    //сбрасываем игру после проигрыша
    var resetGameSetup = function () {
        //удаляем все главные элементы игры
        if (gameDiv.hasChildNodes()) {
            while (gameDiv.hasChildNodes()) {
                gameDiv.removeChild(gameDiv.firstChild);
            }
        }
        background.init();
        player.init();
        score.init();
        platforms = [];
        villains = [];
        isGameOver = false;
        gameSetup();
    };

    //отображение игры
    var displayGame = function () {
        gameDiv.style.opacity = 1;
        resetGameSetup();
        setTimeInterval = setInterval(gameLoop, interval);
    };

    //отображение меню
    var displayMenu = function () {
        if (isGameOver) {
            if (score.score > localStorage.getItem('highScore')) {
                localStorage.setItem('highScore', score.score);
            }
            removeTouchOptions();
            gamePlay.appendScoreSheet(score.score);
        }
        sounds.playSound('background');
        gamePlay.showMenu();
    };

    //настройка игры
    var gamePlaySetup = function () {
        gamePlatform.appendChild(gamePlay.mainElement);
        var interplayPlayDiv = function (e) {
            e.preventDefault();
            isGameStarted = true;
            gamePlay.hideMenu();
            sounds.playSound('play');
            sounds.sound.loop = false;
            displayGame();
        };
        var interplayOptionDiv = function (e) {
            e.preventDefault();
            gamePlay.showOptionsMenu();
        };
        gamePlay.playDivElement.onclick = interplayPlayDiv;
        gamePlay.playDivElement.ontouchstart = interplayPlayDiv;
        gamePlay.optionElement.onclick = interplayOptionDiv;
        gamePlay.optionElement.ontouchstart = interplayOptionDiv;
    };

    //цикл игры
    var gameLoop = function () {
        //при перезагрузки страницы или выходе из нее предупреждать о потере данных
        window.onbeforeunload = function () {
            if (!isGameOver) {
                return 'If you leave this page you can loose your game progress!';
            } else {
                return null;
            }
        };
        if (!isGameOver) {
            if (player.isFalling) {
                extraClass.checkCollisionOfPlayerPlatforms(player, platforms);
            }
            manageCollisionOfPlayerVillains();
            score.updateScore(1);
            var update = function () {
                updateBackground();
                player.updateFrame();
                for (let i = 0; i < platforms.length; i++) {
                    if (platforms[i].type === 'moving') {
                        platforms[i].updateFrameX();
                    }
                }
                for (let j = 0; j < villains.length; j++) {
                    villains[j].updateFrameX();
                }
                if (player.yPos >= SCREEN_HEIGHT) {
                    isGameOver = true;
                    sounds.playSound('finish');
                }
            };
            requestAnimationFrame(update)
        } else {
            gameOver();
        }

    };

    //инициализируем
    var init = function () {
        //установка значений в лоальном хранилище
        if (localStorage.getItem('music') === null) {
            localStorage.setItem('music', 'off');
        }
        if (localStorage.getItem('sound') === null) {
            localStorage.setItem('sound', 'on');
        }
        gamePlay.updateHighScore();

        //настройк игры
        updateGameStyle();
        gamePlaySetup();
    };

    init();
    window.onresize = updateGameWindow;
};

window.Main = Main;
var doodleJump = document.getElementById('doodle-jump');
new Main(doodleJump);