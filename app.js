/**
 * Created by Brian on 28/10/2014.
 */
;var labyrinth = (function(win, doc, $) {
    var config = {
        stop: true,
        chars: ['\\', '/']
    };

    var el = {
        view: $('.view'),

        render: {
            count: $('#count'),
            infinite: $('#infinite'),
            by: {
                char: $('#renderChars'),
                line: $('#renderLines'),
                screen: $('#renderScreens')
            },
            buttons: {
                start: $('#start'),
                stop: $('#stop'),
                clear: $('#clear')
            },
            style: {
                fontSize: $('#fontSize'),
                fontColour: $('#fontColour'),
                bgColour: $('#bgColour')
            }
        }
    };

    var getLineSizeInChars = function() {
        var char = win.getComputedStyle(el.view, null).getPropertyValue('font-size').split('px')[0],
            width = win.innerWidth;
        return width / char;
    };

    var getCharsToFillScreen = function() {
        var char = win.getComputedStyle(el.view, null).getPropertyValue('font-size').split('px')[0],
            height = win.innerHeight;
        return (height / char) * getLineSizeInChars();
    };

    var tick = function() {
        var getBatch = function(count) {
                for (var a = [], i = 0; i < count; ++i ) a[i]=config.chars[Math.round(Math.random())];
                return a.join('');
            },
            batch = '';
        if(el.render.by.char.checked) batch = getBatch(1);
        if(el.render.by.line.checked) batch = getBatch(getLineSizeInChars());
        if(el.render.by.screen.checked) batch = getBatch(getCharsToFillScreen());

        el.view.innerHTML += batch;
        win.scrollTo(0, el.view.scrollHeight);
        if(!el.render.infinite.checked && el.view.innerHTML.length > +el.render.count.value) actions.stop();
        if(!config.stop) win.requestAnimationFrame(tick);
    };

    var actions = {
        start: function() {
            if(!config.stop) return;
            el.render.buttons.start.disabled = true;
            el.render.buttons.stop.disabled  = false;
            el.render.buttons.clear.disabled  = true;
            config.stop = false;
            win.requestAnimationFrame(tick);
        },
        stop: function() {
            el.render.buttons.start.disabled = false;
            el.render.buttons.stop.disabled  = true;
            el.render.buttons.clear.disabled  = false;
            config.stop = true;
        },
        clear: function() {
            actions.stop();
            el.view.innerHTML = '';
        },
        toggleInfiniteRendering: function() {
            el.render.count.disabled = !el.render.count.disabled;
        },
        style: {
            changeFontSize: function() {
                el.view.style.fontSize = el.render.style.fontSize.value + 'em';
            },
            changeFontColour: function() {
                el.view.style.color = el.render.style.fontColour.value;
                el.render.style.fontColour.style.backgroundColor = el.render.style.fontColour.value;
            },
            changeBgColour: function() {
                $('body').style.backgroundColor = el.render.style.bgColour.value;
                el.view.style.backgroundColor = el.render.style.bgColour.value;
                el.render.style.bgColour.style.backgroundColor = el.render.style.bgColour.value;
            }
        }
    };

    var setup = function() {
        el.render.buttons.start.onclick = actions.start;
        el.render.buttons.stop.onclick = actions.stop;
        el.render.buttons.clear.onclick = actions.clear;
        el.render.infinite.onclick = actions.toggleInfiniteRendering;

        el.render.style.fontSize.onchange = actions.style.changeFontSize;
        el.render.style.fontColour.onkeyup = actions.style.changeFontColour;
        el.render.style.bgColour.onkeyup = actions.style.changeBgColour;
    };

    return {
        setup: setup
    };
})(window, document, document.querySelector.bind(document));

labyrinth.setup();