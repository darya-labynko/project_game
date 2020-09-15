"use strict";
//движение кнопками влево или вправо
var controllerKeyboard = function (currentObject) {
    window.onkeydown = function (event) {
        event.preventDefault();
        if (event.keyCode === 37) {
            currentObject.moveDirection('left');
        } else if (event.keyCode === 65) {
            currentObject.moveDirection('left');
        }
        if (event.keyCode === 39) {
            currentObject.moveDirection('right');
        } else if (event.keyCode === 68) {
            currentObject.moveDirection('right');

        }
    };
    window.onkeyup = function (event) {
        event.preventDefault();
        window.onkeydown = null;
    };

};

//тач
var touchElemet = document.createElement('div');
var gamePlatform = document.getElementById('doodle-jump');
var appendTouchOptions = function (playerObject) {
    var el = document.createElement('div');
    el.style.width = SCREEN_WIDTH / 2 + 'px';
    el.style.height = SCREEN_HEIGHT + 'px';
    el.style.float = 'left';
    el.style.position = 'absolute';
    el.style.top = '0px';
    el.style.left = '0px';

    el.ontouchstart = function () {
        playerObject.moveDirection('left');
    };
    var el2 = document.createElement('div');
    el2.style.width = SCREEN_WIDTH / 2 + 'px';
    el2.style.height = SCREEN_HEIGHT + 'px';
    el2.style.float = 'right';
    el2.style.position = 'absolute';
    el2.style.top = '0px';
    el2.style.right = '0px';

    el2.ontouchstart = function () {
        playerObject.moveDirection('right');
    };
    touchElemet.appendChild(el);
    touchElemet.appendChild(el2);
    gamePlatform.appendChild(touchElemet);
};

//удаление тач опций
var removeTouchOptions = function () {
    while (touchElemet.hasChildNodes()) {
        touchElemet.removeChild(touchElemet.firstChild);
    }
};
