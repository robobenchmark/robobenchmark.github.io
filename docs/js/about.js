export default class About {
  constructor(routes, project) {
    routes.push({ url: '/about', setup: aboutPage });

    function aboutPage() {
      const template = document.createElement('template');
      template.innerHTML =
        `<section class="hero is-medium has-background-light">
          <div class="hero-body">
            <div class="container title-container">
              <figure class="image is-48x48" style="margin-right: 15px;">
                <img src="docs/images/robotbenchmark-logo-black-eyes.svg" id="title-logo"/>
              </figure>
              <div class="title-text">
                <p class="title is-size-1">
                <a class="is-unselectable is-regular has-text-dark">About</a>
                robot<a class="is-unselectable is-regular has-text-primary">benchmark</a>
                </p>
              </div>
            </div>
          </div>
        </section>`;
      project.setup('about', [], template.content);
    }
  }
}
