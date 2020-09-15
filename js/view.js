"use strict";

//Меню игры
var GamePlay = function (sounds) {
    var that = this;
    //главный элемент для отображения опций
    this.mainElement = document.createElement('div');
    //контейнер для кнопок
    var element = document.createElement('div');
    element.id = "box";
    //контенейр для переключения музыки
    var musicOptionsElement = document.createElement('div');
    //изначальные значения опциональных элементов игры
    this.musicOptElement = null;
    this.soundOptElement = null;
    this.musicOnElement = null;
    this.musicOffElement = null;
    this.soundOnElement = null;
    this.soundOffElement = null;
    this.instructionsDiv = null;
    this.scoreDiv = null;
    this.gameTitle = null;
    this.gameOverDiv = null;
    this.backDiv = null;
    this.scoreTable = null;
    this.closeScoreTableBtn = null;
    this.nameBox = null;
    this.nameInput = null;
    this.nameBtn = null;
    this.currentScore = null;
    this.table = null;
    this.highScore = null;
    this.username = null;
//контенеры для кнопок играть, опции, рекорды
    this.playDivElement = document.createElement('div');
    this.optionElement = document.createElement('div');
    this.recordElement = document.createElement('div');
//ширина и высота
    var width = SCREEN_WIDTH;
    var height = SCREEN_HEIGHT;


    //установка параметров для внутренних элементов
    var setPropertyForInnerElements = function (el) {
        el.style.width = width + 'px';
        el.style.height = height + 'px';
        el.style.position = 'absolute';
        el.style.top = '0px';
        el.style.left = '0px';
        el.style.zIndex = 3;
    };
    //установка параметров для контейнеров музыки и звуков
    var setPropertyForMusicSoundOptions = function () {
        return document.createElement('div');
    };
    //установка параметров для контейнера с названием музки и звуков
    var setPropertyForMusicOptionsInnerElement = function (float) {
        var el = document.createElement('div');
        el.classList = "name";
        el.style.float = float;
        return el;
    };
    //установка параметров  для контейнеров on/off по умолчанию красный
    var createToggleMusicSoundOptions = function (text) {
        var elBtn = document.createElement('div');
        elBtn.classList = "optionsBtn";
        elBtn.innerHTML = text;
        return elBtn;
    };

    //отображение кнопки PLAY до и после игры
    var appendStartMenu = function () {
        that.playDivElement.classList = "btn";
        that.playDivElement.innerHTML = 'PLAY';
        element.appendChild(that.playDivElement);
    };

    //отображение счета после игры
    this.appendScoreSheet = function (score) {
        if (that.scoreDiv === null) {
            that.scoreDiv = document.createElement('div');
            that.scoreDiv.id = 'scoreCard';
            var scoreElement = document.createElement('div');
            var highScoreElement = document.createElement('div');
            that.gameTitle = document.createElement('div');
            that.gameTitle.id = "gameTitle";
            scoreElement.style.float = 'left';
            scoreElement.style.paddingLeft = '5px';
            highScoreElement.style.float = 'right';
            highScoreElement.style.paddingRight = '5px';
            that.scoreDiv.appendChild(scoreElement);
            that.scoreDiv.appendChild(highScoreElement);
            that.scoreDiv.appendChild(that.gameTitle);
        }

        if (score !== null) {
            that.scoreDiv.children[0].innerHTML = 'Your Score: ' + score;
        }
        that.scoreDiv.children[2].innerHTML = 'DOODLE JUMP';
        let currentHighScore = localStorage.getItem('highScore');
        if (currentHighScore == null) {
            currentHighScore = 0;
        }
        that.scoreDiv.children[1].innerHTML = 'High Score: ' + currentHighScore;
        that.mainElement.appendChild(that.scoreDiv);
    };

    //отображение инструкции игры
    var appendInstructionsSheet = function () {
        that.instructionsDiv = document.createElement('div');
        that.instructionsDiv.id = 'instructionCard';
        that.instructionsDiv.innerHTML = '<strong>Instructions</strong><br/>Press/Tap <strong>&#8592;</strong> to move <strong>Left</strong><br/>Press/Tap <strong>&#8594;</strong> to move <strong>Right</strong>';

        that.mainElement.appendChild(that.instructionsDiv);
    };

    //кнопка OPTIONS
    var appendOptionsMenu = function () {
        that.optionElement.classList = "btn";
        that.optionElement.innerHTML = 'OPTIONS';
        element.appendChild(that.optionElement);
    };
//закрытие кона рекордов
    var closeScoreTable = function () {
        that.scoreTable.style.top = "-1%";
        that.scoreTable.style.left = "50%";
        that.scoreTable.style.transform = "translateZ(0) translateX(-50%)  translateY(-100%) ";
        that.scoreTable.style.boxShadow = "";
    };
//кнопка закрытия рекордов
    var appendCloseButton = function () {
        that.closeScoreTableBtn = document.createElement("div");
        that.closeScoreTableBtn.classList = "close";
        that.closeScoreTableBtn.onclick = function () {
            closeScoreTable();
        };
        that.scoreTable.appendChild(that.closeScoreTableBtn);
    };

    //инициализируем окно рекордов
    var initRecordsTable = function () {
        if (that.scoreTable === null) {
            that.scoreTable = document.getElementById("scoreTable");
            that.scoreTable.style.width = "100%";
            that.scoreTable.style.height = "65%";
            that.scoreTable.style.left = "0";
            that.scoreTable.style.top = "-70%";
            that.scoreTable.style.boxShadow = "";
        }
    };
//отображение окна рекордов
    var showRecordsTable = function (recordsJson) {
        that.scoreTable.style.zIndex = "5";
        that.scoreTable.style.width = "100%";
        that.scoreTable.style.height = "65%";
        that.scoreTable.style.left = "50%";
        that.scoreTable.style.top = "50%";
        that.scoreTable.style.transform = "translateZ(0) translateX(-50%) translateY(-50%)";
        that.scoreTable.style.boxShadow = "0px 3px 30px 2px rgba(230,147,230,0.8)";
        if (that.closeScoreTableBtn === null) {
            appendCloseButton();
        }
        //отрисовка таблицы рекордов

        if (that.table !== null) {
            that.table.remove();
        }
        that.table = document.createElement('div');
        that.table.id = "table";
        if (recordsJson !== "") {
            let records = JSON.parse(recordsJson);
            let tableDiv = document.createElement("table");
            tableDiv.style.margin = "auto";
            tableDiv.style.borderSpacing = "0.5vh 0.5vw";
            let tableBody = document.createElement("tbody");
            tableDiv.appendChild(tableBody);
            for (let i = 0; i < records.length; i++) {
                let tr = document.createElement("tr");
                tableBody.appendChild(tr);
                let tdNumber = document.createElement("td");
                tdNumber.innerText = i + 1;
                tr.appendChild(tdNumber);
                let tdName = document.createElement("td");
                tdName.innerText = records[i].name;
                tr.appendChild(tdName);
                let tdScore = document.createElement("td");
                tdScore.innerText = records[i].score;
                tr.appendChild(tdScore);
                that.table.appendChild(tableDiv);
            }
        } else {
            that.table.innerHTML = "There is no highscores yet!"
        }
        that.scoreTable.appendChild(that.table);

    };
//загрузка рекордов с сервера и отправка на отрисовку showRecordsTable
    var loadRecordsTable = function () {
        let sp = new URLSearchParams();
        sp.append('f', 'READ');
        sp.append('n', 'LABYNKO_GAME_RESULT');
        fetch(ajaxHandlerScript, {method: 'post', body: sp})
            .then(response => response.json())
            .then(data => {
                showRecordsTable(data.result);
            })
            .catch(error => {
                console.error(error);
            });
    };
//  сохраняет в локальную переменную и в localstorage высший результат
    var setHighScore = function (scoresJson) {
        if (scoresJson === "") {
            that.highScore = 0;
        } else {
            let scores = JSON.parse(scoresJson);
            that.highScore = scores[0].score;
        }
        localStorage.setItem('highScore', that.highScore);
    };
//загружает результат с сервера и сохраняет через setHighScore
    this.updateHighScore = function () {
        let sp = new URLSearchParams();
        sp.append('f', 'READ');
        sp.append('n', 'LABYNKO_GAME_RESULT');
        fetch(ajaxHandlerScript, {method: 'post', body: sp})
            .then(response => response.json())
            .then(data => {
                setHighScore(data.result);
            })
            .catch(error => {
                console.error(error);
            });
    };

    //кнопка RECORDS
    var appendRecords = function () {
        that.recordElement.classList = "btn";
        that.recordElement.innerHTML = 'RECORDS';
        element.appendChild(that.recordElement);
        that.recordElement.onclick = function (e) {
            e.preventDefault();
            loadRecordsTable();
        };
        that.recordElement.ontouchstart = function (e) {
            e.preventDefault();
            loadRecordsTable();
        }
    };
//обновить результаты
    var updateResults = function (resultsJson, newResult) {
        let randomPassword = getRandomNumberFromDiap(1, 1000);
        lockGet(randomPassword);
        let results = null;
        if (resultsJson === "") {
            results = [newResult];
        } else {
            results = JSON.parse(resultsJson);
            results.push(newResult);
        }
        //функция сортировки рекордов
        results.sort(((firstResult, secondResult) => secondResult.score - firstResult.score));
        //в таблице отображает максимум 10 рекордов
        if (results.length > 10) {
            results.pop();
        }
        //преобразовать результатов в формат json
        let arrJson = JSON.stringify(results);
        let sp = new URLSearchParams();
        sp.append('f', 'UPDATE');
        sp.append('n', 'LABYNKO_GAME_RESULT');
        sp.append('p', randomPassword);
        sp.append('v', arrJson);
        fetch(ajaxHandlerScript, {method: 'post', body: sp})
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
    };
//добавляет результат и отправляет на обновление результата
    var addResult = function (result) {
        let sp = new URLSearchParams();
        sp.append('f', 'READ');
        sp.append('n', 'LABYNKO_GAME_RESULT');
        fetch(ajaxHandlerScript, {method: 'post', body: sp})
            .then(response => response.json())
            .then(data => {
                updateResults(data.result, result);
            })
            .catch(error => {
                console.error(error);
            });
    };
//выставляет lock на результат для дальнейшего обновления
    var lockGet = function (password) {
        let sp = new URLSearchParams();
        sp.append('f', 'LOCKGET');
        sp.append('n', 'LABYNKO_GAME_RESULT');
        sp.append('p', "password");
        sp.append('p', password);
        fetch(ajaxHandlerScript, {method: 'post', body: sp})
            .then(response => response.json())
            .catch(error => {
                console.error(error);
            });
    };
//добавляем контейнер с записью имени
    this.appendNameBox = function (currentScore) {
        that.currentScore = currentScore;
        if (that.nameBox === null) {
            that.nameBox = document.createElement("form");
            that.nameBox.classList = "nameBox";
            that.nameBox.style.width = "90%";
            that.nameBox.style.height = "43%";
            that.nameBox.style.left = "5%";
            that.nameBox.style.top = "39%";
            that.nameBox.style.position = "absolute";
            that.nameBox.style.zIndex = "5";
            var gameWindow = document.getElementById("doodle-jump");
            gameWindow.appendChild(that.nameBox);
            appendInput();
            appendSubmit();
        } else if (that.username !== null) {
            let result = {"name": that.username, "score": that.currentScore};
            addResult(result);
        } else if (that.username === null) {
            that.nameBox.style.display = "block";
        }
    };
//поле для записи имени
    var appendInput = function () {
        if (that.nameInput === null) {
            that.nameInput = document.createElement("input");
            that.nameInput.type = "text";
            that.nameInput.style.width = "40%";
            that.nameInput.style.height = "17%";
            that.nameInput.style.left = "50%";
            that.nameInput.style.top = "50%";
            that.nameInput.style.marginTop = "29%";
            that.nameInput.style.paddingLeft = "2%";
            that.nameInput.style.fontFamily = "'Gloria Hallelujah', cursive";
            that.nameInput.style.fontSize = "14px";
            that.nameInput.style.color = "#b182fc";
            that.nameInput.style.fontWeight = "bold";

            that.nameInput.style.border = "none";
            that.nameInput.style.border = "2px solid #b182fc";
            that.nameInput.style.borderRadius = "20px";
            that.nameInput.placeholder = "User";
            that.nameBox.appendChild(that.nameInput);
        }

    };
    //кнопка для отправки имени
    var appendSubmit = function () {
        if (that.nameBtn === null) {
            that.nameBtn = document.createElement('input');
            that.nameBtn.value = "OK";
            that.nameBtn.type = "submit";
            that.nameBtn.width = "20%";
            that.nameBtn.height = "20%";
            that.nameBtn.style.left = "50%";
            that.nameBtn.style.top = "50%";
            that.nameBtn.style.width = '15%';
            that.nameBtn.style.padding = '2%';
            that.nameBtn.style.borderRadius = "50%";
            that.nameBtn.style.marginLeft = "1%";
            that.nameBtn.style.fontSize = '20px';
            that.nameBtn.style.fontFamily = 'Gloria Hallelujah, cursive';
            that.nameBtn.style.color = 'white';
            that.nameBtn.style.backgroundColor = "#b182fc";
            that.nameBtn.style.border = "none";
            that.nameBtn.style.border = "2px solid white";

            that.nameBtn.style.textTransform = "uppercase";
            that.nameBox.appendChild(that.nameBtn);
            //по умолчанию, если пользовать не ввел имя – user
            that.nameBtn.onclick = function (EO) {
                let name = that.nameInput.value;
                if (name === "") {
                    name = "User";
                }
                that.username = name;
                let result = {"name": name, "score": that.currentScore};
                addResult(result);
                that.nameBox.style.display = "none";
                EO.preventDefault();
            }
        }
    };


    //Кнопка BACK
    var appendBackDivInMusicSoundOptions = function () {
        if (that.backDiv === null) {
            that.backDiv = document.createElement('div');
            that.backDiv.id = "back";
            that.backDiv.style.top = SCREEN_HEIGHT * 0.18 + 'px';
            that.backDiv.style.width = SCREEN_WIDTH * 0.25 + 'px';
            that.backDiv.innerHTML = 'BACK';
            that.backDiv.onclick = function () {
                that.showPlayMenu();
            };
            that.backDiv.ontouchstart = function () {
                that.showPlayMenu();
            };
        }

        musicOptionsElement.appendChild(that.backDiv);
    };

    // события для операций переключения
    var changeSettingsOnClick = function (el1, el2, target) {
        el1.onclick = function (e) {
            e.preventDefault();
            switchOptions(el1, el2, target);
        };
        el1.ontouchstart = function (e) {
            e.preventDefault();
            switchOptions(el1, el2, target);
        };
    };

    function switchOptions(el1, el2, target) {
        switch (target) {
            case 'soundOn':
                localStorage.setItem('sound', 'on');
                el1.style.backgroundColor = 'rgba(52, 152, 219,0.7)';
                el2.style.backgroundColor = 'rgba(169, 120, 255, 0.7)';
                break;
            case 'soundOff':
                localStorage.setItem('sound', 'off');
                el1.style.backgroundColor = 'rgba(52, 152, 219,0.7)';
                el2.style.backgroundColor = 'rgba(169, 120, 255, 0.7)';
                break;
            case 'musicOn':
                localStorage.setItem('music', 'on');
                sounds.playSound('background');
                el1.style.backgroundColor = 'rgba(52, 152, 219,0.7)';
                el2.style.backgroundColor = 'rgba(169, 120, 255, 0.7)';
                break;
            case 'musicOff':
                localStorage.setItem('music', 'off');
                sounds.sound.pause();
                el1.style.backgroundColor = 'rgba(52, 152, 219,0.7)';
                el2.style.backgroundColor = 'rgba(169, 120, 255, 0.7)';
                break;
            default:
                break;
        }
    }

    // music options
    var appendMusicOptionsMenuDiv = function () {

        that.musicOptElement = setPropertyForMusicSoundOptions();
        that.musicOptElement.id = "musicOptElement";
        that.soundOptElement = setPropertyForMusicSoundOptions();
        that.soundOptElement.id = "soundOptElement";
        var musicInnerElementLeft = setPropertyForMusicOptionsInnerElement('left');
        var musicInnerElementRight = setPropertyForMusicOptionsInnerElement('right');
        musicInnerElementLeft.innerHTML = 'Music';
        that.musicOnElement = createToggleMusicSoundOptions('on');
        that.musicOffElement = createToggleMusicSoundOptions('off');
        if (localStorage.getItem('music') === 'on') {
            that.musicOnElement.style.backgroundColor = 'rgba(52, 152, 219,0.7)';
        } else {
            that.musicOffElement.style.backgroundColor = 'rgba(52, 152, 219,0.7)';
        }
        changeSettingsOnClick(that.musicOnElement, that.musicOffElement, 'musicOn');
        changeSettingsOnClick(that.musicOffElement, that.musicOnElement, 'musicOff');
        musicInnerElementRight.appendChild(that.musicOnElement);
        musicInnerElementRight.appendChild(that.musicOffElement);
        that.musicOptElement.appendChild(musicInnerElementLeft);
        that.musicOptElement.appendChild(musicInnerElementRight);
        var soundInnerElementLeft = setPropertyForMusicOptionsInnerElement('left');
        var soundInnerElementRight = setPropertyForMusicOptionsInnerElement('right');
        soundInnerElementLeft.innerHTML = 'Sound';
        that.soundOnElement = createToggleMusicSoundOptions('on');
        that.soundOffElement = createToggleMusicSoundOptions('off');
        if (localStorage.getItem('sound') === 'on') {
            that.soundOnElement.style.backgroundColor = 'rgba(52, 152, 219,0.7)';
        } else {
            that.soundOffElement.style.backgroundColor = 'rgba(52, 152, 219,0.7)';
        }
        changeSettingsOnClick(that.soundOnElement, that.soundOffElement, 'soundOn');
        changeSettingsOnClick(that.soundOffElement, that.soundOnElement, 'soundOff');
        soundInnerElementRight.appendChild(that.soundOnElement);
        soundInnerElementRight.appendChild(that.soundOffElement);
        that.soundOptElement.appendChild(soundInnerElementLeft);
        that.soundOptElement.appendChild(soundInnerElementRight);
        appendBackDivInMusicSoundOptions();
        musicOptionsElement.appendChild(that.musicOptElement);
        musicOptionsElement.appendChild(that.soundOptElement);
        that.update();
    };

    // кнопка конец игры
    this.displayGameOver = function () {
        if (that.gameOverDiv === null) {
            that.gameOverDiv = document.createElement('div');
            that.gameOverDiv.id = "gameOverDiv";
            that.gameOverDiv.style.width = SCREEN_WIDTH * 0.5 + 'px';
            that.gameOverDiv.style.height = SCREEN_HEIGHT * 0.12 + 'px';
            that.gameOverDiv.style.left = width / 2 - SCREEN_WIDTH * 0.25 + 'px';
            that.gameOverDiv.style.top = height / 2 - SCREEN_HEIGHT * 0.25 + 'px';
            that.gameOverDiv.innerHTML = 'GAME OVER';
        }
        element.appendChild(that.gameOverDiv);
    };

    // прятать меню при начале игры
    this.hideMenu = function () {
        that.mainElement.style.display = 'none';
    };
    //показывать меню до начала игры и после окончания
    this.showMenu = function () {
        that.mainElement.style.display = 'block';
    };
    //отображение опций
    this.showOptionsMenu = function () {
        element.style.display = 'none';
        musicOptionsElement.style.display = 'block';
        appendMusicOptionsMenuDiv();
    };
    //отображение кнопки play
    this.showPlayMenu = function () {
        musicOptionsElement.style.display = 'none';
        element.style.display = 'block';
    };
//обновление отображения элементов
    this.update = function () {
        width = SCREEN_WIDTH;
        height = SCREEN_HEIGHT;
        setPropertyForInnerElements(element);

        that.playDivElement.style.width = SCREEN_WIDTH * 0.375 + 'px';
        that.playDivElement.style.height = SCREEN_HEIGHT * 0.1 + 'px';
        that.playDivElement.style.left = width / 2 - SCREEN_WIDTH * 0.188 + 'px';
        that.playDivElement.style.top = height / 2 - SCREEN_HEIGHT * 0.10 + 'px';

        that.optionElement.style.width = SCREEN_WIDTH * 0.375 + 'px';
        that.optionElement.style.height = SCREEN_HEIGHT * 0.1 + 'px';
        that.optionElement.style.left = width / 2 - SCREEN_WIDTH * 0.188 + 'px';
        that.optionElement.style.top = height / 2 + SCREEN_HEIGHT * 0.04 + 'px';

        that.recordElement.style.width = SCREEN_WIDTH * 0.375 + 'px';
        that.recordElement.style.height = SCREEN_HEIGHT * 0.1 + 'px';
        that.recordElement.style.left = width / 2 - SCREEN_WIDTH * 0.188 + 'px';
        that.recordElement.style.top = height / 2 + SCREEN_HEIGHT * 0.18 + 'px';

        if (that.instructionsDiv !== null) {
            that.instructionsDiv.style.width = SCREEN_WIDTH + 'px';
            that.instructionsDiv.style.height = SCREEN_HEIGHT * 0.17 + 'px';
            that.instructionsDiv.style.top = SCREEN_HEIGHT - SCREEN_HEIGHT * 0.17 + 'px';
        }

        if (that.scoreDiv !== null) {
            that.scoreDiv.style.width = SCREEN_WIDTH + 'px';
            that.scoreDiv.style.height = SCREEN_HEIGHT * 0.17 + 'px';
            that.gameTitle.style.width = SCREEN_WIDTH + 'px';
        }

        if (that.soundOptElement !== null) {
            that.soundOptElement.style.top = height / 2 + SCREEN_HEIGHT * 0.067 + 'px';
            that.soundOptElement.style.width = SCREEN_WIDTH * 0.70 + "px";
            that.soundOptElement.style.height = SCREEN_HEIGHT * 0.083 + "px";
            that.soundOptElement.style.left = width / 2 - SCREEN_WIDTH * 0.375 + 'px';
        }

        if (that.musicOptElement !== null) {
            that.musicOptElement.style.top = height / 2 - SCREEN_HEIGHT * 0.042 + 'px';
            that.musicOptElement.style.width = SCREEN_WIDTH * 0.70 + "px";
            that.musicOptElement.style.height = SCREEN_HEIGHT * 0.083 + "px";
            that.musicOptElement.style.left = width / 2 - SCREEN_WIDTH * 0.375 + 'px';
        }

        if (that.musicOnElement !== null && that.musicOffElement !== null) {
            that.musicOnElement.style.width = SCREEN_WIDTH * 0.083 + "px";
            that.musicOnElement.style.height = SCREEN_HEIGHT * 0.050 + "px";
            that.musicOffElement.style.width = SCREEN_WIDTH * 0.083 + "px";
            that.musicOffElement.style.height = SCREEN_HEIGHT * 0.050 + "px";
        }

        if (that.soundOnElement !== null && that.soundOffElement !== null) {
            that.soundOnElement.style.width = SCREEN_WIDTH * 0.083 + "px";
            that.soundOnElement.style.height = SCREEN_HEIGHT * 0.050 + "px";
            that.soundOffElement.style.width = SCREEN_WIDTH * 0.083 + "px";
            that.soundOffElement.style.height = SCREEN_HEIGHT * 0.050 + "px";
        }

        if (that.gameOverDiv !== null) {
            that.gameOverDiv.style.width = SCREEN_WIDTH * 0.5 + 'px';
            that.gameOverDiv.style.height = SCREEN_HEIGHT * 0.12 + 'px';
            that.gameOverDiv.style.left = width / 2 - SCREEN_WIDTH * 0.25 + 'px';
            that.gameOverDiv.style.top = height / 2 - SCREEN_HEIGHT * 0.25 + 'px';
        }

        if (that.backDiv !== null) {
            that.backDiv.style.top = SCREEN_HEIGHT * 0.18 + 'px';
            that.backDiv.style.width = SCREEN_WIDTH * 0.25 + 'px';
        }
    };

    // отображение меню и инструкции на старте
    this.init = async function () {
        setPropertyForInnerElements(element);
        musicOptionsElement.style.display = 'none';
        appendStartMenu();
        appendOptionsMenu();
        appendRecords();
        that.updateHighScore();
        that.appendScoreSheet(null);
        appendInstructionsSheet();
        that.mainElement.appendChild(element);
        that.mainElement.appendChild(musicOptionsElement);
        that.update();
        initRecordsTable();
    };

    this.init();
};