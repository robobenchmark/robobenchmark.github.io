import Project from './project.js';
import ModalDialog from './modal_dialog.js';

document.addEventListener('DOMContentLoaded', function() {
  Project.run('webots.cloud', footer(), [{ url: '/', setup: homePage }, { url: '/home', setup: homePage }]);

  function footer() {
    let template = document.createElement('template');
    template.innerHTML =
      `<footer class="footer">
        <div class="content has-text-centered" id="footer-github" style="margin-bottom:14px">
          <p>
            <a class="has-text-white" target="_blank" href="https://github.com/cyberbotics/webots">
              <i class="fab fa-github is-size-6"></i> open-source robot simulator</a>
          </p>
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

  function homePage(project) {
    
  }
});