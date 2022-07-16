import Page from "./page.js";

document.addEventListener('DOMContentLoaded', function() {
  const content = homePage();
  new Page('home', content);
  if (listBenchmarks())
    document.addEventListener('click', clickEvent);
});

function homePage() {
  const template = document.createElement('template');
  template.innerHTML =
    `<section class="hero is-medium has-background-grey-lighter">
      <div class="hero-body">
        <div class="container title-container">
          <figure class="image is-64x64" style="top: 6px; margin-right: 15px;">
            <img src="images/robotbenchmark-logo-black-eyes.svg" id="title-logo"/>
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
    </section>
    <section class="section is-small">
      <table class="table mx-auto" style="min-width: 700px">
        <thead>
          <tr>
            <th>Robot</th>
            <th class="has-text-centered">Title</th>
            <th class="has-text-centered">Attempts</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="benchmark-table">
        </tbody>
      </table>
    </section>`;
  return template.content;
}

function runWebotsView(url) {
  const server = 'https://testing.webots.cloud/ajax/server/session.php?url=' + url;
  const mode = 'x3d';

  setupWebotsView(url);

  return new Promise((resolve, reject) => {
    let dotIndex = url.lastIndexOf('/') + 1;
    let thumbnailUrl = (url.slice(0, dotIndex) + "." +url.slice(dotIndex)).replace('github.com',
      'raw.githubusercontent.com').replace('/blob', '').replace('.wbt', '.jpg');
    document.getElementById('webots-view').connect(server, mode, false, undefined, 300, thumbnailUrl);
    document.getElementById('webots-view').showQuit = false;
    resolve();
  });
}

function setupWebotsView(url) {
  const view = (!document.getElementById('webots-view')) ?
    '<webots-view id="webots-view" style="height:100%; width:100%; display:block;"></webots-view>' : '';
  let template = document.createElement('template');
  template.innerHTML =
    `<section class="section" style="padding:0; height:100%">
      <div class="simulation-container" id="webots-view-container">
        ${view}
      </div>
     </section>'`;
  new Page('webots-view', template.content);
}

function listBenchmarks() {
  return new Promise((resolve, reject) => {
    fetch('benchmarks/benchmark_list.txt')
      .then(function(response) { return response.text(); })
      .then(function(data) {
        const benchmarks = data.split('\n');
        benchmarks.forEach(function(benchmark) {
          if (benchmark === '')
            return;
          const title = benchmark.split('//')[0];
          const difficulty = benchmark.split('//')[1];
          const description = benchmark.split('//')[2];
          const robot = benchmark.split('//')[3];
          const star = '<i class="fas fa-xs fa-star"></i>';
          let difficultyStars = '<div class=difficulty>' + star.repeat(difficulty) + '</div>';
          let titleClean = title.split('_');
          for (let i = 0; i < titleClean.length; i++)
            titleClean[i] = titleClean[i].charAt(0).toUpperCase() + titleClean[i].slice(1);
          titleClean = titleClean.join(' ');

          let row = document.createElement('tr');
          row.id = 'benchmark-' + title.replace('_', '-');
          row.className = 'is-clickable';
          row.innerHTML =
            `<td class="has-text-centered" style="vertical-align: middle;" title="${robot}">
              <figure class="image is-48x48">
                <img src="images/robots/${robot}.png"></img>
              </figure>
            </td>
            <td class="has-text-centered" style="vertical-align: middle;">
              <p style="font-size: small">${titleClean}</p>${difficultyStars}
            </td>
            <td class="has-text-centered" style="vertical-align: middle;">
              <span class="tag">0</span>
            </td>
            <td style="vertical-align: middle; font-size: small">
              ${description}
            </td>
            <td style="vertical-align: middle;">
              <button class="button is-small" id="${title}-start">Start</button>
            </td>`;
          document.getElementById('benchmark-table').appendChild(row);
          resolve();
        });
      });
  });
}

function clickEvent(event) {
  if (event.target.id.endsWith('start')) {
    const benchmark = event.target.id.split('-')[0];
    const url = 'https://github.com/ThomasOliverKimble/robotbenchmark/blob/testing/docs/benchmarks/' +
      benchmark + '/worlds/' + benchmark + '.wbt';
    runWebotsView(url);
    return;
  }
  const targetId = event.target.parentNode.id;
  if (!document.getElementById('benchmark-table'))
    return;
  document.getElementById('benchmark-table').childNodes.forEach(function(row) {
    if (row.lastChild && row.lastChild.childNodes[1].classList.contains('is-primary') && targetId !== row.id) {
      row.lastChild.childNodes[1].classList.toggle('is-primary');
      row.classList.toggle('dark-row');
    }
  });
  if (!targetId.startsWith('benchmark'))
    return;
  let benchmarkRow = document.getElementById(targetId);
  benchmarkRow.classList.toggle('dark-row');
  benchmarkRow.lastChild.childNodes[1].classList.toggle('is-primary');
}
