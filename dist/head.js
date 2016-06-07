'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.applinks = exports.chrome = exports.safari = exports.iOS = exports.google_plus = exports.twitter_card = exports.fb_instantarticle = exports.fb_opengraph = exports.googleAnalytics = exports.mobile_metas = exports.theme = exports.head = undefined;

var _universalUtils = require('universal-utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* huge ups to John Buschea (https://github.com/joshbuchea/HEAD) */

var debounce = _universalUtils.vdom.debounce;
var m = _universalUtils.vdom.m;
var html = _universalUtils.vdom.html;
var rAF = _universalUtils.vdom.rAF;
var mount = _universalUtils.vdom.mount;
var update = _universalUtils.vdom.update;
var qs = _universalUtils.vdom.qs;
var container = _universalUtils.vdom.container;


var head = function head() {
    for (var _len = arguments.length, c = Array(_len), _key = 0; _key < _len; _key++) {
        c[_key] = arguments[_key];
    }

    var loaded_once = false;
    var config = function config(el) {
        return loaded_once = true;
    };
    return m('head', { config: config, shouldUpdate: function shouldUpdate(el) {
            return !el;
        } }, c);
};

// More info: https://developer.chrome.com/multidevice/android/installtohomescreen
var theme = function theme() {
    var color = arguments.length <= 0 || arguments[0] === undefined ? 'black' : arguments[0];
    return [m('meta', { name: 'theme-color', content: color }), m('meta', { name: 'msapplication-TileColor', content: color })];
};

var mobile_metas = function mobile_metas() {
    var title = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    var img = arguments.length <= 1 || arguments[1] === undefined ? 'icon' : arguments[1];
    var manifest = arguments.length <= 2 || arguments[2] === undefined ? 'manifest' : arguments[2];
    return [m('meta', { charset: 'utf8' }), m('meta', { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' }), m('meta', { name: "viewport", content: "width=device-width, initial-scale=1.0, shrink-to-fit=no" }), m('title', title)].concat(_toConsumableArray(['HandheldFriendly,True', 'MobileOptimized,320', 'mobile-web-app-capable,yes', 'apple-mobile-web-app-capable,yes', 'apple-mobile-web-app-title,' + title, 'msapplication-TileImage,/' + img + '-144x144.png', 'msapplication-square70x70logo,/smalltile.png', 'msapplication-square150x150logo,/mediumtile.png', 'msapplication-wide310x150logo,/widetile.png', 'msapplication-square310x310logo,/largetile.png'].map(function (x) {
        return m('meta', { name: x.split(',')[0], content: x.split(',')[1] });
    })), [
    // ...([512,180,152,144,120,114,76,72].map(x =>
    //     m('link', {rel: 'apple-touch-icon-precomposed', sizes:`${x}x${x}`, href:`/${img}-${x}x${x}.png`}))),
    m('link', { rel: 'apple-touch-icon-precomposed', href: '/' + img + '-180x180.png' }), m('link', { rel: 'apple-touch-startup-image', href: '/' + img + '-startup.png' }), m('link', { rel: 'shortcut icon', href: '/' + img + '.ico', type: 'image/x-icon' }), m('link', { rel: 'manifest', href: '/' + manifest + '.json' })]);
};

/**
 * Google Analytics
 */
var googleAnalytics = function googleAnalytics(id) {
    var x = function x() {
        window.ga = window.ga || function () {
            window.ga.q = (window.ga.q || []).push(arguments);
        };
        var ga = window.ga;
        ga('create', id, 'auto');
        ga('send', 'pageview');
    };
    return m('script', { config: x, src: 'https://www.google-analytics.com/analytics.js', l: 1 * new Date(), async: 1 });
};

// Facebook: https://developers.facebook.com/docs/sharing/webmasters#markup
// Open Graph: http://ogp.me/

var fb_opengraph = function fb_opengraph(app_id, url, title, img, site_name, author) {
    return ['fb:app_id,' + app_id, 'og:url,' + url, 'og:type,website', 'og:title,' + title, 'og:image,' + img, 'og:description,' + description, 'og:site_name,' + site_name, 'og:locale,en_US', 'article:author,' + author].map(function (x, i, a) {
        var p = arguments.length <= 3 || arguments[3] === undefined ? x.split(',') : arguments[3];
        return m('meta', { property: p[0], content: p[1] });
    });
};

