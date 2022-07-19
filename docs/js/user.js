import Router from './router.js';
import ModalDialog from './modal_dialog.js';

export default class User extends Router {
  constructor(title, footer, routes) {
    super(title, footer, routes);
    this.routes.push({url: '/settings', setup: settingsPage});
    let that = this;
    this.loogedIn = false;

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

    const name = 'Username';
    div.innerHTML =
      `<div class="navbar-item">
        <div class="buttons">
          <a class="button is-small is-primary" id="log-in">
            <span class="icon">
              <i class="fab fa-lg fa-github"></i>
            </span>
            <span>Log in</span>
          </a>
        </div>
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
      event.preventDefault();
      let content = {};
      content.innerHTML =
        `<div class="field">
          <label class="label">E-mail</label>
          <div class="control has-icons-left">
            <input id="log-in-email" class="input" type="email" required placeholder="Enter your e-mail address">
            <span class="icon is-small is-left">
              <i class="fas fa-envelope"></i>
            </span>
          </div>
        </div>
        <div class="field">
          <label class="label">Password</label>
          <div class="control has-icons-left">
            <input id="log-in-password" class="input" type="password" required>
            <span class="icon is-small is-left">
              <i class="fas fa-lock"></i>
            </span>
          </div>
          <div class="has-text-right"><a id="log-in-forgot" class="help">Forgot your password?</a></div>
        </div>
        <p id="log-in-help" class="help"></p>`;

      let modal = ModalDialog.run('Log in', content.innerHTML, 'Cancel', 'Log in');
      modal.querySelector('#log-in-email').focus();
      modal.querySelector('#log-in-forgot').addEventListener('click', function(event) {
        modal.close();
        let content = {};
        content.innerHTML =
          `<div class="field">
            <label class="label">E-mail</label>
            <div class="control has-icons-left">
              <input id="forgot-email" class="input" type="email" required placeholder="Enter your e-mail address"
              value="${modal.querySelector('#log-in-email').value}">
              <span class="icon is-small is-left">
                <i class="fas fa-envelope"></i>
              </span>
            </div>
          </div>`;
        let forgot = ModalDialog.run('Forgot your password?', content.innerHTML, 'Cancel', 'Reset Password');
        forgot.querySelector('#forgot-email').focus();
        forgot.querySelector('form').addEventListener('submit', function(event) {
          event.preventDefault();
          forgot.querySelector('button[type="submit"]').classList.add('is-loading');
          that.forgotPassword(forgot.querySelector('#forgot-email').value, function() { forgot.close(); });
        });
      });
      modal.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();
        let email = modal.querySelector('#log-in-email').value;
        let password = modal.querySelector('#log-in-password').value;
        that.email = email;
        that.sha256Hash(password + that.title).then(function(hash) {
          that.password = hash;
          that.login(function(error) {
            modal.querySelector('#log-in-help').innerHTML = error; // "Your e-mail or password is wrong, please try again.";
          }, function(success) {
            modal.close();
          }, true);
        });
      });
    });
    return div;
  }

  login() {
    console.log('Log in');
  }
}
