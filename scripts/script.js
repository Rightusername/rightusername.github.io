$(function () {
    var Snake = function () {
        this.model = {
            field: [],
            direction: "left", // "top" "left" "right" "bot"
            sizeSnake: 7,
            fieldHeight: 20,
            fieldWidth: 30,
            snakeX: [],
            snakeY: [],
            foodX: 0,
            foodY: 0,
            isDead: false,
            score: 0,
            multiplier:1
        };
        this.levels = [250,180,120,80,50,30];
        this.speed = this.levels[window.level];
        this.initMultiplier();
        this.sounds = {
            eat: new Audio(),
            cow: new Audio(),
            end: new Audio(),
            horse: new Audio()
        };
        this.initView();
        this.scoreView = $("#score");
        this.interval = undefined;
        this.field = this.createFieldView();

        this.init();

    };

    Snake.prototype.initField = function () {
        for (var i = 0; i < this.model.fieldHeight; i++) {
            var arr = [];
            for (var j = 0; j < this.model.fieldWidth; j++) {
                arr.push(0);
            }
            this.model.field.push(arr);
        }
    };

    Snake.prototype.spawnSnake = function () {
        var startX = Math.floor((this.model.fieldWidth - this.model.sizeSnake) / 2);
        for (var i = startX; i < startX + this.model.sizeSnake; i++) {
            this.model.snakeX.push(i);
            this.model.snakeY.push(5);
        }
    };

    Snake.prototype.spawnFood = function () {
        var y = Math.floor(Math.random() * this.model.fieldHeight);
        var x = Math.floor(Math.random() * this.model.fieldWidth);
        if (this.model.field[y][x] == 0) {
            this.model.field[y][x] = this.getRandomFood();
            this.model.foodX = x;
            this.model.foodY = y;
        } else {
            this.spawnFood();
        }
    };

    Snake.prototype.getRandomFood = function () {
        var c = Math.random();
        if (c < 0.20) {
            return 3;
        }
        if(c >0.20 && c<0.24){
            return 4;
        }
        return 2;
    };

    Snake.prototype.snakeOnField = function () {
        for (var i = 0; i < this.model.snakeX.length; i++) {
            this.model.field[this.model.snakeY[i]][this.model.snakeX[i]] = 1;
        }
    };

    Snake.prototype.clearModel = function () {
        for (var i = 0; i < this.model.fieldHeight; i++) {
            for (var j = 0; j < this.model.fieldWidth; j++) {
                this.model.field[i][j] = 0;
            }
        }
        this.model.snakeX = [];
        this.model.snakeY = [];
        this.model.isDead = false;
        this.model.direction = "left";
        this.model.score = 0;

    };

    Snake.prototype.clearField = function () {
        for (var i = 0; i < this.model.fieldHeight; i++) {
            for (var j = 0; j < this.model.fieldWidth; j++) {
                if (this.model.field[i][j] < 2) {
                    this.model.field[i][j] = 0;
                }
            }
        }
    };

    Snake.prototype.createFieldView = function () {
        var ar = [];
        var fr = document.createDocumentFragment();
        for (var i = 0; i < this.model.fieldHeight; i++) {
            var t = [];
            var tr = document.createElement("tr");
            for (var j = 0; j < this.model.fieldWidth; j++) {
                var td = document.createElement("td");
                td.classList.add("empty");
                tr.appendChild(td);
                t.push(td);
            }
            ar.push(t);
            fr.appendChild(tr);
        }
        $("#field").html(fr);
        return ar;
    };

    Snake.prototype.render = function () {
        for (var i = 0; i < this.model.fieldHeight; i++) {
            for (var j = 0; j < this.model.fieldWidth; j++) {
                switch (this.model.field[i][j]) {
                    case 0:
                        this.field[i][j].className = "empty";
                        break;
                    case 1:
                        this.field[i][j].className = "snakeBody";
                        break;
                    case 2:
                        this.field[i][j].className = "food";
                        break;
                    case 3:
                        this.field[i][j].className = "foodCow";
                        break;
                    case 4:
                        this.field[i][j].className = "foodHorse";
                        break;
                }
            }
        }
        this.scoreView.html("Score : "+ this.model.score);
        this.renderHead();
        this.renderBody();
        this.renderEnd();
    };

    Snake.prototype.renderBody = function () {
        for (var i = 1; i < this.model.snakeX.length - 1; i++) {
            //top-left angle
            if (this.model.snakeX[i] == this.model.snakeX[i + 1] && this.model.snakeY[i] == this.model.snakeY[i - 1] && this.model.snakeX[i] < this.model.snakeX[i - 1] && this.model.snakeY[i] < this.model.snakeY[i + 1]) {
                this.field[this.model.snakeY[i]][this.model.snakeX[i]].classList.add("snakeBodyTLAngle");
            }
            if (this.model.snakeX[i] == this.model.snakeX[i - 1] && this.model.snakeY[i] == this.model.snakeY[i + 1] && this.model.snakeX[i] < this.model.snakeX[i + 1] && this.model.snakeY[i] < this.model.snakeY[i - 1]) {
                this.field[this.model.snakeY[i]][this.model.snakeX[i]].classList.add("snakeBodyTLAngle");
            }
            // // //bot-right angle
            if (this.model.snakeX[i] == this.model.snakeX[i + 1] && this.model.snakeY[i] == this.model.snakeY[i - 1] && this.model.snakeX[i] > this.model.snakeX[i - 1] && this.model.snakeY[i] > this.model.snakeY[i + 1]) {
                this.field[this.model.snakeY[i]][this.model.snakeX[i]].classList.add("snakeBodyBRAngle");
            }
            if (this.model.snakeX[i] == this.model.snakeX[i - 1] && this.model.snakeY[i] == this.model.snakeY[i + 1] && this.model.snakeX[i] > this.model.snakeX[i + 1] && this.model.snakeY[i] > this.model.snakeY[i - 1]) {
                this.field[this.model.snakeY[i]][this.model.snakeX[i]].classList.add("snakeBodyBRAngle");
            }
            // top-right angle
            if (this.model.snakeX[i] == this.model.snakeX[i - 1] && this.model.snakeY[i] == this.model.snakeY[i + 1] && this.model.snakeX[i] > this.model.snakeX[i + 1] && this.model.snakeY[i] < this.model.snakeY[i - 1]) {
                this.field[this.model.snakeY[i]][this.model.snakeX[i]].classList.add("snakeBodyTRAngle");
            }
            if (this.model.snakeX[i] == this.model.snakeX[i + 1] && this.model.snakeY[i] == this.model.snakeY[i - 1] && this.model.snakeX[i] > this.model.snakeX[i - 1] && this.model.snakeY[i] < this.model.snakeY[i + 1]) {
                this.field[this.model.snakeY[i]][this.model.snakeX[i]].classList.add("snakeBodyTRAngle");
            }
            // bot-left angle
            if (this.model.snakeX[i] == this.model.snakeX[i - 1] && this.model.snakeY[i] == this.model.snakeY[i + 1] && this.model.snakeX[i] < this.model.snakeX[i + 1] && this.model.snakeY[i] > this.model.snakeY[i - 1]) {
                this.field[this.model.snakeY[i]][this.model.snakeX[i]].classList.add("snakeBodyBLAngle");
            }
            if (this.model.snakeX[i] == this.model.snakeX[i + 1] && this.model.snakeY[i] == this.model.snakeY[i - 1] && this.model.snakeX[i] < this.model.snakeX[i - 1] && this.model.snakeY[i] > this.model.snakeY[i + 1]) {
                this.field[this.model.snakeY[i]][this.model.snakeX[i]].classList.add("snakeBodyBLAngle");
            }
        }
    };

    Snake.prototype.renderHead = function () {
        var className = '';
        var headX = this.model.snakeX[0];
        var headY = this.model.snakeY[0];
        var foodX = this.model.foodX;
        var foodY = this.model.foodY;
        switch (this.model.direction) {
            case "left":
                if (foodX + 1 == headX && foodY == headY) {
                    className = "headEatLeft";
                } else {
                    className = "headLeft";
                }
                break;
            case "right":
                if (foodX - 1 == headX && foodY == headY) {
                    className = "headEatRight";
                } else {
                    className = "headRight";
                }
                break;
            case "top":
                if (foodY + 1 == headY && foodX == headX) {
                    className = "headEatTop";
                } else {
                    className = "headTop";
                }
                break;
            case "bot":
                if (foodY - 1 == headY && foodX == headX) {
                    className = "headEatBot";
                } else {
                    className = "headBot";
                }
                break;
        }if (this.model.isDead) {
            className= "headFail";
        }
        this.field[headY][headX].className = className;
    };

    Snake.prototype.renderEnd = function () {
        var l = this.model.snakeX.length - 1;
        //bot
        if (this.model.snakeX[l] == this.model.snakeX[l - 1] && this.model.snakeY[l] > this.model.snakeY[l - 1]) {
            this.field[this.model.snakeY[l]][this.model.snakeX[l]].classList.add("snakeEndBot");
        }
        if (this.model.snakeX[l] == this.model.snakeX[l - 1] && this.model.snakeY[l] < this.model.snakeY[l - 1]) {
            this.field[this.model.snakeY[l]][this.model.snakeX[l]].classList.add("snakeEndTop");
        }
        if (this.model.snakeX[l] > this.model.snakeX[l - 1] && this.model.snakeY[l] == this.model.snakeY[l - 1]) {
            this.field[this.model.snakeY[l]][this.model.snakeX[l]].classList.add("snakeEndRight");
        }
        if (this.model.snakeX[l] < this.model.snakeX[l - 1] && this.model.snakeY[l] == this.model.snakeY[l - 1]) {
            this.field[this.model.snakeY[l]][this.model.snakeX[l]].classList.add("snakeEndLeft");
        }
    };

    Snake.prototype.init = function () {
        this.soundsInit();
        var __self = this;
        this.initField();
        this.spawnSnake();
        this.snakeOnField();
        this.keyListeners(this);
        this.spawnFood();
        this.interval = setInterval(function () {
            __self.step();
        }, this.speed);

        this.render();
    };
    
    
    Snake.prototype.initMultiplier = function () {
        var index;
        for (var i = 0; i < this.levels.length; i++) {
            if(this.speed == this.levels[i]){
                index = i;
            }

        }
        switch (index){
            case 0:
                this.multiplier = 1;
                break;
            case 1:
                this.multiplier = 1.5;
                break;
            case 2:
                this.multiplier = 2;
                break;
            case 3:
                this.multiplier = 3;
                break;
            case 4:
                this.multiplier = 5;
                break;
            case 5:
                this.multiplier = 10;
                break;
        }
    };

    Snake.prototype.finishGame = function () {
        clearInterval(this.interval);
        this.model.isDead = true;
        soundPlay("endGame", this);
    };

    Snake.prototype.newGame = function () {
        var __self = this;
        this.speed = this.levels[window.level];
        this.initMultiplier();
        this.clearModel();
        this.spawnSnake();
        this.snakeOnField();
        this.spawnFood();
        clearInterval(this.interval);
        this.interval = setInterval(function () {
            __self.step();
        }, this.speed);
        this.render();
        console.log(window.level);
    };

    Snake.prototype.initView = function () {
        $("body").css("height", window.innerHeight);
        $("#settings").css("top", (window.innerHeight - document.getElementById("settings").offsetHeight)/2);
        $("#settings").css("left", (window.innerWidth - document.getElementById("settings").offsetWidth)/2);
    };

    Snake.prototype.keyListeners = function (self) {
        addEventListener("keydown", function (e) {
            switch (e.keyCode) {
                case 39:
                case 68:
                if (self.model.direction != "left") {
                    self.model.direction = "right";
                    // self.step();
                }
                break;
                case 83:
                case 40:
                    if (self.model.direction != "top") {
                        self.model.direction = "bot";
                        // self.step();
                    }
                    break;
                case 87:
                case 38:
                    if (self.model.direction != "bot") {
                        self.model.direction = "top";
                        // self.step();
                    }
                    break;
                case 37:
                case 65:
                    if (self.model.direction != "right") {
                        self.model.direction = "left";
                        // self.step();
                    }
                    break;

            }
        });
        $("#newgame").on("click",this.newGame.bind(this));
        $("#btnSetApply").on("click",function () {
            self.model.speed = $("#settingsVal").val();
            self.newGame();
        });
        $("#btnSettings").on("click",function () {
            $("#settings").css("display","block");
        });
    };

    Snake.prototype.step = function () {
        this.move();
        this.clearField();
        this.snakeOnField();
        this.render();
    };

    Snake.prototype.eat = function (index, t) {
        soundPlay(t.model.field[t.model.foodY][t.model.foodX], t);
        switch (index){
            case 2:
                t.model.score+=Math.floor(1*t.multiplier);
                break;
            case 3:
                t.model.score+=Math.floor(5*t.multiplier);
                break;
            case 4:
                t.model.score+=Math.floor(20*t.multiplier);
                break;
        }
    };

    Snake.prototype.move = function () {
        var previousY = this.model.snakeY[0];
        var previousX = this.model.snakeX[0];
        var t, t2;
        switch (this.model.direction) {
            case "top":
                if (this.model.snakeY[0] == 0) {
                    this.finishGame();
                } else {
                    if (this.model.field[this.model.snakeY[0] - 1][this.model.snakeX[0]] == 1) {
                        this.finishGame();
                    } else {
                        this.model.snakeY[0] -= 1;
                    }
                }
                break;
            case "bot":
                if (this.model.snakeY[0] == this.model.fieldHeight - 1) {
                    this.finishGame();
                } else {
                    if (this.model.field[this.model.snakeY[0] + 1][this.model.snakeX[0]] == 1) {
                        this.finishGame();
                    } else {
                        this.model.snakeY[0] += 1;
                    }
                }
                break;
            case "left":
                if (this.model.snakeX[0] == 0) {
                    this.finishGame();
                } else {
                    if (this.model.field[this.model.snakeY[0]][this.model.snakeX[0]-1] == 1) {
                        this.finishGame();
                    } else {
                        this.model.snakeX[0] -= 1;
                    }
                }
                break;
            case "right":
                if (this.model.snakeX[0] == this.model.fieldWidth - 1) {
                    this.finishGame();
                } else {
                    if (this.model.field[this.model.snakeY[0]][this.model.snakeX[0] + 1] == 1) {
                        this.finishGame();
                    } else {
                        this.model.snakeX[0] += 1;
                    }
                }
                break;
        }
        if(this.model.isDead){
            return;
        }
        if (this.model.snakeX[0] == this.model.foodX && this.model.snakeY[0] == this.model.foodY) {
            this.eat(this.model.field[this.model.foodY][this.model.foodX], this);
            this.spawnFood();
            this.model.snakeX.splice(1, 0, previousX);
            this.model.snakeY.splice(1, 0, previousY);
        } else {
            for (var i = 1; i < this.model.snakeX.length; i++) {
                t = previousX;
                t2 = previousY;
                previousX = this.model.snakeX[i];
                previousY = this.model.snakeY[i];
                this.model.snakeX[i] = t;
                this.model.snakeY[i] = t2;
            }
        }
    };

    Snake.prototype.soundsInit = function () {
        this.sounds.end.src = "sounds/headshot1.wav";
        this.sounds.eat.src = "sounds/eat.mp3";
        this.sounds.cow.src = "sounds/cow.wav";
        this.sounds.horse.src = "sounds/horse.wav";
    };

    function soundPlay(index, t) {
        switch (index) {
            case 3:
                t.sounds.cow.play();
                break;
            case 2:
                t.sounds.eat.play();
                break;
            case "endGame":
                t.sounds.end.play();
                break;
            case 4:
                t.sounds.horse.play();
                break;
        }
    }


    window.Snake = new Snake();
});







