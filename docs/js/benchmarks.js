export default class Benchmarks {
  constructor(routes, project) {
    this.routes = routes;
    this.project = project;
    let that = this;
    this.routes.push({ url: '/benchmarks', setup: benchmarksPage });
    this.setupBenchmarkPages();

    function benchmarksPage() {
      const template = document.createElement('template');
      template.innerHTML =
        `<section class="hero is-medium is-dark is-background-gradient">
          <div class="hero-body">
            <div class="container title-container">
              <figure class="image is-64x64" style="margin-right: 15px; margin-top: 7px;">
                <img src="docs/images/robotbenchmark-logo-white-eyes.svg"
                  id="title-logo"/>
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
              <table class="table mx-auto" id="benchmarks-table" style="width: 100%; min-width: 700px;">
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

  setupBenchmarkPages() {
    let that = this;
    function benchmarkPage() {
      const information =
        `<div class="columns" style="display: flex;">
          <div class="column is-three-fifths" style="width: 170px; align-items: center;">
            <p style="font-size: small;">Difficulty level:</p>
            <p style="font-size: small;">Number of participants:</p>
            <p style="font-size: small;">Robot:</p>
            <p style="font-size: small;">Programming language:</p>
            <p style="font-size: small;">Minimum commitment:</p>
          </div>
          <div id="benchmark-information" class="column" style="min-width: 120px; align-items: center;">
          </div>
        </div>`;

      const rankingsTable =
        `<section class="section" data-content="rankings" style="padding: 0">
          <div class="table-container rankings-table mx-auto">
            <div class="search-bar" style="max-width: 280px; padding-bottom: 20px;">
              <div class="control has-icons-right">
                <input class="input is-small" id="rankings-search-input" type="text" placeholder="Search for users...">
                <span class="icon is-small is-right is-clickable" id="rankings-search-click">
                  <i class="fas fa-search" id="rankings-search-icon"></i>
                </span>
              </div>
            </div>
            <table class="table is-striped is-hoverable">
              <thead>
                <tr>
                  <th class="has-text-centered">Ranking</th>
                  <th>Username</th>
                  <th class="has-text-centered">Date</th>
                  <th class="has-text-centered">Runs</th>
                  <th class="has-text-centered">Performance</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
            <div class="empty-search" id="rankings-empty-search" style="display: none;">
              <i class="fas fa-xl fa-search" id="no-project-icon"
                style="color: lightgrey; padding-right: 10px; position: relative; top: 12px;"></i>
              <p id="rankings-empty-search-text"></p>
            </div>
          </div>
          <nav class="pagination is-small is-rounded mx-auto" role="navigation" aria-label="pagination"></nav>
        </section>`;

      let benchmark = window.location.pathname.split('/')[2];
      let title = benchmark.split('-');
      for (let i = 0; i < title.length; i++)
        title[i] = title[i].charAt(0).toUpperCase() + title[i].slice(1);
      title = title.join(' ');
      const template = document.createElement('template');
      template.innerHTML =
        `<section class="hero is-small is-dark is-background-gradient" style="position: relative; padding-top: 45px; padding-bottom: 20px">
          <div class="hero-body">
            <div class="container title-container">
              <figure class="image is-64x64" style="margin-right: 15px; margin-top: 7px;">
                <img src="../docs/images/robotbenchmark-logo-white-eyes.svg"
                  id="title-logo"/>
              </figure>
              <div class="title-text">
                <p class="title is-size-1 is-regular">
                  ${title}
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
              <div class="tile is-parent is-4">
                <article class="tile is-child box">
                  <p class="title">Information</p>
                  <p id="benchmark-information-description" style="margin-bottom: 25px;"></p>
                  <div class="content">
                    ${information}
                  </div>
                  <a class="button is-primary has-button-gradient" id="run-benchmark">
                    Run Benchmark
                  </a>
                </article>
              </div>
              <div class="tile is-parent">
                <article class="tile is-child box">
                  <p class="title">Preview</p>
                  <div class="content">
                    <div id="benchmark-preview-container"></div>
                  </div>
                </article>
              </div>
            </div>

            <div class="tile is-ancestor">
              <div class="tile is-parent">
                <div class="tile is-child box">
                  <p class="title">Rankings</p>
                  <div class="content">
                    ${rankingsTable}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>`;
      that.project.setup('benchmarks/' + benchmark, [], template.content);

      benchmark = benchmark.replaceAll('-', '_')
      const reference = '/docs/benchmarks/' + benchmark + '/animation/' + benchmark;
      that.project.runWebotsView(reference);

      that.getBenchmarkInformation(benchmark);
      document.getElementById('run-benchmark').addEventListener('click', _ => {
        window.stop();
        setTimeout(() => {
          that.project.load('/run?name=' + benchmark);
        }, "250")
      });
    }

    return new Promise((resolve, reject) => {
      fetch('docs/benchmarks/benchmark_list.txt')
        .then(function(response) { return response.text(); })
        .then(function(data) {
          const benchmarks = data.split('\n');
          benchmarks.forEach(function(benchmark) {
            if (benchmark === '')
              return;
            const title = benchmark.split('//')[0];
            that.routes.push({ url: '/benchmarks/' + title.replaceAll('_', '-'), setup: benchmarkPage });
          });
          resolve();
        });
    });
  }

  getBenchmarkInformation(benchmarkName) {
    const dict = {
      1: 'Middle School',
      2: 'High School',
      3: 'Bachelor',
      4: 'Master',
      5: 'PhD'
    }

    fetch('../docs/benchmarks/benchmark_list.txt')
    .then(function(response) { return response.text(); })
    .then(function(data) {
      const benchmarks = data.split('\n');
      for (const benchmark of benchmarks) {
        if (benchmark.split('//')[0] !== benchmarkName)
          continue;
        const title = benchmark.split('//')[0];
        const difficulty = benchmark.split('//')[1];
        const description = benchmark.split('//')[2];
        const robot = benchmark.split('//')[3];
        const language = benchmark.split('//')[4];
        const time = benchmark.split('//')[5];
        const attempts = benchmark.split('//')[6];
        document.getElementById('benchmark-information').innerHTML =
          `<p style="font-size: small; font-weight: bold;">${dict[difficulty]}</p>
          <p style="font-size: small; font-weight: bold;">${attempts}</p>
          <p style="font-size: small; font-weight: bold;">${robot}</p>
          <p style="font-size: small; font-weight: bold;">${language}</p>
          <p style="font-size: small; font-weight: bold;">${time}</p>`;
        document.getElementById('benchmark-information-description').innerHTML = description;
        break;
      }
    });
  }

  listBenchmarks() {
    let that = this;
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
            const attempts = benchmark.split('//')[6];
            const star = '<i class="fas fa-xs fa-star"></i>';
            let difficultyStars = '<div class=difficulty>' + star.repeat(difficulty) + '</div>';
            let titleClean = title.split('_');
            for (let i = 0; i < titleClean.length; i++)
              titleClean[i] = titleClean[i].charAt(0).toUpperCase() + titleClean[i].slice(1);
            titleClean = titleClean.join(' ');
  
            let row = document.createElement('tr');
            row.id = 'benchmark-' + title.replaceAll('_', '-');
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
                <span class="tag">${attempts}</span>
              </td>
              <td style="vertical-align: middle; font-size: small;">
                ${description}
              </td>
              <td style="vertical-align: middle;">
                <button class="button is-small is-primary has-button-gradient" id="${title}-start" href="about">Start</button>
              </td>`;
            document.getElementById('benchmark-table').appendChild(row);
            document.getElementById(title + '-start').addEventListener('click', function(event) {
              that.project.load('/benchmarks/' + title.replace('_', '-'));
            })
          });
          resolve();
        });
    });
  }
}
