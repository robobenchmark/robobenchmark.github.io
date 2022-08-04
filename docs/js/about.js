export default class About {
  constructor(routes, project) {
    routes.push({ url: '/about', setup: aboutPage });

    function aboutPage() {
      const template = document.createElement('template');
      template.innerHTML =
        `<section class="hero is-medium is-dark is-background-gradient">
          <div class="hero-body">
            <div class="container title-container">
              <figure class="image is-64x64" style="margin-right: 15px; margin-top: 7px;">
                <img src="docs/images/robotbenchmark-logo-white-eyes.svg" id="title-logo"/>
              </figure>
              <div class="title-text">
                <p class="title is-size-1 is-regular">
                  About
                </p>
                <p class="subtitle is-size-4">
                  <strong>robot</strong><a class="is-unselectable is-regular has-text-primary">benchmark</a>
                </p>
              </div>
            </div>
          </div>
        </section>

        <div class="container is-max-widescreen">
          <section class="section">
            <div class="tile is-ancestor">
              <div class="tile is-parent">
                <article class="tile is-child box">
                  <p class="title">Welcome</p>
                  <p class="subtitle">Participation is open to anyone, free of charge</p>
                  <div class="content">
                    <p><strong>robot</strong><a class="is-unselectable is-regular has-text-primary">benchmark</a> offers a
                      series of robot programming challenges that address various topics across a wide range of difficulty
                      levels.
                      These benchmarks are provided for free as online simulations, based on a 100% free open source software
                      stack.
                      The performance achieved by users is recorded and displayed online.</p>
                  </div>
                </article>
              </div>
              <div class="tile is-parent is-7">
                <article class="tile is-child box">
                  <p class="title">Difficulty Levels</p>
                  <p class="subtitle">There are 5 difficulty levels:</p>
                  <div class="content">
                    <table class="table">
                      <tbody>
                        <tr>
                          <td>1. Middle School</td>
                          <td class="has-text-right">
                            <i class="fas fa-xs fa-star"></i>
                          </td>
                        </tr>
                        <tr>
                          <td>2. High School</td>
                          <td class="has-text-right">
                            <i class="fas fa-xs fa-star"></i>
                            <i class="fas fa-xs fa-star"></i>
                          </td>
                        </tr>
                        <tr>
                          <td>3. Bachelor</td>
                          <td class="has-text-right">
                            <i class="fas fa-xs fa-star"></i>
                            <i class="fas fa-xs fa-star"></i>
                            <i class="fas fa-xs fa-star"></i>
                          </td>
                        </tr>
                        <tr>
                          <td>4. Master</td>
                          <td class="has-text-right">
                            <i class="fas fa-xs fa-star"></i>
                            <i class="fas fa-xs fa-star"></i>
                            <i class="fas fa-xs fa-star"></i>
                            <i class="fas fa-xs fa-star"></i>
                          </td>
                        </tr>
                        <tr>
                          <td>5. PhD</td>
                          <td class="has-text-right">
                            <i class="fas fa-xs fa-star"></i>
                            <i class="fas fa-xs fa-star"></i>
                            <i class="fas fa-xs fa-star"></i>
                            <i class="fas fa-xs fa-star"></i>
                            <i class="fas fa-xs fa-star"></i>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </article>
              </div>
            </div>

            <div class="tile is-ancestor">
              <div class="tile is-parent is-7">
                <article class="tile is-child box">
                  <p class="title">Join our community</p>
                  <p class="subtitle">What is up?</p>
                </article>
              </div>
              <div class="tile is-parent">
                <article class="tile is-child box">
                  <p class="title">Join Our Community</p>
                  <div class="content">
                    <p>Do you have questions about robot programming?</br>
                      Do you need to discuss strategy ideas?</br>
                      Come and join our <a target="_blank" href="https://discord.com/invite/Gn6Buyt">Discord</a> live chat
                      channel.
                  </div>
                </article>
              </div>
            </div>
          </section>
        </div>`;
      project.setup('about', [], template.content);
    }
  }
}
