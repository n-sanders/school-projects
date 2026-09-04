function formatReportDate(isoDate) {
  if (!isoDate) {
    return '';
  }

  const parts = String(isoDate).split('-').map(Number);
  if (parts.length !== 3 || parts.some(function(part) { return Number.isNaN(part); })) {
    return isoDate;
  }

  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function createReportCard(container, report) {
  const card = document.createElement('div');
  card.className = 'border rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 m-2 flex flex-col';
  card.onclick = function() {
    window.open(report.path, '_blank');
  };

  const textContainer = document.createElement('div');
  textContainer.className = 'p-4';

  const title = document.createElement('span');
  title.className = 'text-lg font-bold text-blue-600 hover:underline';
  title.textContent = report.title;

  textContainer.appendChild(title);

  if (report.date) {
    const date = document.createElement('div');
    date.className = 'text-sm';
    date.textContent = formatReportDate(report.date);
    textContainer.appendChild(date);
  }

  if (report.summary) {
    const summary = document.createElement('div');
    summary.className = 'text-sm';
    summary.textContent = report.summary;
    textContainer.appendChild(summary);
  }

  if (Array.isArray(report.tags) && report.tags.length) {
    const tags = document.createElement('div');
    tags.className = 'text-sm';
    tags.textContent = report.tags.join(' · ');
    textContainer.appendChild(tags);
  }

  card.appendChild(textContainer);
  container.appendChild(card);
}

function initializeThemeToggle() {
  const themeCheckbox = document.getElementById('checkbox');
  if (!themeCheckbox) {
    return;
  }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.className = savedTheme;
    themeCheckbox.checked = savedTheme === 'dark-mode';
  }

  if (themeCheckbox.dataset.bound === 'true') {
    return;
  }

  themeCheckbox.dataset.bound = 'true';
  themeCheckbox.addEventListener('change', function() {
    if (this.checked) {
      document.body.className = 'dark-mode';
      localStorage.setItem('theme', 'dark-mode');
    } else {
      document.body.className = '';
      localStorage.setItem('theme', '');
    }
  });
}

function loadResearchReports() {
  const reportsContainer = document.getElementById('reports-container');
  if (!reportsContainer) {
    return;
  }

  fetch('data/reports.json')
    .then(function(response) { return response.json(); })
    .then(function(data) {
      const reports = Array.isArray(data.reports) ? data.reports.slice() : [];
      reports.sort(function(a, b) {
        return String(b.date || '').localeCompare(String(a.date || ''));
      });

      reportsContainer.innerHTML = '';

      if (!reports.length) {
        const empty = document.createElement('div');
        empty.className = 'p-4 text-sm';
        empty.textContent = 'No research reports yet.';
        reportsContainer.appendChild(empty);
        return;
      }

      reports.forEach(function(report) {
        createReportCard(reportsContainer, report);
      });
    })
    .catch(function(error) {
      console.error('Error fetching reports:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
  initializeThemeToggle();
  loadResearchReports();
});
