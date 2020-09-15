"use strict";

var Villain = function (_xPos, _yPos, _type) {
    var that = this;
    this.width = this.height = 0; //размеры
    this.xPos = this.yPos = 0;//координаты
    this.type = _type;//тип монстра
    this.speed = Math.round(SCREEN_WIDTH * 0.01);//скорость
    this.isDead = false;//показатель смерти
    var xVelocity, yVelocity;//движение по оси
    this.element = null;

    //инициализируем
    this.init = function () {
        that.width = SCREEN_WIDTH * 0.25;
        that.height = SCREEN_HEIGHT * 0.033;
        that.xPos = _xPos;
        that.yPos = _yPos;
        that.type = _type;
        that.speed = 4;
        that.isDead = false;
        xVelocity = Math.round(SCREEN_WIDTH * 0.0025);
        yVelocity = Math.round(SCREEN_HEIGHT * 0.013);
        //отрисовка
        that.element = document.createElement('div');
        that.element.style.position = 'absolute';
        that.element.style.top = that.yPos + 'px';
        that.element.style.left = that.xPos + 'px';

        //выбор типа монстра
        if (that.type === 'greenVillain') {
            setSprite('greenVillain');
        } else if (that.type === 'redVillain') {
            setSprite('redVillain');
        }
    };

    //координаты монстра
    function setSprite(command) {
        var coOrds = new Spritesheet().getSpriteCoordinates(command);
        that.width = coOrds.w;
        that.height = coOrds.h;
        that.element.style.width = that.width + 'px';
        that.element.style.height = that.height + 'px';
        that.element.style.backgroundImage = 'url("images/doodle-sprites-2.png")';
        that.element.style.backgroundRepeat = 'no-repeat';
        that.element.style.backgroundPositionX = coOrds.x + 'px';
        that.element.style.backgroundPositionY = coOrds.y + 'px';
        that.element.style.zIndex = 1;
    }

    //движение по оси Y
    var move = function (speed) {
        that.yPos += speed;
    };
    // автоматическое движение по оси Х
    var autoMove = function () {
        if (that.xPos < 0 || that.xPos + that.width > SCREEN_WIDTH) {
            xVelocity *= -Math.round(SCREEN_WIDTH * 0.0025);
        }
        that.xPos += xVelocity;
    };

    //упасть вниз, если столкнулся с героем
    var moveDownAfterDeath = function () {
        that.yPos += yVelocity;
    };

    //отображение в браузере
    var render = function () {
        that.element.style.width = that.width + 'px';
        that.element.style.height = that.height + 'px';
        that.element.style.top = that.yPos + 'px';
        that.element.style.left = that.xPos + 'px';
    };

    //обнови статус
    this.updateFrame = function (speed) {
        if (that.isDead) {
            moveDownAfterDeath();
        } else {
            if (speed !== null) {
                move(speed);
            }
            autoMove();
        }
        render();
    };

    //обнови статус по оси Х
    this.updateFrameX = function () {
        if (that.isDead) {
            moveDownAfterDeath();
        } else {
            autoMove();
        }
        render();
    };

    //инициализировать на старте
    this.init();

};