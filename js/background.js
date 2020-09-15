"use strict";
// Класс Фон
var Background = function () {

    this.element = null; // сам фон
    var xPos, yPos; //координаты фона
    var width, height;// ширина и высота
    const that = this;

    this.update = function () {
        if (that.element != null) {
            //изображение фона
            xPos = 0;
            yPos = -SCREEN_HEIGHT * 0.13;//изначальная позиция фона, процент от ширины
            //отрисовка фона
            width = SCREEN_WIDTH; //растягивается на всю ширину
            height = SCREEN_HEIGHT + SCREEN_HEIGHT * 0.13; // высота фона при движении игрока

            that.element.style.width = width + 'px';
            that.element.style.height = height + 'px';
            that.element.style.top = yPos + 'px';
            that.element.style.left = xPos + 'px';
        }
    };

    //инициализируем
    this.init = function () {
        that.element = document.createElement('div');//создаем контейнер для фона
        that.element.id = "background";
        that.element.style.backgroundImage = 'url("images/rrr.gif")';
        that.element.style.backgroundRepeat = 'repeat-x repeat-y';
        this.update();
    };

    //функция движения фона
    var move = function () {
        if (yPos >= 0) {
            yPos = -SCREEN_HEIGHT * 0.13;
        }
        yPos += SCREEN_HEIGHT * 0.0033; //сдвиг фона, если дудлик продолжает движение вверх
    };

    //отображение в браузере
    var render = function () {
        that.element.style.top = yPos + 'px';
    };

    //обновляем отображение
    this.updateFrame = function () {
        move();
        render();
    };

    //загружаем в самом начале
    this.init();
};