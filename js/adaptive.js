~(function (desW) {
    var winW = document.documentElement.clientWidth;
    var ratio = winW/desW;
    document.documentElement.style.fontSize = ratio*100 + 'px';
})(750);