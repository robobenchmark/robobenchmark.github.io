export default class Home {
  constructor(routes, project) {
    routes.push({ url: '/home', setup: homePage });
    routes.push({ url: '/', setup: homePage });
    let that = this;
    function homePage() {
      const template = document.createElement('template');
      template.innerHTML =
        `<section class="hero is-medium has-background-grey-lighter">
        <div class="hero-body">
          <div class="container title-container">
            <figure class="image is-64x64" style="top: 6px; margin-right: 15px;">
              <img src="docs/images/robotbenchmark-logo-black-eyes.svg" id="title-logo"/>
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
      </section>`
      project.setup('home', [], template.content);
    }
  }
}
