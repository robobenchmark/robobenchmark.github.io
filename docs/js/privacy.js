import Page from "./page.js";

export default class Privacy extends Page {
  constructor(routes) {
    super('privacy', routes);
    let that = this;
    routes.push({ url: '/privacy-policy', setup: privacyPolicyPage });
    function privacyPolicyPage() {
      const template = document.createElement('template');
      template.innerHTML =
        `<section class="section">
          <div class="container content">
            <h1 class="title pb-3"><i class="fa-solid fa-sm fa-lock"></i> Privacy Policy</h1>
            <ul>
              <li>Effective: 7 July 2022</li>
              <li>Last updated: 7 July 2022</li>
            </ul>
            <p>The <a target="_blank" href="https://webots.cloud">webots.cloud</a> website is created, developed and operated by 
              Cyberbotics Sàrl, headquartered at EPFL Innovation Park, Building C, 1015 Lausanne, Switzerland, registered 
              with the Swiss UID CHE-104.504.228 (hereinafter “Cyberbotics” or “we”). We are committed to protect and respect 
              your privacy while using our services through <a target="_blank" href="https://webots.cloud">webots.cloud</a>. 
              This privacy policy explains how we manage data that identifies you (the "personal data") when you use our 
              services. We recommend that you read this entire policy before using our services.</p>
            <h2 class="subtitle pt-4">What personal data do we collect?</h2>
            <h4>Information you provide to us</h4>
            <ul>
              <li>Account information: e-mail address and password hash when you create an account.</br>
                What is the password hash?</br>
                The password hash is a text string computed from your password using an encryption algorithm (the hashing 
                function) when you create an account. We store it in our database. Then, when you log into your account, the 
                entered password is run through the same hashing function. The new hash is compared to the stored hash. If 
                they match, you are granted access to your account. It is almost impossible for hackers to generate the 
                password from the password hash.</li>
              <li>Content you create: any content that you may upload to webots.cloud.</li>
              <li>Other information you provide directly to us: when you contact us by e-mail for example.</li>
            </ul>
            <h4>Information we collect automatically</h4>
            <ul>
              <li>Information about your device: your Internet Protocol (IP) address.</li>
            </ul>
            <h4>Cookies</h4>
            <ul>
              <li>We don't use any cookies. Instead we use the more privacy-oriented local storage web technology.</li>
            </ul>
            <h2 class="subtitle pt-4">For which purpose do we collect your personal data?</h2>
            <ul>
              <li>To provide you with our services: create and manage your account, display the content you upload.</li>
              <li>To contact you when needed.</li>
              <li>To provide customer service.</li>
            </ul>
            <p>We do not sell your data. </p>
            <h2 class="subtitle pt-4">How do we protect your personal data?</h2>
            <p>The information that you provide to us through our services is stored on our secured servers located in 
              Switzerland.</p>
            <h2 class="subtitle pt-4">How long do we keep your personal data?</h2>
            <p>We keep your personal data only as long as it is necessary to provide you with our services. Then, your 
              personal data may be archived or deleted.</p>
            <h2 class="subtitle pt-4">How to contact us?</h2>
            <p>If you have any questions concerning the Privacy Policy, please contact us at 
              <a href="mailto: info@cyberbotics.com">info@cyberbotics.com</a>.</p>
          </div>
        </section>`
      that.setup('privacy-policy', template.content);
    }
  }
}
