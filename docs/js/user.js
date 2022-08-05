import Router from './router.js';
import ModalDialog from './modal_dialog.js';

export default class User extends Router {
  constructor(title, footer, routes) {
    super(title, footer, routes);
    let that = this;

    // log in and github variables
    this.loggedIn = window.localStorage.getItem('logged_in');
    this.accessToken = window.localStorage.getItem('access_token');
    this.state = (Math.random() + 1).toString(36).substring(2);
    this.clientId = '5e8f1d24f69002cecd8d';
    this.clientSecret = '3dab00fa144d2ad0ff014548ee491f9207f300cb';
    this.allowSignUp = 'true';
    this.scope = 'repo';

    // profile variables
    this.profileInfo = false;
    this.profileActiveTab = 'rankings';
    this.repositoryFilterTab = 'all';

    // settings variables
    this.settings = true;

    // routes
    this.routes.push({url: '/settings', setup: settingsPage});
    this.routes.push({url: '/profile', setup: profilePage});

    // pages
    function profilePage() {
      if (!that.loggedIn)
        return false;

      const template = document.createElement('template');
      template.innerHTML =
        `<section class="hero is-dark is-background-gradient is-medium">
          <div class="hero-body">
            <div class="container title-container">
              <figure class="image is-128x128" id="profile-avatar">
                <img src="docs/images/profile.png" id="profile-avatar-url"/>
              </figure>
              <div class="title-text">
                <p class="title is-size-1 is-regular" id="profile-display-name">
                  Anonymous
                </p>
                <p class="subtitle is-regular" id="profile-display-name">
                  <strong>Username: </strong>
                  <a id="profile-username" class="is-size-6">
                    Anonymous
                  </a></br>
                  <strong>Url: </strong>
                  <a id="profile-url" class="is-size-6 is-clickable" target="_blank">
                    https://github.com/anonymous
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div class="hero-foot">
            <nav class="tabs is-boxed">
              <div class="container is-max-widescreen">
                <ul id="profile-tabs">
                  <li id='rankings-tab'>
                    <a class="has-text-white">
                      <span class="icon is-small"><i class="fas fa-trophy" aria-hidden="true"></i></span>
                      <span>Rankings</span>
                    </a>
                  </li>
                  <li id='benchmarks-tab'>
                    <a class="has-text-white">
                      <span class="icon is-small"><i class="fas fa-robot" aria-hidden="true"></i></span>
                      <span>Benchmarks</span>
                    </a>
                  </li>
                  <li id='about-tab'>
                    <a class="has-text-white">
                      <span class="icon is-small"><i class="fas fa-user" aria-hidden="true"></i></span>
                      <span>About</span>
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </section>
        <div id="rankings-tab-content" class="container is-max-widescreen" style="display: none;">
          <section class="section">
              <div class=title>Official Benchmark Rankings</div>
              <table class="table mx-auto" id="rankings-table" style="width: 100%; min-width: 700px;">
                <thead>
                  <tr>
                    <th>Robot</th>
                    <th class="has-text-centered">Benchmark</th>
                    <th class="has-text-centered">Ranking</th>
                    <th class="has-text-centered">Performance</th>
                    <th class="has-text-centered">Highest</th>
                    <th class="has-text-centered">Lowest</th>
                    <th class="has-text-centered">Achievement</th>
                  </tr>
                </thead>
                <tbody id="rankings-table">
                </tbody>
              </table>
              <div id="rankings-empty" style="display: block;">
                <div style="display: flex;">
                <i class="fas fa-xl fa-face-frown" id="no-project-icon"
                  style="color: lightgrey; padding-right: 10px; position: relative; top: 12px;"></i>
                <p id="rankings-empty-text">You have not completed any Benchmarks yet...</p>
                </div>
                <a class="button is-primary has-button-gradient" style="margin-top: 15px" href="/benchmarks">Go to Benchmarks</a>
              </div>
          </section>
        </div>
        <div id="benchmarks-tab-content" class="container is-max-widescreen" style="display: none;">
          <section class="section">
            <div class=title>User Created Benchmarks</div>
            <table class="table mx-auto" id="rankings-table" style="width: 100%; min-width: 700px;">
              <thead>
                <tr>
                  <th>Robot</th>
                  <th class="has-text-centered">Title</th>
                  <th class="has-text-centered">Attempts</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="rankings-table">
              </tbody>
            </table>
            <div id="benchmarks-empty" style="display: block;">
                <div style="display: flex;">
                <i class="fas fa-xl fa-face-frown" id="no-project-icon"
                  style="color: lightgrey; padding-right: 10px; position: relative; top: 12px;"></i>
                <p id="rankings-empty-text">You have not completed any Benchmarks yet...</p>
                </div>
                <a class="button is-primary has-button-gradient" style="margin-top: 15px" id="add-benchmark-button">
                  Add a new Benchmark
                </a>
              </div>
          </section>
        </div>
        <div id="about-tab-content" class="container is-max-widescreen" style="display: none;">
          <section class="section">
            <div class=title>About</div>
          </section>
        </div>`;
      that.setup('profile', [], template.content);
      that.getProfileInfo();
      that.initProfileTabs();
    }

    function settingsPage() {
      if (!that.loggedIn)
        return false;

      document.getElementById('navbar').style.backgroundColor = '#363636';

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

  /* ----- User Profile methods ----- */

  initProfileTabs() {
    let that = this;
    document.getElementById('profile-tabs').childNodes.forEach((tab) => {
      if (tab.id) {
        tab.className = tab.id.split('-')[0] === that.profileActiveTab ? 'is-active' : '';
        document.getElementById(tab.id.split('-')[0] + '-tab-content').style.display = 
          tab.id.split('-')[0] === that.profileActiveTab ? 'inherit' : 'none';
        tab.addEventListener('click', function() {
          that.profileActiveTab = tab.id.split('-')[0];
          document.getElementById('profile-tabs').childNodes.forEach((tab) => {
            if (tab.id) {
              tab.className = tab.id.split('-')[0] === that.profileActiveTab ? 'is-active' : '';
              document.getElementById(tab.id.split('-')[0] + '-tab-content').style.display = 
                tab.id.split('-')[0] === that.profileActiveTab ? 'inherit' : 'none';
            }
          });
        });
      }
    });
    document.getElementById('add-benchmark-button').addEventListener('click', this.addBenchmarkModal.bind(this));
  }

  addBenchmarkModal() {
    let content = {};
    content.innerHTML =
      `<article class="panel is-primary" id="add-benchmark-panel">
        <div class="panel-block">
          <p class="control has-icons-left">
            <input class="input is-primary" type="text" placeholder="Search">
            <span class="icon is-left">
              <i class="fas fa-search" aria-hidden="true"></i>
            </span>
          </p>
        </div>
        <p class="panel-tabs is-primary" id="repository-tabs">
          <a id="repository-tab-all" class="is-active">All</a>
          <a id="repository-tab-public">Public</a>
          <a id="repository-tab-private">Private</a>
          <a id="repository-tab-fork">Forks</a>
        </p>
        <div id="repository-list" style="height: 25vh; overflow-y: auto;">
        <div>
      </article>`;
    ModalDialog.run('Github Repositories', content.innerHTML, 'Cancel', 'Add');
    this.getRepositories();
    let that = this;
    document.getElementById('repository-tabs').childNodes.forEach((tab) => {
      if (tab.id){
        tab.addEventListener('click', _ => {
          document.getElementById('repository-tabs').childNodes.forEach((tab) => { tab.className = ''; });
          that.repositoryFilterTab = tab.id.split('-')[2];
          tab.className = 'is-active';
          that.getRepositories(that.repositoryFilterTab);
        })
      }
    });
  }

  getRepositories(filter, search) {
    let that = this;
    fetch('https://api.github.com/user/repos?affiliation=owner', {
      method: 'GET',
      headers: { 'Authorization': 'token ' + that.accessToken, 'Accept': 'application/json' },
    })
    .then((response) => response.json())
    .then((data) => {
      let content = '';
      for (let i = 0; i < data.length; i++) {
        if (filter && filter === 'fork' && !data[i].fork)
          continue;
        else if (filter && filter === 'public' && data[i].visibility !== 'public')
          continue;
        else if (filter && filter === 'private' && data[i].visibility !== 'private')
          continue;

        let icon;
        if (data[i].fork)
          icon = 'fa-code-fork';
        else if (data[i].visibility === 'public')
          icon = 'fa-book';
        else if (data[i].visibility === 'private')
          icon = 'fa-lock'

        const repoName = data[i].full_name.split('/')[1];
        content +=
          `<a class="panel-block">
            <span class="panel-icon">
              <i class="fas ${icon}" aria-hidden="true"></i>
            </span>
            ${repoName}
          </a>`;
      }
      document.getElementById('repository-list').innerHTML = content;
    })
    .catch((error) => { console.error('Profile Error: ', error) });
  }

  getProfileInfo() {
    let that = this;
    if (!this.profileInfo) {
      fetch('https://api.github.com/user', {
        method: 'GET',
        headers: { 'Authorization': 'token ' + that.accessToken, 'Accept': 'application/json' },
      })
      .then((response) => response.json())
      .then((data) => {
        that.profileUsername = data.login ? data.login : false;
        that.profileDisplayName = data.name ? data.name : false;
        that.profileAvatar = data.avatar_url ? data.avatar_url : false;
        that.profileUrl = data.html_url ? data.html_url : false;

        if (that.profileUsername && that.profileDisplayName && that.profileAvatar && that.profileUrl) {
          that.profileInfo = true;
          document.getElementById('profile-display-name').innerHTML = that.profileDisplayName;
          document.getElementById('profile-username').innerHTML = that.profileUsername;
          document.getElementById('profile-avatar-url').src = that.profileAvatar;
          document.getElementById('profile-url').innerHTML = that.profileUrl;
          document.getElementById('profile-url').href = that.profileUrl;
        }
      })
      .catch((error) => { console.error('Profile Error: ', error) });
    } else {
      document.getElementById('profile-display-name').innerHTML = that.profileDisplayName;
      document.getElementById('profile-username').innerHTML = that.profileUsername;
      document.getElementById('profile-avatar-url').src = that.profileAvatar;
      document.getElementById('profile-url').innerHTML = that.profileUrl;
      document.getElementById('profile-url').href = that.profileUrl;
    }

    /* fetch('docs/benchmarks/benchmark_list.txt')
      .then(function(response) { return response.text(); })
      .then(function(data) {
        const benchmarks = data.split('\n');
        const username = data.login ? data.login : 'Anonymous';
        that.username = username !== 'Anonymous' ? username : false;
        const avatar = data.avatar_url ? data.avatar_url : 'docs/images/profile.png';
        that.avatar = avatar !== 'docs/images/profile.png' ? avatar : false;
        document.getElementById('profile-username').innerHTML = username;
        document.getElementById('profile-avatar-url').src = avatar;
      })
      .catch((error) => { console.error('Profile Error: ', error) }); */
  }

  getRankingsInfo() {

  }


  /* Settings methods */

  /* Other methods */
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
          document.querySelector('#log-in').parentElement.style.display = 'none';
          that.updateDisplayName();
        } else {
          document.querySelector('#user-menu').style.display = 'none';
          document.querySelector('#log-in').parentElement.style.display = 'inherit';
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
      '&allow_signup=' + this.allowSignUp +
      '&scope=' + this.scope;

    const username = this.username ? this.username : 'Anonymous';
    const avatar = this.avatar ? this.avatar :
      'docs/images/profile.png';

    div.innerHTML =
      `<a class="navbar-item" href="/">
        Home
      </a>
      <a class="navbar-item" href="/benchmarks">
        Benchmarks
      </a>
      <a class="navbar-item" href="/about">
        About
      </a>
      <div id="user-menu" class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link" id="email"><span name="displayName">
          <p id="username">${username}</p>
          </span> &ensp; <img id="avatar" src="${avatar}">
        </a>
        <div class="navbar-dropdown is-boxed">
          <a class="navbar-item" href="/profile"><i class="fas fa-user"> &nbsp; </i>Profile</a>
          <div class="navbar-divider"></div>
          <a class="navbar-item" href="/settings"><i class="fas fa-cog"> &nbsp; </i>Settings</a>
          <div class="navbar-divider"></div>
          <a class="navbar-item" id="log-out"><i class="fas fa-power-off"> &nbsp; </i>Log out</a>
        </div>
      </div>
      <div class="navbar-item">
        <a class="button is-small is-light is-outlined" style="max-width: 80px;" id="log-in" href="${githubOAuth}">
          <span class="icon">
            <i class="fab fa-lg fa-github"></i>
          </span>
          <span>Log in</span>
        </a>
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
