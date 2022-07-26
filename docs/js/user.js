import Router from './router.js';
import ModalDialog from './modal_dialog.js';

export default class User extends Router {
  constructor(title, footer, routes) {
    super(title, footer, routes);
    this.routes.push({url: '/settings', setup: settingsPage});
    let that = this;
    this.loggedIn = false;
    this.state = (Math.random() + 1).toString(36).substring(2);
    this.clientId = '5e8f1d24f69002cecd8d';
    this.allowSignUp = 'true';

    function settingsPage() {
      if (!that.loggedIn)
        return false;

      const template = document.createElement('template');
      template.innerHTML =
        `<section class="section">
          <div class="container">
            <h1 class="title pb-3"><i class="fas fa-cog"></i> Settings</h1>
            <h2 class="subtitle pt-3">You are logged in</h2>
          </div>
        </section>`;

      that.setup('settings', [], template.content);
    }
  }

  updateDisplayName() {
    console.log('updateDisplayName');
  }

  load(page = null, pushHistory = true) {
    let that = this;
    super.load(page, pushHistory).then(() => {
      if (document.querySelector('#user-menu')) {
        if (that.loggedIn) {
          document.querySelector('#user-menu').style.display = 'auto';
          document.querySelector('#log-in').style.display = 'none';
          that.updateDisplayName();
        } else {
          document.querySelector('#user-menu').style.display = 'none';
          document.querySelector('#log-in').style.display = 'flex';
        }
        if (that.email === '!')
          that.login();
      }
    });
  }

  setup(title, anchors, content, fullpage = false) {
    super.setup(title, anchors, content, fullpage);
    let navbarEnd = document.body.querySelector('.navbar-end');
    navbarEnd.parentNode.replaceChild(this.menu(), navbarEnd);
  }

  menu() {
    let div = document.createElement('div');
    div.setAttribute('class', 'navbar-end');

    let githubOAuth = 'https://github.com/login/oauth/authorize?' +
      'client_id=' + this.clientId + 
      '&state=' + this.state +
      '&allow_signup=' + this.allowSignUp;

    const name = 'Username';
    div.innerHTML =
      `<div class="navbar-item">
        <a class="button is-small" id="log-in" href="${githubOAuth}">
          <span class="icon">
            <i class="fab fa-lg fa-github"></i>
          </span>
          <span>Log in</span>
        </a>
      </div>
      <div id="user-menu" class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link" id="email"><span name="displayName">${name}</span> &nbsp; <img src="docs/images/profile.png"></a>
        <div class="navbar-dropdown is-boxed">
          <a class="navbar-item" href="/settings"><i class="fas fa-cog"> &nbsp; </i>Settings</a>
          <div class="navbar-divider"></div>
          <a class="navbar-item" id="log-out"><i class="fas fa-power-off"> &nbsp; </i>Log out</a>
        </div>
      </div>`;
    let that = this;

    div.querySelector('a#log-out').addEventListener('click', function(event) {
      that.password = null;
      that.email = null;
      that.id = null;
      if (window.location.pathname === '/settings')
        that.load('/');
      else
        that.load();
    });

    div.querySelector('a#log-in').addEventListener('click', function(event) {
      const url = 'https://github.com/login/oauth/authorize?' +
        'client_id=5e8f1d24f69002cecd8d' +
        '&state=1234' +
        '&allow_signup=true';
      let promise = new Promise((resolve, reject) => {
        fetch('https://github.com/login/oauth/authorize', {method: 'get'})
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            if (data.error)
              console.log(data.error);
            else
              resolve();
          })
      });
      return promise;
    });

    return div;
  }

  login() {
    console.log('Log in');
  }
}
