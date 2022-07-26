export default class Benchmarks {
  constructor(routes, project) {
    this.routes = routes;
    this.project = project;
    let that = this;

    this.routes.push({ url: '/benchmarks', setup: benchmarksPage });
    this.routes.push({ url: '/', setup: benchmarksPage });

    document.addEventListener('click', this.benchmarkClickEvent.bind(this));

    function benchmarksPage() {
      const code = new URL(document.location.href).searchParams.get('code') ?
        (new URL(document.location.href).searchParams.get('code')).toString() : false;
      const state = new URL(document.location.href).searchParams.get('state') ?
        (new URL(document.location.href).searchParams.get('state')).toString() : false;

      if (code && state) {
        console.log('code: ' + code);
        console.log('state: ' + state);
      }

      const template = document.createElement('template');
      template.innerHTML =
        `<section class="section is-small">
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

  benchmarkClickEvent(event) {
    if (event.target.id.endsWith('start')) {
      const benchmark = event.target.id.split('-')[0];
      const url = '/run?url=https://github.com/robobenchmark/robobenchmark.github.io/blob/testing/docs/benchmarks/' +
        benchmark + '/worlds/' + benchmark + '.wbt';
      this.project.load(url);
      return;
      this.project.runWebotsView(url);
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
}
