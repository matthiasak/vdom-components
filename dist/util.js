'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.app = exports.page = exports.hashrouter = exports.injectSVG = exports.imageLoader = exports.scrambler = exports.markdown = exports.trackVisibility = undefined;

var _universalUtils = require('universal-utils');

var u = _interopRequireWildcard(_universalUtils);

var _head = require('./head');

var head = _interopRequireWildcard(_head);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var fp = u.fp;
var vdom = u.vdom;
var lazy = u.lazy;
var hamt = u.hamt;
var csp = u.csp;
var _fetch = u.fetch;
var _r = u.router.router;
var debounce = vdom.debounce;
var m = vdom.m;
var html = vdom.html;
var rAF = vdom.rAF;
var mount = vdom.mount;
var update = vdom.update;
var qs = vdom.qs;
var container = vdom.container;


/**
 * monitors scrolling to indicate if an element is visible within the viewport
 */

/*
likely include with your SCSS for a project, that makes these styles hide/show the element:

.invisible {
    opacity: 0;
    transition-delay: .5s;
    transition-duration: .5s;
    &.visible {
        opacity: 1;
    }
}
 */

var viewportHeight = function viewportHeight(_) {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
};

var trackVisibility = function trackVisibility(component) {
    var el = void 0,
        visible = el.getBoundingClientRect instanceof Function ? false : true;

    var onScroll = debounce(function (ev) {
        if (!el.getBoundingClientRect instanceof Function) return;

        var _el$getBoundingClient = el.getBoundingClientRect();

        var top = _el$getBoundingClient.top;
        var height = _el$getBoundingClient.height;
        var vh = viewportHeight();
        if (top <= vh && !visible) {
            el.className += ' visible';
            visible = true;
        } else if (top > vh && visible) {
            el.className = el.className.replace(/ visible/g, '');
            visible = false;
        }
    }, 16.6);

    var startScroll = function startScroll(_el) {
        el = _el;
        window.addEventListener('scroll', onScroll);
    };

    var endScroll = function endScroll(_) {
        return window.removeEventListener('scroll', onScroll);
    };

    rAF(onScroll);

    return m('div.invisible', { config: startScroll, unload: endScroll }, component);
};

/**
 * MARKDEEP / MARKDOWN - convert a section with string content
 * into a markdeep/markdown rendered section
*/

var markdown = function markdown(content) {
    var markdownToHtml = arguments.length <= 1 || arguments[1] === undefined ? function (c) {
        return global.markdeep.format(c);
    } : arguments[1];

    var config = function config(element, init) {
        element.innerHTML = markdownToHtml(content);
    };
    return m('.markdeep', { config: config });
};

/**
 * scrambled text animation
 *
 * m('span', {config: animatingTextConfig('test me out')})
 */
var chars = '#*^-+=!f0123456789_';
var scramble = function scramble(str) {
    var from = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    return str.slice(0, from) + str.slice(from).split('').map(function (x) {
        return x === ' ' ? x : chars[range(0, chars.length)];
    }).join('');
};
var range = function range(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};
var wait = function wait(ms) {
    return new Promise(function (res) {
        return setTimeout(res, ms);
    });
};

var scrambler = function scrambler(str) {
    var interval = arguments.length <= 1 || arguments[1] === undefined ? 33 : arguments[1];
    var i = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    var delay = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
    return function (el) {
        var start = scramble(str, 0);
        var draw = function draw(i) {
            return function () {
                return el.innerText = str.slice(0, i) + start.slice(i);
            };
        };
        while (i++ < str.length) {
            wait(delay + i * interval).then(draw(i));
        }
    };
};

/**
 * load an image in JS, and then animate it in as a background image
 *
 * imageLoader(url, m('div'))
 */
var imageLoader = function imageLoader(url, comp) {
    var x = comp,
        image = void 0,
        loaded = false;

    while (x instanceof Function) {
        x = x();
    }var imgConfig = function imgConfig(el) {
        image = new Image();

        el.style.backgroundImage = 'url(' + url + ')';

        var done = function done(ev) {
            if (loaded) return;
            el.className += ' loaded';
            loaded = true;
        };

        image.onload = done;
        image.src = url;
    };

    x.config = imgConfig;
    return x;
};

/**
 * load an SVG and inject it onto the page
 */
var loadSVG = function loadSVG(url) {
    return fetch(url).then(function (r) {
        return r.text();
    });
};
var injectSVG = function injectSVG(url) {
    return container(function (data) {
        return m('div', { config: function config(el) {
                return el.innerHTML = data.svg;
            } });
    }, { svg: loadSVG.bind(null, url) });
};

/**
 * hashroute-driven router
 */
// router implementation
var hashrouter = function hashrouter() {
    var routes = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var def = arguments.length <= 1 || arguments[1] === undefined ? '#' : arguments[1];
    var current = arguments[2];

    var x = _r(routes, function (el) {
        current = el;
        update();
    });
    x.listen();
    x.trigger((window.location.hash || def).slice(1));
    return function () {
        return current;
    };
};

/**
 * page component that returns an entire html component
 */
var page = function page(router, title) {
    var css = arguments.length <= 2 || arguments[2] === undefined ? '/style.css' : arguments[2];
    var googleAnalyticsId = arguments[3];
    return [head.head(head.theme(), head.mobile_metas(title), m('link', { type: 'text/css', rel: 'stylesheet', href: css }), googleAnalyticsId && head.googleAnalytics(googleAnalyticsId)), m('body', router)];
};

/**
 * mount the entire page() component to the DOM
 */
var app = function app(routes, def, title, analyticsId) {
    var router = hashrouter(routes, def);
    return function () {
        return mount(page(router, title, analyticsId), qs('html', document));
    };
};

exports.trackVisibility = trackVisibility;
exports.markdown = markdown;
exports.scrambler = scrambler;
exports.imageLoader = imageLoader;
exports.injectSVG = injectSVG;
exports.hashrouter = hashrouter;
exports.page = page;
exports.app = app;