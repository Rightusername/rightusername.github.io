$(function () {
    var storage = window.localStorage;
    var thumb = document.getElementById("thumb");
    var slider = document.getElementById("slider");
    var labelSpeed = document.getElementById("speed");
    thumb.style.left = storage.getItem("thumb") || 0 + "px";
    var level = 0;
    checkLevel();
    thumb.onmousedown = function (e) {

        var coords = getCoords(thumb);
        var shiftX = e.pageX - coords.left;
        slider.appendChild(thumb);
        moveAt(e);

        function moveAt(e) {

            if ((thumb.offsetLeft <= slider.offsetWidth - thumb.offsetWidth) && (thumb.offsetLeft >= 0)) {
                thumb.style.left = e.pageX - shiftX - getCoords(slider).left + 'px';
            }
            if (thumb.offsetLeft > slider.offsetWidth - thumb.offsetWidth) {
                thumb.style.left = slider.offsetWidth - thumb.offsetWidth + "px";
            }
            if (thumb.offsetLeft < 0) {
                thumb.style.left = 0 + "px";
            }
            storage.setItem("thumb",thumb.style.left);
            checkLevel();
        }
        

        document.onmousemove = function (e) {
            moveAt(e);
        };

        document.onmouseup = function (e) {
            document.onmousemove = null;
            thumb.onmouseup = null;
        };

        thumb.onmouseup = function () {
            document.onmousemove = null;
            thumb.onmouseup = null;
        };

    };

    thumb.ondragstart = function () {
        return false;
    };

    function getCoords(elem) {
        var box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };

    }
    function checkLevel() {
        if(thumb.offsetLeft >= 0 && thumb.offsetLeft <15){
            labelSpeed.textContent = "Speed: Very Easy";
            level = 0;
        }
        if(thumb.offsetLeft >= 15 && thumb.offsetLeft <30){
            labelSpeed.textContent = "Speed: Easy";
            level = 1;
        }
        if(thumb.offsetLeft >= 30 && thumb.offsetLeft <45){
            labelSpeed.textContent = "Speed: Medium";
            level = 2;
        }
        if(thumb.offsetLeft >= 45 && thumb.offsetLeft <60){
            labelSpeed.textContent = "Speed: Good";
            level = 3;
        }
        if(thumb.offsetLeft >= 60 && thumb.offsetLeft <75){
            labelSpeed.textContent = "Speed: Hard";
            level = 4;
        }
        if(thumb.offsetLeft >= 75 && thumb.offsetLeft <=90){
            labelSpeed.textContent = "Speed: HardCore";
            level = 5;
        }
        window.level = level;
    }

});

