
import * as u from 'universal-utils'
const {fp,vdom,lazy,hamt,csp,fetch:_fetch,router:{router:_r}} = u,
    {debounce,m,html,rAF,mount,update,qs,container} = vdom
import * as head from './head'

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

const viewportHeight = _ =>
    Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

const trackVisibility = component => {
    let el,
        visible = (el.getBoundingClientRect instanceof Function) ? false : true

    const onScroll = debounce(ev => {
        if(!el.getBoundingClientRect instanceof Function) return
        let {top, height} = el.getBoundingClientRect(),
            vh = viewportHeight()
        if(top <= vh && !visible) {
            el.className += ' visible'
            visible = true
        } else if(top > vh && visible) {
            el.className = el.className.replace(/ visible/g, '')
            visible = false
        }
    }, 16.6)

    const startScroll = _el => {
        el = _el
        window.addEventListener('scroll', onScroll)
    }

    const endScroll = _ => window.removeEventListener('scroll', onScroll)

    rAF(onScroll)

    return m('div.invisible', {config: startScroll, unload: endScroll}, component)
}

/**
 * MARKDEEP / MARKDOWN - convert a section with string content
 * into a markdeep/markdown rendered section
*/

const markdown = (content, markdownToHtml=(c => global.markdeep.format(c))) => {
    const config = (element, init) => {
        element.innerHTML = markdownToHtml(content)
    }
    return m('.markdeep', {config})
}

/**
 * scrambled text animation
 *
 * m('span', {config: animatingTextConfig('test me out')})
 */
const chars = '#*^-+=!f0123456789_'
const scramble = (str, from=0) =>
    str.slice(0,from) + str.slice(from).split('').map(x => x === ' ' ? x : chars[range(0,chars.length)]).join('')
const range = (min,max) => Math.floor(Math.random()*(max-min)+min)
const wait = ms => new Promise((res) => setTimeout(res, ms))

const scrambler = (str, interval=33, i=0, delay=0) => el => {
    let start = scramble(str, 0)
    const draw = i => () => el.innerText = str.slice(0,i)+start.slice(i)
    while(i++ < str.length){
        wait(delay+i*interval).then(draw(i))
    }
}

/**
 * load an image in JS, and then animate it in as a background image
 *
 * imageLoader(url, m('div'))
 */
const imageLoader = (url, comp) => {
    let x = comp,
        image,
        loaded = false

    while(x instanceof Function)
        x = x()

    const imgConfig = el => {
        image = new Image()

        el.style.backgroundImage = `url(${url})`

        const done = ev => {
            if(loaded) return
            el.className += ' loaded'
            loaded = true
        }

        image.onload = done
        image.src = url
    }

    x.config = imgConfig
    return x
}

/**
 * load an SVG and inject it onto the page
 */
const loadSVG = url => fetch(url).then(r => r.text())
const injectSVG = url => container(data =>
    m('div', {config: el => el.innerHTML = data.svg}),
    {svg: loadSVG.bind(null, url)})

/**
 * hashroute-driven router
 */
// router implementation
const hashrouter = (
    routes={},
    def='#',
    current
) => {
    let x = _r(routes, (el) => {
        current = el
        update()
    })
    x.listen()
    x.trigger((window.location.hash || def).slice(1))
    return () => current
}

/**
 * page component that returns an entire html component
 */
const page = (router, title, css='/style.css', googleAnalyticsId) => [
    head.head(
        head.theme(),
        head.mobile_metas(title),
        m('link', {type:'text/css', rel:'stylesheet', href:css}),
        googleAnalyticsId && head.googleAnalytics(googleAnalyticsId)
    ),
    m('body', router)
]

/**
 * mount the entire page() component to the DOM
 */
const app = (routes, def, title, analyticsId) => {
    const router = hashrouter(routes, def)
    return () => mount(page(router, title, analyticsId), qs('html', document))
}

export {
    trackVisibility,
    markdown,
    scrambler,
    imageLoader,
    injectSVG,
    hashrouter,
    page,
    app,
}