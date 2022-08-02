export default class Router {
  constructor(title, footer, routes) {
    this.title = title;
    this.content = document.createElement('div');
    this.content.id = 'main-container';
    this.routes = routes;
    const body = document.querySelector('body');
    body.classList.add('has-navbar-fixed-top');
    this.resetNavbar();
    body.prepend(footer);
    body.prepend(this.content);
    let that = this;

    document.addEventListener('scroll', function(event) {
      if (window.scrollY == 0 && document.querySelector('.navbar').classList.contains('is-dark')) {
        document.querySelector('.navbar').classList.toggle('is-dark');
        document.querySelector('.navbar').classList.toggle('is-light');
        document.getElementById('navbar-logo').src = document.getElementById('navbar-logo').src.replace('white', 'black');
      } else if (document.querySelector('.navbar').classList.contains('is-light')) {
        document.querySelector('.navbar').classList.toggle('is-dark');
        document.querySelector('.navbar').classList.toggle('is-light');
        document.getElementById('navbar-logo').src = document.getElementById('navbar-logo').src.replace('black', 'white');
      }
    });

    body.addEventListener('click', function(event) {
      let element = event.target;
      if (element.tagName !== 'A' && element.parentElement.tagName === 'A')
        element = element.parentElement;
      if (element.tagName === 'A' && element.href && event.button === 0) {
        if (element.origin === document.location.origin &&
            (element.pathname !== document.location.pathname || document.location.hash === element.hash ||
              element.hash === '')) {
          event.preventDefault();
          that.load(element.pathname + element.search + element.hash);
          if (element.hash === '') {
            window.scrollTo(0, 0);
          }
        }
      }
    });

    window.onpopstate = function(event) {
      that.load(document.location.pathname + document.location.hash, false);
      event.preventDefault();
    };
  }

  resetNavbar() {
    let navbar = document.querySelector('.navbar');
    if (navbar)
      document.body.removeChild(navbar);
    let template = document.createElement('template');
    template.innerHTML =
      `<nav id="navbar" class="navbar is-light is-fixed-top">
        <div class="navbar-brand">
          <a class="navbar-item is-size-5" id="navbar-home" href="/" style="margin-right: 30px;">
            <img src="https://raw.githubusercontent.com/robobenchmark/robobenchmark.github.io/testing/docs/images/robotbenchmark-logo-black.svg"
              id="navbar-logo"/>&ensp;
              <strong>robot</strong><span class="has-text-primary">benchmark</span>
          </a>
          <a class="navbar-burger burger" data-target="router-navbar">
            <span></span>
            <span></span>
            <span></span>
          </a>
        </div>
        <div id="router-navbar" class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item" href="/benchmarks">
              Benchmarks
            </a>
            <a class="navbar-item" href="/about">
              About
            </a>
          </div>
          <div class="navbar-end">
          </div>
        </div>
      </nav>`;
    document.body.prepend(template.content.firstChild);

    const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    if (navbarBurgers.length > 0) {
      navbarBurgers.forEach(element => {
        element.addEventListener('click', () => {
          element.classList.toggle('is-active');
          document.getElementById(element.dataset.target).classList.toggle('is-active');
        });
      });
    }

    document.getElementById('navbar-home').addEventListener('mouseover', function(e) {
      const hoverImage = document.getElementById('navbar-logo').src.replace('.svg', '-eyes.svg');
      document.getElementById('navbar-logo').src = hoverImage;
    });
  
    document.getElementById('navbar-home').addEventListener('mouseout', function(e) {
      const image = document.getElementById('navbar-logo').src.replace('-eyes.svg', '.svg');
      document.getElementById('navbar-logo').src = image;
    });
  }

  load(page = null, pushHistory = true) {
    let that = this;
    let promise = new Promise((resolve, reject) => {
      if (page === null)
        page = window.location.pathname + window.location.search + window.location.hash;
      that.resetNavbar();
      const url = new URL(window.location.origin + page);
      if (url.pathname === '/404.php') {
        that.notFound();
        resolve();
      } else {
        let found = false;
        for (let i = 0; i < that.routes.length; i++) {
          const route = that.routes[i];
          if (url.pathname === route.url) {
            if (pushHistory)
              window.history.pushState(null, '', url.pathname + url.search + url.hash);
            route.setup(that);
            found = true;
            resolve();
            break;
          }
        }
        if (!found) {
          that.dynamicPage(url, pushHistory).then(() => {
            resolve();
          });
        }
      }
    });
    return promise;
  }

  dynamicPage(url, pushHistory) {
    let that = this;
    let promise = new Promise((resolve, reject) => {
      that.notFound();
      if (pushHistory)
        window.history.pushState(null, '', url.pathname + url.search + url.hash);
      resolve();
    });
    return promise;
  }

  notFound() {
    const pathname = window.location.pathname;
    const url = window.location.origin + pathname;
    window.history.pushState(null, '', url);
    const hostname = document.location.hostname;
    let template = document.createElement('template');
    template.innerHTML =
      `<section>
      <div class="hero-body" style="position: relative; top: 3.25rem;">
      <div class="container">
      <h1 class="title"><i class="fas fa-exclamation-triangle"></i> Page not found (404 error)</h1>
      <p>The requested page: <a href="${url}">${url}</a> was not found.</p>
      <p>Please report any bug to <a href="mailto:webmaster@${hostname}">webmaster@${hostname}</a></p>
      </div>
      </div>
      </section>`;
    this.setup('page not found', [], template.content);
  }

  setup(title, anchors, content, fullpage = false) {
    document.head.querySelector('#title').innerHTML = this.title + ' - ' + title;
    this.content.innerHTML = '';
    NodeList.prototype.forEach = Array.prototype.forEach;
    let that = this;
    if (content.childNodes) {
      content.childNodes.forEach(function(item) {
        that.content.appendChild(item);
      });
    }
  }

  isMobileDevice() {
    // https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
}
