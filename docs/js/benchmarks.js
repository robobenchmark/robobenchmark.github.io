export default class Benchmarks {
  constructor(routes, project) {
    this.routes = routes;
    this.project = project;
    let that = this;
    this.routes.push({ url: '/benchmarks', setup: benchmarksPage });
    this.routes.push({ url: '/', setup: benchmarksPage });

    document.addEventListener('click', this.benchmarkClickEvent.bind(this));

    function benchmarksPage() {
      const template = document.createElement('template');
      template.innerHTML =
        `<section class="hero is-medium is-light">
          <div class="hero-body">
            <div class="container title-container">
              <figure class="image is-64x64" style="margin-right: 15px; margin-top: 7px;">
                <img src="docs/images/robotbenchmark-logo-black-eyes.svg" id="title-logo"/>
              </figure>
              <div class="title-text">
                <p class="title is-size-1 is-regular">
                  Benchmarks
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
              <div class=title>Official Benchmarks</div>
              <table class="table mx-auto" id="benchmarks-table" style="min-width: 700px;">
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
          </section>
        </div>`;
      that.project.setup('benchmarks', [], template.content);
      that.listBenchmarks();
    }
  }

  listBenchmarks() {
    return new Promise((resolve, reject) => {
      fetch('docs/benchmarks/benchmark_list.txt')
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
                  <img src="docs/images/robots/${robot}.png"></img>
                </figure>
              </td>
              <td class="has-text-centered" style="vertical-align: middle;">
                <p style="font-size: small">${titleClean}</p>${difficultyStars}
              </td>
              <td class="has-text-centered" style="vertical-align: middle;">
                <span class="tag">0</span>
              </td>
              <td style="vertical-align: middle; font-size: small;">
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

  benchmarkClickEvent(event) {
    const benchmark = event.target.id.split('-')[0];
    if (event.target.id.endsWith('start')) {
      const url = '/run?url=https://github.com/robobenchmark/robobenchmark.github.io/blob/testing/docs/benchmarks/' +
        benchmark + '/worlds/' + benchmark + '.wbt';
      this.project.load(url);
      return;
      this.project.runWebotsView(url);
      return;
    }

    if (!document.getElementById('benchmark-table'))
      return;

    const targetId = event.target.parentNode.id;
    let that = this;
    document.getElementById('benchmark-table').childNodes.forEach(function(row) {
      if (row.lastChild && row.lastChild.childNodes[1].classList.contains('is-primary') && targetId !== row.id) {
        row.lastChild.childNodes[1].classList.toggle('is-primary');
        row.classList.toggle('dark-row');
        document.getElementById('benchmark-table').deleteRow(row.rowIndex)
        that.removePreview();
      }
    });

    if (!targetId.startsWith('benchmark'))
      return;

    let benchmarkRow = document.getElementById(targetId);
    benchmarkRow.classList.toggle('dark-row');
    benchmarkRow.lastChild.childNodes[1].classList.toggle('is-primary');

    if (document.getElementById('benchmark-preview')) {
      this.removePreview();
      document.getElementById('benchmark-preview').remove();
    } else {
      const rowIndex = benchmarkRow.rowIndex;
      const table = document.getElementById("benchmarks-table");
      const row = table.insertRow(rowIndex + 1);
      row.className = 'dark-row is-clickable';
      row.id = 'benchmark-preview';
      row.style.borderTop = 'none';
      row.innerHTML =
        `<td class="has-text-left" colspan="3" style="vertical-align: middle;">
          <div class="columns" style="display: flex">
            <div class="column is-three-fifths" style="min-width: 175px">
              <p style="font-size: small;">Difficulty level:</p>
              <p style="font-size: small;">Number of participants:</p>
              <p style="font-size: small;">Robot:</p>
              <p style="font-size: small;">Programming language:</p>
              <p style="font-size: small;">Minimum commitment:</p>
            </div>
            <div class="column">
              <p style="font-size: small; font-weight: bold;">Middle School</p>
              <p style="font-size: small; font-weight: bold;">5332</p>
              <p style="font-size: small; font-weight: bold;">Thymio II</p>
              <p style="font-size: small; font-weight: bold;">Python</p>
              <p style="font-size: small; font-weight: bold;">A few minutes</p>
            </div>
          </div>
        </td>
        <td class="has-text-centered" colspan="2" style="vertical-align: middle;">
          <div id="benchmark-preview-container" style="width: 100%; aspect-ratio: 16 / 9; padding: 10px;"></div>
        </td>`;
        this.showPreview();
    }
  }

  showPreview() {
    if (!this.benchmarkPreviewWebotsView) {
      this.benchmarkPreviewWebotsView = document.createElement('webots-view');
      this.benchmarkPreviewWebotsView.id = 'benchmark-preview-webots-view';
      document.getElementById('benchmark-preview-container').append(this.benchmarkPreviewWebotsView);
    }
    const reference = '/docs/benchmarks/robot_programming/animation';
    this.benchmarkPreviewWebotsView.loadAnimation(`${reference}/scene.x3d`, `${reference}/animation.json`,
      this.project.isMobileDevice(), false, `${reference}/thumbnail.jpg`);
  }

  removePreview() {
    if (this.benchmarkPreviewWebotsView)
      this.benchmarkPreviewWebotsView.remove()
  }
}
