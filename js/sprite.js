"use strict";

//Класс спрайт лист с координатами игрока, платформ, бонусов и врагов
var Spritesheet = function () {

    //координаты главных элементов игры
    const coordinates = [
        {action: 'leftFace', coOrd: {x: 0, y: -121, w: 0, h: 0}},
        {action: 'rightFace', coOrd: {x: 0, y: -218, w: 0, h: 0}},
        {action: 'springDown', coOrd: {x: 0, y: -467, w: 48, h: 27}},
        {action: 'springUp', coOrd: {x: 0, y: -501, w: 51, h: 52}},
        {action: 'pinkBlock', coOrd: {x: 0, y: -2, w: 103, h: 28}},
        {action: 'violetBlock', coOrd: {x: 0, y: -61, w: 103, h: 28}},
        {action: 'whiteBlock', coOrd: {x: 0, y: -92, w: 103, h: 28}},
        {action: 'greenVillain', coOrd: {x: -175, y: -101, w: 82, h: 52}},
        {action: 'redVillain', coOrd: {x: 0, y: -104, w: 47, h: 35}},
        {action: 'jetPackStill', coOrd: {x: -3, y: -33, w: 24, h: 36}},
        {action: 'jetPackLeft', coOrd: {x: -128, y: -33, w: 24, h: 62}},
        {action: 'jetPackRight', coOrd: {x: -104, y: -33, w: 24, h: 62}}
    ];

    //возвращаем требуемые координаты согласно запросу
    this.getSpriteCoordinates = function (command) {
        return findCoOrd(command);
    };

    //ищем координаты нужного нам элемента
    var findCoOrd = function (command) {
        for (let i = 0; i < coordinates.length; i++) {
            if (coordinates[i].action === command) {
                return coordinates[i].coOrd;
            }
        }
    };
};

// Класс для создания контейнера игрока или врага
var Sprite = function (command, imgSrc) {
    this.coOrds = new Spritesheet().getSpriteCoordinates(command); // получаем координаты объекта
    this.element = document.createElement('div'); // создаем контейнер для объекта
//отрисовка контейнера
    this.element.style.width = this.coOrds.w + 'px';
    this.element.style.height = this.coOrds.h + 'px';
    // задаем абсолютное позиционирование
    this.element.style.position = 'absolute';
    // спрайт с изображениями героя, платформ и пружины
    this.element.style.backgroundImage = 'url("images/doodle-sprites3.png")';
    //спрайт с изображениями врагов и реактивный ранец
    if (imgSrc === 2) {
        this.element.style.backgroundImage = 'url("images/doodle-sprites-2.png")';
    }
    // отрисовка самого объекта
    this.element.style.backgroundPositionX = this.coOrds.x + 'px';
    this.element.style.backgroundPositionY = this.coOrds.y + 'px';
};