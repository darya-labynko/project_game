"use strict";

// Класс платформ
var Platform = function (_xPos, _yPos, _type) {
    var that = this;
    // изначально платформы невидимы
    //обретают вид, только после продвижения игрока вверх
    this.width = this.height = 0;
    this.type = 'standard'; // по умолчанию платформы розовые, неподвижные
    var xVelocity;
    this.xPos = this.yPos = 0;
    this.element = null;

    //иницилизируем платформы
    this.init = function () {
        //ширина и высота платформы подстраивающаяся под размер экрана
        that.width = SCREEN_WIDTH * 0.26;
        that.height = SCREEN_HEIGHT * 0.05;
        //тип платфориы
        that.type = _type;
        //движение по оси Х
        xVelocity = Math.round(SCREEN_WIDTH * 0.0025);//подстраиваемая скорость по оси Х
        //координаты
        that.xPos = _xPos;
        that.yPos = _yPos;
        // отрисовка контенйнера для платформы
        that.element = document.createElement('div');

        that.element.style.position = 'absolute';
        that.element.style.left = that.xPos + 'px';
        that.element.style.top = that.yPos + 'px';
        // контейнер будет заполнен в заисисимости от типа платформы
        if (that.type === 'standard') {
            //розовая платформа, стандарт
            setSprite('pinkBlock');
        } else if (that.type === 'spring') {
            //фиолетовая платформа с бонусом, пружина
            setSprite('violetBlock');
            setSpringSprite('springDown', 1);
        } else if (that.type === 'jetPack') {
            //фиолетовая платформа с бонусом, ранец
            setSprite('violetBlock');
            setSpringSprite('jetPackStill', 2);
        } else if (that.type === 'moving') {
            // платформа движения, белая
            setSprite('whiteBlock');

        }
    };

    // устанавливаем изображение спрайта и отрисовыем нужные платформы
    function setSprite(command) {
        // получаем координаты платформ согласно запросу
        var coOrds = new Spritesheet().getSpriteCoordinates(command);
        that.width = coOrds.w;
        that.height = coOrds.h;
        that.element.style.width = that.width + 'px';
        that.element.style.height = that.height + 'px';
        that.element.style.backgroundImage = 'url("images/doodle-sprites3.png")';
        that.element.style.backgroundRepeat = 'no-repeat';
        that.element.style.backgroundPositionX = coOrds.x + 'px';
        that.element.style.backgroundPositionY = coOrds.y + 'px';

    }

    //функция добавления пружины к розовому блоку
    function setSpringSprite(command, imgSrc) {
        var sprite = new Sprite(command, imgSrc);
        sprite.element.style.left = that.width / 2 - sprite.coOrds.w / 2 + 'px';
        sprite.element.style.top = -sprite.coOrds.h + 'px';
        that.element.appendChild(sprite.element);
    }

    //функция замены бонуса при столкновении с игроком
    this.changeSpringSprite = function () {
        //пружинка остается на месте и при взаимодействии с игроком переходит в другую форму
        if (that.type === 'spring') {
            that.element.removeChild(that.element.childNodes[0]);
            setSpringSprite('springUp');
        }
        //ранец убирается с платформы
        if (that.type === 'jetPack' && that.element.hasChildNodes()) {
            that.element.removeChild(that.element.childNodes[0]);
        }
    };

    //движение платформ вниз
    var move = function (speed) {
        that.yPos += speed;
    };

    //автоматическое движение белых платформ по оси Х
    //меняют направление при столкновении со стенкой
    var autoMove = function () {
        if (that.xPos < 0 || that.xPos + that.width > SCREEN_WIDTH) {
            xVelocity *= -Math.round(SCREEN_WIDTH * 0.0025); //подстраиваемая скорость по оси Х
        }
        that.xPos += xVelocity;
    };

    //отображение в браузере
    var render = function () {
        that.element.style.left = that.xPos + 'px';
        that.element.style.top = that.yPos + 'px';
    };

    //обновление отображения контейнера платформ
    this.updateFrame = function (speed) {
        move(speed);
        render();
    };

    //обновления отображения белых платформ
    this.updateFrameX = function () {
        autoMove();
        render();
    };

    //инициализировать при старте
    this.init();
};