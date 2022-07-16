export default class Page {
  constructor(title, content) {
    this.title = title;
    this.content = content;
    this.createNavbar();
    this.createMainContainer();
    //this.createFooter();
    this.setup();
  }

  createNavbar() {
    let navbar = document.querySelector('.navbar');
    if (navbar)
      document.body.removeChild(navbar);
    let navbarTemplate = document.createElement('template');
    navbarTemplate.innerHTML =
      `<nav id="navbar" class="navbar is-dark is-fixed-top"">
        <div class="navbar-brand">
          <a class="navbar-item is-size-5" id="navbar-home" href="/" style="margin-right: 30px;">
            <img src="images/robotbenchmark-logo-white.svg" id="navbar-logo"/>&ensp;
              <strong>robot</strong><span class="has-text-primary">benchmark</span>
          </a>
          <a class="navbar-burger burger" data-target="router-navbar">
            <span></span>
            <span></span>
            <span></span>
          </a>
        </div>
        <div id="router-navbar" class="navbar-menu" style="display: none;">
          <div class="navbar-start">
            <a class="navbar-item has-text-grey-light" href="benchmarks">
              Benchmarks
            </a>
            <a class="navbar-item has-text-grey-light" href="about">
              About
            </a>
          </div>
          <div class="navbar-end">
          </div>
        </div>
      </nav>`;
    document.body.append(navbarTemplate.content.firstChild);
  
    document.getElementById('navbar-home').addEventListener('mouseover', function(e) {
      document.getElementById('navbar-logo').src = 'images/robotbenchmark-logo-white-eyes.svg';
    });
  
    document.getElementById('navbar-home').addEventListener('mouseout', function(e) {
      document.getElementById('navbar-logo').src = 'images/robotbenchmark-logo-white.svg';
    });
  
    const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    if (navbarBurgers.length > 0) {
      navbarBurgers.forEach(el => {
        el.addEventListener('click', () => {
          el.classList.toggle('is-active');
          document.getElementById(el.dataset.target).classList.toggle('is-active');
        });
      });
    }
  
    this.logAndSignIn();
  }
  
  logAndSignIn() {
    let logAndSignIn = document.createElement('div');
    logAndSignIn.setAttribute('class', 'navbar-end');
    logAndSignIn.innerHTML =
      `<div class="navbar-item">
        <div class="buttons">
          <a class="button is-small is-success" id="sign-up">
            <strong>Sign up</strong>
          </a>
          <a class="button is-small is-light" id="log-in">
            Log in
          </a>
        </div>
      </div>`;
    document.body.querySelector('.navbar-end').replaceWith(logAndSignIn);
  }
  
  createMainContainer() {
    let mainContainer = document.querySelector('.main-container');
    if (mainContainer)
      document.body.removeChild(mainContainer);
    mainContainer = document.createElement('div');
    mainContainer.className = 'main-container';
    document.body.append(mainContainer);
  }
  
  createFooter() {
    let footer = document.querySelector('.footer');
    if (footer)
      document.body.removeChild(footer);
    let footerTemplate = document.createElement('template');
    footerTemplate.innerHTML =
    `<footer class="footer">
      <div class="footer-left">
        <div class="content has-text-centered" id="footer-github" style="margin-bottom:14px">
          <p>
            <a class="has-text-white" target="_blank" href="https://github.com/cyberbotics/webots">
              <i class="fab fa-github is-size-6"></i> open-source robot simulator</a>
          </p>
        </div>
      </div>
      <div class="footer-right">
        <div class="content is-size-7" id="footer-terms-of-service">
          <p><a class="has-text-white" href="terms">Terms</a></p>
        </div>
        <div class="content is-size-7" id="footer-privacy-policy">
          <p><a class="has-text-white" href="privacy">Privacy</a></p>
        </div>
        <div class="content is-size-7" id="footer-cyberbotics">
          <p><a class="has-text-white" target="_blank" href="https://cyberbotics.com">Cyberbotics&nbsp;Ltd.</a></p>
        </div>
      </div>
    </footer>`;
    document.body.append(footerTemplate.content.firstChild);
  }

  setup() {
    document.head.querySelector('#title').innerHTML = 'robotbenchmark - ' + this.title;
    NodeList.prototype.forEach = Array.prototype.forEach;
    if (this.content.childNodes) {
      this.content.childNodes.forEach(function(item) {
        document.querySelector('.main-container').appendChild(item);
      });
    }
  }
}
