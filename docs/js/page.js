export default class Page {
  constructor(title, routes) {
    this.title = title;
    this.content = document.querySelector('.main-container-content');
    this.routes = routes;

    let that = this;
    // Catch clicks on the root-level element.
    document.body.addEventListener('click', function(event) {
      console.log('Page Clicked...');
      let element = event.target;
      if (element.tagName !== 'A' && element.parentElement.tagName === 'A')
        element = element.parentElement;
      
      console.log('element: ' + element);
      if (element.tagName === 'A' && element.href && event.button === 0) { // left click on an <a href=...>
        if (element.origin === document.location.origin &&
            (element.pathname !== document.location.pathname || document.location.hash === element.hash ||
              element.hash === '')) {
          // same-origin navigation: a link within the site (we are skipping linking to the same page with possibly hashtags)
          event.preventDefault(); // prevent the browser from doing the navigation
          console.log('Loading page');
          that.load(element.pathname + element.search + element.hash);
          if (element.hash === '')
            document.querySelector('.main-container').scrollTo(0, 0);
        }
      }
    });
    window.onpopstate = function(event) {
      that.load(document.location.pathname + document.location.hash, false);
      event.preventDefault();
    };
  }

  load(page = null, pushHistory = true) {
    console.log(page);
    this.page = page;
    let mainContainerContent = document.querySelector('.main-container-content');
      if (mainContainerContent)
        mainContainerContent.innerHTML = '';
    let that = this;
    let promise = new Promise((resolve, reject) => {
      if (page === null)
        page = window.location.pathname + window.location.search + window.location.hash;
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
    const url = window.location.origin + this.page;
    window.history.pushState(null, '404 Not Found', url);
    const hostname = document.location.hostname;
    let template = document.createElement('template');
    template.innerHTML =
      `<section>
      <div class="hero-body">
      <div class="container">
      <h1 class="title"><i class="fas fa-exclamation-triangle"></i> Page not found (404 error)</h1>
      <p>The requested page: <a href="${url}">${url}</a> was not found.</p>
      <p>Please report any bug to <a href="mailto:webmaster@${hostname}">webmaster@${hostname}</a></p>
      </div>
      </div>
      </section>`;
    this.setup('page not found', template.content);
  }

  setup(title, content) {
    document.head.querySelector('#title').innerHTML = this.title + ' - ' + title;
    NodeList.prototype.forEach = Array.prototype.forEach;
    let that = this;
    if (content.childNodes) {
      content.childNodes.forEach(function(item) {
        that.content.appendChild(item);
      });
    }
  }
}
