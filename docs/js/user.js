import Router from './router.js';
import ModalDialog from './modal_dialog.js';

export default class User extends Router {
  constructor(title, footer, routes) {
    super(title, footer, routes);
    this.routes.push({url: '/settings', setup: settingsPage});
    let that = this;
    this.loggedIn = window.localStorage.getItem('logged_in');
    this.accessToken = window.localStorage.getItem('access_token');
    this.state = (Math.random() + 1).toString(36).substring(2);
    this.clientId = '5e8f1d24f69002cecd8d';
    this.clientSecret = '3dab00fa144d2ad0ff014548ee491f9207f300cb';
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
    if (!this.username || !this.avatar) {
      let that = this;
      fetch('https://api.github.com/user', {
        method: 'GET',
          headers: { 'Authorization': 'token ' + that.accessToken, 'Accept': 'application/json' },
        })
        .then((response) => response.json())
        .then((data) => {
          const username = data.login ? data.login : 'Anonymous';
          that.username = username !== 'Anonymous' ? username : false;
          const avatar = data.avatar_url ? data.avatar_url : 'docs/images/profile.png';
          that.avatar = avatar !== 'docs/images/profile.png' ? avatar : false;
          document.getElementById('username').innerHTML = username;
          document.getElementById('avatar').src = avatar;
        })
        .catch((error) => { console.error('Profile Error: ', error) });
    }
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
    let that = this;
    let div = document.createElement('div');
    div.setAttribute('class', 'navbar-end');

    const githubOAuth = 'https://github.com/login/oauth/authorize?' +
      'client_id=' + this.clientId + 
      '&state=' + this.state +
      '&allow_signup=' + this.allowSignUp;

    const username = this.username ? this.username : 'Anonymous';
    const avatar = this.avatar ? this.avatar : 'docs/images/profile.png';

    div.innerHTML =
      `<div class="navbar-item">
        <a class="button is-small is-light is-primary" id="log-in" href="${githubOAuth}">
          <span class="icon">
            <i class="fab fa-lg fa-github"></i>
          </span>
          <span>Log in</span>
        </a>
      </div>
      <div id="user-menu" class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link" id="email"><span name="displayName">
          <p id="username">${username}</p>
          </span> &ensp; <img id="avatar" src="${avatar}">
        </a>
        <div class="navbar-dropdown is-boxed">
          <a class="navbar-item" href="/settings"><i class="fas fa-cog"> &nbsp; </i>Settings</a>
          <div class="navbar-divider"></div>
          <a class="navbar-item" id="log-out"><i class="fas fa-power-off"> &nbsp; </i>Log out</a>
        </div>
      </div>`;

    div.querySelector('a#log-out').addEventListener('click', function(event) {
      window.localStorage.removeItem('access_token');
      window.localStorage.removeItem('logged_in');
      that.loggedIn = false;
      that.accessToken = false;
      that.username = false;
      that.avatar = false;
      if (window.location.pathname === '/settings')
        that.load('/');
      else
        that.load();
    });

    return div;
  }

  apiGet(parameter) {
    let that = this;
    return new Promise((resolve, reject) => {
      fetch('https://api.github.com/user', {
        method: 'GET',
        headers: { 'Authorization': 'token ' + that.accessToken, 'Accept': 'application/json' },
      })
      .then((response) => response.json())
      .then((data) => {
        console.log('Data: ' + data.login);
        if (data.login)
          resolve(data.login);
        else
          reject(false);
      })
      .catch(() => { reject(false); });
    });
  }
}
