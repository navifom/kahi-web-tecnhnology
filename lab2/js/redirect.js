/* redirects the visitor to the main page 3 s after the page is loaded */

var REDIRECT_URL = 'lab2.html';
var REDIRECT_DELAY = 3;

function startRedirect() {
    var left = REDIRECT_DELAY;
    var counter = document.getElementById('count');

    var timer = setInterval(function () {
        left = left - 1;
        if (counter && left >= 0) {
            counter.innerHTML = left;
        }
        if (left <= 0) {
            clearInterval(timer);
        }
    }, 1000);

    setTimeout(function () {
        window.location.replace(REDIRECT_URL);
    }, REDIRECT_DELAY * 1000);
}

window.onload = startRedirect;
