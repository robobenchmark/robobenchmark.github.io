import ModalDialog from './modal_dialog.js';
export default class Home {
  constructor(routes, project) {
    this.routes = routes;
    this.project = project;
    let that = this;
    this.routes.push({ url: '/home', setup: homePage });

    function homePage() {
      that.logIn();

      const template = document.createElement('template');
      template.innerHTML =
        `<section class="hero is-fullheight is-light is-background-gradient">
          <div class="hero-body">
            <div class="container title-container" style="transform: translateX(30%) scale(1.5);">
              <figure class="image is-64x64" style="top: 6px; margin-right: 15px;">
                <img src="docs/images/robotbenchmark-logo-black-eyes.svg"
                  id="title-logo"/>
              </figure>
              <div class="title-text">
                <p class="title is-size-1">
                  robot<a class="is-unselectable is-regular has-text-primary">benchmark</a>
                </p>
                <p class="subtitle">
                  The online robotics challenge platform
                </p>
              </div>
            </div>
          </div>
          <div class="more-circle">
            <i class="fas fa-xl fa-angles-down is-scale-animated" style="color: #f5f5f5;"></i>
          <div>
        </section>
        
        <div class="container is-max-widescreen">
          <section class="section">
            <div class="tile is-ancestor">
              <div class="tile is-parent">
                <article class="tile is-child box">
                  <p class="title">Program</p>
                  <p class="subtitle">Program simulated robots online</p>
                </article>
              </div>
              <div class="tile is-parent">
                <article class="tile is-child box">
                  <p class="title">Compare</p>
                  <p class="subtitle">Compare your performance to the best</p>
                </article>
              </div>
              <div class="tile is-parent">
                <article class="tile is-child box">
                  <p class="title">Share</p>
                  <p class="subtitle">Share your achievements</p>
                </article>
              </div>
            </div>
          </section>
        </div>`;
      project.setup('home', [], template.content);
    }
  }

  logIn() {
    let that = this;
    const code = new URL(document.location.href).searchParams.get('code') ?
      (new URL(document.location.href).searchParams.get('code')).toString() : false;
    const state = new URL(document.location.href).searchParams.get('state') ?
      (new URL(document.location.href).searchParams.get('state')).toString() : false;

    if (code && state && !this.project.loggedIn) {
      that.project.code = code;
      that.project.state = state;

      const access_data = {
        client_id: that.project.clientId, 
        client_secret: that.project.clientSecret,
        code: that.project.code,
        state: that.project.state
      };

      let promise = new Promise((resolve, reject) => {
        fetch('https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(access_data)
        })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            ModalDialog.run('Log-in Error', `Unfortunately there has been an error connecting to your GitHub account.</br>
              Please try again later.`);
            reject();
          } else {
            that.project.loggedIn = true;
            that.project.accessToken = data.access_token;
            window.localStorage.setItem('access_token', that.project.accessToken);
            window.localStorage.setItem('logged_in', that.project.loggedIn);
            resolve();
          }
        })
        .catch((error) => { errorModal(error) });
      });
      promise.then(() => { that.project.load('/'); successModal(); });
    }

    function successModal() {
      ModalDialog.run('Log-in Success', 'You have successfully logged in to Robotbenchmark with GitHub!');
    }

    function errorModal(error) {
      ModalDialog.run('Log-in Error', `Unfortunately there has been an error connecting to your GitHub account.</br>
        Please try again later.</br>error: ` + error);
    }
  }
}