var fb_instantarticle = function fb_instantarticle(article_url, style) {
    return [m('meta', { property: "op:markup_version", content: "v1.0" }), m('link', { rel: "canonical", href: article_url }), m('meta', { property: "fb:article_style", content: style })];
};

// More info: https://dev.twitter.com/cards/getting-started
// Validate: https://dev.twitter.com/docs/cards/validation/validator
var twitter_card = function twitter_card(summary, site_account, individual_account, url, title, description, image) {
    return ['twitter:card,' + summary, 'twitter:site,@' + site_account, 'twitter:creator,@' + individual_account, 'twitter:url,' + url, 'twitter:title,' + title, 'twitter:description,' + description, 'twitter:image,' + image].map(function (x, i, a) {
        var n = arguments.length <= 3 || arguments[3] === undefined ? x.split(',') : arguments[3];
        return m('meta', { name: n[0], content: n[1] });
    });
};

var google_plus = function google_plus(page, title, desc, img) {
    return [m('link', { href: 'https://plus.google.com/+' + page, rel: 'publisher' }), m('meta', { itemprop: "name", content: title }), m('meta', { itemprop: "description", content: desc }), m('meta', { itemprop: "image", content: img })];
};

// More info: https://developer.apple.com/safari/library/documentation/appleapplications/reference/safarihtmlref/articles/metatags.html
var iOS = function iOS(app_id, affiliate_id, app_arg) {
    var telephone = arguments.length <= 3 || arguments[3] === undefined ? 'yes' : arguments[3];
    var title = arguments[4];
    return [
    // Smart App Banner
    'apple-itunes-app,app-id=' + app_id + ',affiliate-data=' + affiliate_id + ',app-argument=' + app_arg,

    // Disable automatic detection and formatting of possible phone numbers -->
    'format-detection,telephone=' + telephone,

    // Add to Home Screen
    'apple-mobile-web-app-capable,yes', 'apple-mobile-web-app-status-bar-style,black', 'apple-mobile-web-app-title,' + title].map(function (x, i, a) {
        var n = arguments.length <= 3 || arguments[3] === undefined ? x.split(',') : arguments[3];
        return m('meta', { name: n[0], content: n[1] });
    });
};

// Pinned Site - Safari
var safari = function safari() {
    var name = arguments.length <= 0 || arguments[0] === undefined ? 'icon' : arguments[0];
    var color = arguments.length <= 1 || arguments[1] === undefined ? 'red' : arguments[1];
    return m('link', { rel: "mask-icon", href: name + '.svg', color: color });
};

// Disable translation prompt
var chrome = function chrome(app_id) {
    return [m('link', { rel: "chrome-webstore-item", href: 'https://chrome.google.com/webstore/detail/' + app_id }), m('meta', { name: 'google', value: 'notranslate' })];
};

var applinks = function applinks(app_store_id, name, android_pkg, docs_url) {
    return [
    // iOS
    'al:ios:url,applinks://docs', 'al:ios:app_store_id,' + app_store_id, 'al:ios:app_name,' + name,
    // Android
    'al:android:url,applinks://docs', 'al:android:app_name,' + name, 'al:android:package,' + android_pkg,
    // Web Fallback
    'al:web:url,' + docs_url].
    // More info: http://applinks.org/documentation/
    map(function (x, i, a) {
        var n = arguments.length <= 3 || arguments[3] === undefined ? x.split(',') : arguments[3];
        return m('meta', { property: n[0], content: n[1] });
    });
};

exports.head = head;
exports.theme = theme;
exports.mobile_metas = mobile_metas;
exports.googleAnalytics = googleAnalytics;
exports.fb_opengraph = fb_opengraph;
exports.fb_instantarticle = fb_instantarticle;
exports.twitter_card = twitter_card;
exports.google_plus = google_plus;
exports.iOS = iOS;
exports.safari = safari;
exports.chrome = chrome;
exports.applinks = applinks;