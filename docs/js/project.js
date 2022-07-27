import User from './user.js';
import Home from './home.js';
import Benchmarks from './benchmarks.js';
import About from './about.js';
import TermsAndPrivacy from './termsAndPrivacy.js';
import ModalDialog from './modal_dialog.js';

export default class Project extends User {
  constructor(title, footer, routes) {
    super(title, footer, routes);
    new Home(routes, this);
    new Benchmarks(routes, this);
    new About(routes, this);
    new TermsAndPrivacy(routes, this);
    this.load();
  }

  static run(title, footer, routes) {
    Project.current = new Project(title, footer, routes);
    return Project.current;
  }

  dynamicPage(url, pushHistory) {
    let that = this;
    let promise = new Promise((resolve, reject) => {
      if (!url.pathname.startsWith('/A') && !url.pathname.startsWith('/M') && url.pathname.length !== 8) {
        that.notFound();
        resolve();
      }
      fetch('/ajax/animation/list.php', {method: 'post', body: JSON.stringify({url: url, type: url.pathname[1]})})
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          let pushUrl;
          if (url.search !== data.uploadMessage)
            pushUrl = url.pathname + url.search + url.hash;
          else {
            if (!that.id) {
              let uploads = JSON.parse(window.localStorage.getItem('uploads'));
              if (uploads === null)
                uploads = [];
              if (!uploads.includes(data.animation.id))
                uploads.push(data.animation.id);
              window.localStorage.setItem('uploads', JSON.stringify(uploads));
            } else {
              fetch('/ajax/user/authenticate.php', { method: 'post',
                body: JSON.stringify({email: that.email, password: that.password, uploads: [data.animation.id]})})
                .then(function(response) {
                  return response.json();
                })
                .then(function(data) {
                  if (data.error) {
                    that.password = null;
                    that.email = '!';
                    that.load('/');
                    ModalDialog.run('Error', data.error);
                  } else
                    ModalDialog.run(`Upload associated`,
                      `Your upload has successfully been associated with your webots.cloud account`);
                });
            }
            pushUrl = url.pathname + url.hash;
          }
          if (pushHistory)
            window.history.pushState(null, '', pushUrl);
          if (data.error) { // no such animation
            that.notFound();
            resolve();
          } else {
            that.runWebotsView(data.animation);
            resolve();
          }
        });
    });
    return promise;
  }

  setup(title, anchors, content, fullpage = false) {
    if (Project.webotsView) {
      Project.webotsView.close();
      document.querySelector('#main-container').classList.remove('webotsView');
    }
    super.setup(title, anchors, content, fullpage);
  }

  findGetParameter(parameterName) {
    let result;
    let tmp = [];
    let items = window.location.search.substr(1).split('&');
    for (let index = 0; index < items.length; index++) {
      tmp = items[index].split('=');
      if (tmp[0] === parameterName)
        result = decodeURIComponent(tmp[1]);
    }
    return result;
  }

  setupWebotsView(page) {
    const view = (!Project.webotsView)
      ? '<webots-view id="webots-view"></webots-view>' : '';
    let template = document.createElement('template');
    template.innerHTML = `<section class="section" style="padding:0;height:100%">
      <div class="simulation-container" id="webots-view-container">${view}</div>`;
    template.innerHTML += '</section>';
    this.setup(page, [], template.content);
    if (!Project.webotsView)
      Project.webotsView = document.querySelector('webots-view');
    else
      document.querySelector('#webots-view-container').appendChild(Project.webotsView);
    document.querySelector('#main-container').classList.add('webotsView');
  }

  runWebotsView(name, url1) {
    const url = this.findGetParameter('url');
    const server = 'https://testing.webots.cloud/ajax/server/session.php?url=' + url;
    const mode = 'x3d';

    this.setupWebotsView('benchmark/' +  + '/');

    return new Promise((resolve, reject) => {
      let dotIndex = url.lastIndexOf('/') + 1;
      let thumbnailUrl = (url.slice(0, dotIndex) + "." + url.slice(dotIndex)).replace('github.com',
        'raw.githubusercontent.com').replace('/blob', '').replace('.wbt', '.jpg');

      Project.webotsView.connect(server, mode, false, undefined, 300, thumbnailUrl);
      Project.webotsView.showQuit = false;
      resolve();
    });

    /* promise.then(() => {
      if (document.querySelector('#user-menu')) {
        if (that.email && that.password) {
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
    }); */
  }

  _isMobileDevice() {
    // https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
}

Project.current = null;
Project.webotsView = null;
