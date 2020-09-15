"use strict";
// Класс аудио
var Sounds = function () {
    var that = this;
    this.sound = new Audio();
    this.sound.loop = false; //цикличность воспроизведения
//создаем массив аудиофайлов
    var soundFiles = [
        'sounds/start.wav',
        'sounds/jump.wav',
        'sounds/feder.mp3',
        'sounds/jumponvillain.mp3',
        'sounds/finish.mp3',
        'sounds/allsounds.mp3',
        'sounds/jetpack.mp3'
    ];
//функция воспроизведения музыки
    var playSoundFile = function (soundFile) {
        that.sound.src = soundFile;
        that.sound.play();
    };
//функция выбора проигрываемой мелодии, в зависимости от переданной команды,
// если у пользователя включен sound
    this.playSound = function (command) {

        switch (command) {
            case 'play':
                if (localStorage.getItem('sound') === 'on') {
                    playSoundFile(soundFiles[0]);
                }
                break;
            case 'jump':
                if (localStorage.getItem('sound') === 'on') {
                    playSoundFile(soundFiles[1]);
                }
                break;
            case 'jumpOnVillain':
                if (localStorage.getItem('sound') === 'on') {
                    playSoundFile(soundFiles[3]);
                }
                break;
            case 'jumpOnSpring':
                if (localStorage.getItem('sound') === 'on') {
                    playSoundFile(soundFiles[2]);
                }
                break;
            case 'jetPackJump':
                if (localStorage.getItem('sound') === 'on') {
                    playSoundFile(soundFiles[6]);
                }
                break;
            case 'finish':
                if (localStorage.getItem('sound') === 'on') {
                    playSoundFile(soundFiles[4]);
                }
                break;
            case 'background':
                if (localStorage.getItem('music') === 'on') {
                    playSoundFile(soundFiles[5]);
                }
                break;
            default:
                break;
        }
    };

};