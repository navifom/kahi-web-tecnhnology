/* Basic program animation (plain ES3, works in old browsers).
   Principles: one universal animate() driven by a timer, progress is
   calculated from elapsed time (not from a frame counter), the "delta"
   function turns linear progress into the motion law, and the "step"
   function only draws. */

function animate(opts) {
    var start = new Date().getTime();
    var timer = setInterval(function () {
        var progress = (new Date().getTime() - start) / opts.duration;
        if (progress > 1) {
            progress = 1;
        }
        opts.step(opts.delta(progress));
        if (progress === 1) {
            clearInterval(timer);
            if (opts.complete) {
                opts.complete();
            }
        }
    }, opts.delay || 10);
    return timer;
}

/* motion laws: progress 0..1 -> 0..1 */

function bounce(progress) {
    var a = 0;
    var b = 1;
    while (true) {
        if (progress >= (7 - 4 * a) / 11) {
            return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
        }
        a += b;
        b /= 2;
    }
}

function makeEaseOut(delta) {
    return function (progress) {
        return 1 - delta(1 - progress);
    };
}

function makeEaseInOut(delta) {
    return function (progress) {
        if (progress < 0.5) {
            return delta(2 * progress) / 2;
        }
        return (2 - delta(2 * (1 - progress))) / 2;
    };
}

function quad(progress) {
    return Math.pow(progress, 2);
}

/* page animation: the BluChips picture drops in with a bounce and then
   travels along a figure-eight path with smooth acceleration */

function startPictureAnimation() {
    var picture = document.getElementById('bluchips');
    if (!picture) {
        return;
    }

    var bounceOut = makeEaseOut(bounce);
    var smooth = makeEaseInOut(quad);

    function loop() {
        animate({
            delay: 10,
            duration: 5000,
            delta: smooth,
            step: function (t) {
                var angle = t * 2 * Math.PI;
                picture.style.left = Math.round(24 * Math.sin(angle)) + 'px';
                picture.style.top = Math.round(16 * Math.sin(2 * angle)) + 'px';
            },
            complete: loop
        });
    }

    picture.style.top = '-60px';
    animate({
        delay: 10,
        duration: 1500,
        delta: bounceOut,
        step: function (value) {
            picture.style.top = Math.round(-60 * (1 - value)) + 'px';
        },
        complete: loop
    });
}

window.onload = startPictureAnimation;
