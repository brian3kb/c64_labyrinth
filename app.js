/**
 * Created by Brian on 28/10/2014.
 */
;var labyrinth = (function(win, doc, $) {
    var config = {
        stop: true,
        chars: ['\\', '/']
    };

    var el = {
        view: $('.view')
    };

    var tick = function() {
        el.view.innerHTML += config.chars[Math.round(Math.random())];
        win.scrollTo(0, el.view.scrollHeight);
        if (el.view.innerHTML.length > 5000) stop();
        if(!config.stop) win.requestAnimationFrame(tick);
    };

    var start = function() {
        config.stop = false;
        win.requestAnimationFrame(tick);
    };

    var stop = function() {
        config.stop = true;
    };

    return {
        start: start,
        stop: stop
    };
})(window, document, document.querySelector.bind(document));

labyrinth.start();