import Home from "./home.js";
import Benchmarks from "./benchmarks.js";
import About from "./about.js";
import Terms from "./terms.js";
import Privacy from "./privacy.js";

document.addEventListener('DOMContentLoaded', function() {
  createNavbar();
  createMainContainer();

  let routes = [];
  this.home = new Home(routes);
  this.benchmarks = new Benchmarks(routes);
  this.about = new About(routes);
  this.terms = new Terms(routes);
  this.privacy = new Privacy(routes);
});

function createNavbar() {
  let navbar = document.querySelector('.navbar');
  if (navbar)
    document.body.removeChild(navbar);
  let navbarTemplate = document.createElement('template');
  navbarTemplate.innerHTML =
    `<nav id="navbar" class="navbar is-dark is-fixed-top"">
      <div class="navbar-brand">
        <a class="navbar-item is-size-4" id="navbar-home" href="home" style="margin-right: 30px;">
          <img src="images/robotbenchmark-icon-inverted.png" id="navbar-logo"/>&ensp;<strong>robot</strong>benchmark
        </a>
        <a class="navbar-burger burger" data-target="router-navbar">
          <span></span>
          <span></span>
          <span></span>
        </a>
      </div>
      <div id="router-navbar" class="navbar-menu">
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
    document.getElementById('navbar-logo').src = 'images/robotbenchmark-icon-inverted-hover.png';
  });

  document.getElementById('navbar-home').addEventListener('mouseout', function(e) {
    document.getElementById('navbar-logo').src = 'images/robotbenchmark-icon-inverted.png';
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

  logAndSignIn();
}

function logAndSignIn() {
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

function createMainContainer() {
  let mainContainer = document.createElement('div');
  mainContainer.className = 'main-container';
  document.body.append(mainContainer);

  let mainContainerContent = document.createElement('div');
  mainContainerContent.className = 'main-container-content';
  mainContainer.append(mainContainerContent);
  createFooter(mainContainer);
}

function createFooter(parent) {
  let footer = document.querySelector('.footer');
  if (footer)
    parent.removeChild(footer);
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
        <p><a class="has-text-white" href="terms-of-service">Terms</a></p>
      </div>
      <div class="content is-size-7" id="footer-privacy-policy">
        <p><a class="has-text-white" href="privacy-policy">Privacy</a></p>
      </div>
      <div class="content is-size-7" id="footer-cyberbotics">
        <p><a class="has-text-white" target="_blank" href="https://cyberbotics.com">Cyberbotics&nbsp;Ltd.</a></p>
      </div>
    </div>
  </footer>`;
  parent.append(footerTemplate.content.firstChild);
}
