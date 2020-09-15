"use strict";

// Класс Анимация героя
var Animation = function (_character) {

    var character = _character; //присваиваем значение в переменную
    var element = character.element; //герой
    var that = this;
    //координаты героя
    this.xPos = character.xPos;
    this.yPos = character.yPos;
    //размеры героя
    this.width = character.width;
    this.height = character.height;
    //скорость героя
    var speed = character.speed;

    //сбрасываем позицю по Y после столкновения
    this.resetYValueAfterCollision = function (_yValue) {
        that.yPos = character.yPos = _yValue - character.height;
    };
    //отображение в браузере
    this.render = function () {
        character.xPos = that.xPos;
        character.yPos = that.yPos;
        element.style.left = character.xPos + 'px';
        element.style.top = character.yPos + 'px';
    };
};

//Класс герой
var Player = function () {
    var that = this;
    this.width = this.height = 0; //размеры
    this.yPos = this.xPos = 0; //координаты
    var innerElementWidth, innerElementHeight;
    this.xVelocity = this.yVelocity = 0; //движение по оси
    this.speed = this.ySpeed = 0; //скорость
    this.direction = 'left'; // изначальная позиция слева
    this.platformType = 'standard'; //изначальный тип платформы
    this.isUntouchable = false; //уязвимость к врагам
    this.element = null;
    var innerElement;
    this.animation = null;//анимация прыжка и движение
    this.spriteSheet = null;//тип спрайта
    this.spriteCord = null;//координаты героя в спрайте
    this.onGround = false; // приземление
    this.isFalling = true; // падение
    this.groundLevel = 0; //уровень низа экрана
    this.gravity = 0; // с какой скоростью падаение
    var sounds = new Sounds();
    this.spriteJetPack;
    this.spriteJetPackLeft = new Sprite('jetPackLeft', 2);
    this.spriteJetPackRight = new Sprite('jetPackLeft', 2);

    //инициализируем
    this.init = function () {
        that.width = 50;
        that.height = 96;
        //рамзеры отображения игрока
        innerElementWidth = 110;
        innerElementHeight = 96;

//координаты относительно размера экрана
        that.yPos = SCREEN_HEIGHT / 2;
        that.xPos = (SCREEN_WIDTH - that.width) / 2;

        that.xVelocity = 0;
        that.yVelocity = 0;

        that.speed = Math.round(SCREEN_WIDTH * 0.01);
        // that.speed = 4;
        that.ySpeed = -Math.round(SCREEN_HEIGHT * 0.5);
        // that.ySpeed = -Math.round()300;
        that.direction = 'right';
        that.platformType = 'standard';
//создаем контейнер для игрока
        that.element = document.createElement('div');
        that.element.style.width = that.width + 'px';
        that.element.style.height = that.height + 'px';
        that.element.style.position = 'absolute';
        that.element.style.top = that.yPos + 'px';
        that.element.style.left = that.xPos + 'px';
        that.element.style.zIndex = '2';
//создаем внутренний контейнер, если с получением бонуса произошли изменения внешнего вида героя
        innerElement = document.createElement('div');
        innerElement.style.width = innerElementWidth + 'px';
        innerElement.style.height = innerElementHeight + 'px';
        innerElement.style.backgroundImage = 'url("images/doodle-sprites3.png")';
        that.element.appendChild(innerElement);
// задаем движение и отрисовку героя
        that.animation = new Animation(that);
        that.spriteSheet = new Spritesheet();
// изначальное положение героя – право
        that.spriteCord = that.spriteSheet.getSpriteCoordinates('rightFace');
        that.onGround = true;
        that.gravity = 0.5;
        that.resetGroundLevel();
        that.spriteJetPack = null;
    };
//изменение уровня фона
    this.resetGroundLevel = function () {
        that.groundLevel = SCREEN_HEIGHT + SCREEN_HEIGHT * 0.33;
    };
//направление героя
    this.moveDirection = function (direction) {
        if (direction === 'left') {
            that.xVelocity = -that.speed;
            that.direction = 'left';
        } else if (direction === 'right') {
            that.xVelocity = that.speed;
            that.direction = 'right';
        }
    };

    //скорость прыжка от типа платформы + контроллер
    var move = function () {
        that.ySpeed = -Math.round(SCREEN_HEIGHT * 0.05);
        if (that.platformType === 'spring') {
            that.ySpeed = -Math.round(SCREEN_HEIGHT * 0.17);
            that.isUntouchable = true;
            that.resetGroundLevel();
        }
        if (that.platformType === 'jetPack') {
            // that.ySpeed = -Math.round(SCREEN_HEIGHT * 0.17);
            that.ySpeed = -Math.round(SCREEN_HEIGHT * 0.25);
            that.isUntouchable = true;
            that.resetGroundLevel();
        }
        that.startJump();
        controllerKeyboard(that);
    };

    //отображение в браузере
    var render = function () {
        innerElement.style.backgroundPositionX = that.spriteCord.x + 'px';
        innerElement.style.backgroundPositionY = that.spriteCord.y + 'px';
    };

    //обновляем спрайт положение игрока
    var updateDirection = function () {
        if (that.direction === 'left') {
            innerElement.style.marginLeft = '-30px'; // место для ранца
            that.spriteCord = that.spriteSheet.getSpriteCoordinates('leftFace');
        } else if (that.direction === 'right') {
            innerElement.style.marginLeft = '0px';
            that.spriteCord = that.spriteSheet.getSpriteCoordinates('rightFace');
        }
    };

    //добавляем ранец
    var appendJetPacks = function () {
        let newJetPackSprite = null;
        if (that.direction === 'left') {
            newJetPackSprite = that.spriteJetPackLeft;
            newJetPackSprite.element.style.left = '55px';
        } else if (that.direction === 'right') {
            newJetPackSprite = that.spriteJetPackRight;
        }
        newJetPackSprite.element.style.top = '30px';
        if (that.spriteJetPack !== newJetPackSprite) {
            that.spriteJetPack = newJetPackSprite;
            if (innerElement.hasChildNodes()) {
                innerElement.removeChild(innerElement.firstChild);
                innerElement.appendChild(that.spriteJetPack.element);
            } else {
                innerElement.appendChild(that.spriteJetPack.element);
            }
        }
    };

    //удалить ранец
    var removeJetPacks = function () {
        while (innerElement.hasChildNodes()) {
            innerElement.removeChild(innerElement.firstChild);
        }
    };
    //функция прыжка
    this.startJump = function () {
        if (that.onGround) {
            that.yVelocity = that.ySpeed;
            that.groundLevel = SCREEN_HEIGHT + SCREEN_HEIGHT * 0.33;
            that.onGround = false;
            that.isFalling = false;
            if (that.platformType === 'spring') {
                sounds.playSound('jumpOnSpring');
            } else if (that.platformType === 'jetPack') {
                sounds.playSound('jetPackJump');
            } else {
                sounds.playSound('jump');
            }
        } else {
            updateDirection();
        }
    };
    //ограничиваем высоту после прыжка
    var endJump = function () {
        if (that.yVelocity < that.ySpeed / 2) {
            that.yVelocity = that.ySpeed / 2;
        }
    };
    //обновляем статус
    this.updateFrame = function () {
        //столкновение с ранцом
        if (that.platformType === 'jetPack') {
            appendJetPacks();
        }
        that.yVelocity += that.gravity;
        if (that.yVelocity === 0) {
            that.isFalling = true;
            that.isUntouchable = false;
            if (that.platformType === 'jetPack') {
                removeJetPacks();
            }
            that.platformType = 'standard';
        }
        endJump();
//движение героя
        that.animation.yPos += that.yVelocity;
        that.animation.xPos += that.xVelocity;
// приземление на платформу
        if ((that.animation.yPos + that.animation.height) > that.groundLevel) {
            that.animation.resetYValueAfterCollision(that.groundLevel);
            that.onGround = true;
        }
        //герой вылетает за пределы экрана и появляется с разных сторон
        if (((that.animation.xPos) <= -SCREEN_WIDTH * 0.1)) {
            that.animation.xPos = SCREEN_WIDTH - SCREEN_WIDTH * 0.1;
        }
        if (that.animation.xPos >= SCREEN_WIDTH) {
            that.animation.xPos = 0;
        }
        if (that.onGround === true) {
            that.xVelocity = 0;
        }
        move();
        render();
        that.animation.render();

    };

    //инициализируем на старте
    this.init();

};