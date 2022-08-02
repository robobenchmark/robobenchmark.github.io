import Project from './project.js';

document.addEventListener('DOMContentLoaded', function() {
  Project.run('robotbenchmark', footer(), [{ url: '/benchmark-run', setup: benchmarkPage }]);

  function footer() {
    let template = document.createElement('template');
    template.innerHTML =
      `<footer class="footer">
       <div class="footer-left">
          <div class="content has-text-centered" id="footer-github" style="margin-bottom:14px">
            <a class="has-text-white" target="_blank" href="https://github.com/cyberbotics/webots">
                <i class="fab fa-github is-size-6"></i> open-source robot simulator</a>
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
    return template.content.firstChild;
  }

  function benchmarkPage(project) {
    project.runWebotsView();
  }
});