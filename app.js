/**
 * Created by Brian on 28/10/2014.
 */
;var labyrinth = (function(win, doc, $) {
    var config = {
        stop: true,
        chars: ['\\', '/'],

        typefaces: {
            courierNew: {
                fontFamily: '"Courier New", Monospace',
                letterSpacing: '-0.26em',
                lineHeight: '0.73em',
                transform: 'scaleX(2)',
                width: '70%',
                fontWeight: '800'
            },
            c64: {
                fontFamily: 'commodore',
                letterSpacing: '-0.26em',
                lineHeight: '0.7em',
                transform: 'scaleX(1)',
                width: '103%',
                fontWeight: '400'
            }
        },

        presets: {
            c64: {
                color: '#0FF',
                backgroundColor: '#08C',
                textShadow: 'none'
            },
            c64retro: {
                color: '#0FF',
                backgroundColor: '#08C',
                textShadow: 'none',
                typeface: 'c64'
            },
            monokai: {
                color: '#F8F8F2',
                backgroundColor: '#272822',
                textShadow: 'none'
            },
            cobalt: {
                color: '#FFF',
                backgroundColor: '#002240',
                textShadow: 'none'
            },
            halloween: {
                color: '#FFB84E',
                backgroundColor: '#03111D',
                textShadow: 'none'
            },
            eldorado: {
                color: '#4A3C03',
                backgroundColor: '#FFE033',
                textShadow: '0.05em 0.01em 0.1em #5D5110'
            },
            shadow: {
                color: '#0FF',
                backgroundColor: '#08C',
                textShadow: '0.09em 0.04em #005D5D'
            },
            busy: {
                color: '#0FF',
                backgroundColor: '#08C',
                textShadow: '0.1em 0.1em 0.1em rgb(0, 93, 93), -0.2em 0.8em rgb(0, 155, 93), 0 1.1em 0.1em rgb(0, 44, 44)'
            }
        }
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
                typeface: $('#typeface'),
                fontSize: $('#fontSize'),
                fontColour: $('#fontColour'),
                bgColour: $('#bgColour'),
                presets: $('#presets')
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
            changeTypeFace: function() {
                var typeface = config.typefaces[el.render.style.typeface.value];
                for (var prop in typeface){
                    el.view.style[prop] = typeface[prop];
                }
            },
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
            },
            changePreset: function() {
                var preset = config.presets[el.render.style.presets.value];
                for (var prop in preset) {
                    el.view.style[prop] = preset[prop];
                }
                el.render.style.fontColour.value = preset.color;
                el.render.style.bgColour.value =  preset.backgroundColor;

                el.render.style.typeface.value = preset.typeface || 'courierNew';
                actions.style.changeTypeFace();

                actions.style.changeFontColour();
                actions.style.changeBgColour();
            }
        }
    };

    var setup = function() {
        el.render.buttons.start.onclick = actions.start;
        el.render.buttons.stop.onclick = actions.stop;
        el.render.buttons.clear.onclick = actions.clear;
        el.render.infinite.onclick = actions.toggleInfiniteRendering;

        el.render.style.typeface.onchange = actions.style.changeTypeFace;
        el.render.style.fontSize.onchange = actions.style.changeFontSize;
        el.render.style.fontColour.onkeyup = actions.style.changeFontColour;
        el.render.style.bgColour.onkeyup = actions.style.changeBgColour;

        el.render.style.presets.onchange = actions.style.changePreset;
    };

    return {
        setup: setup
    };
})(window, document, document.querySelector.bind(document));

labyrinth.setup();