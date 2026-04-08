function setTheme(theme) {
  document.body.className = theme;
  localStorage.setItem('theme', theme);
}

function initializeThemeToggle() {
  const themeCheckbox = document.getElementById('checkbox');
  if (!themeCheckbox) {
    return;
  }

  themeCheckbox.addEventListener('change', function() {
    if (this.checked) {
      setTheme('dark-mode');
    } else {
      setTheme('');
    }
  });

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.className = savedTheme;
    themeCheckbox.checked = savedTheme === 'dark-mode';
  }
}

function loadReadingPlan() {
  fetch('data/reading-plan.json')
    .then(response => response.json())
    .then(data => {
      window.readingPlanData = data;
      const maxDays = data.reading_plan.length;
      initializeSlider(maxDays);
      displayReadingPlan(1, maxDays);
    })
    .catch(error => console.error('Error loading reading plan:', error));
}

function initializeSlider(maxDays) {
  const slider = document.getElementById('daySlider');
  if (!slider) {
    return;
  }

  noUiSlider.create(slider, {
    start: [1, maxDays],
    connect: true,
    range: {
      min: 1,
      max: maxDays
    },
    step: 1,
    tooltips: [true, true],
    format: {
      to: value => Math.round(value),
      from: value => Number(value)
    }
  });
}

function displayReadingPlan(minDay, maxDay) {
  const daysContent = document.getElementById('daysContent');
  if (!daysContent || !window.readingPlanData) {
    return;
  }

  daysContent.innerHTML = '';

  window.readingPlanData.reading_plan.forEach((day, index) => {
    const dayNum = index + 1;
    if (dayNum >= minDay && dayNum <= maxDay) {
      const dayCard = document.createElement('div');
      dayCard.className = 'mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden';

      const dayHeader = document.createElement('div');
      dayHeader.className = 'bg-blue-500 dark:bg-blue-700 text-white p-3';
      dayHeader.innerHTML = `<h3 class="text-xl font-bold">Day ${dayNum}</h3>`;
      dayCard.appendChild(dayHeader);

      const readingsContainer = document.createElement('div');
      readingsContainer.className = 'p-4 flex flex-wrap gap-4';

      day.readings.forEach(reading => {
        const button = document.createElement('a');
        button.href = reading.link;
        button.target = '_blank';
        button.className = 'flex-1 min-w-[300px] max-w-[300px] p-4 m-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow hover:scale-105 transition-transform transition-colors';

        button.innerHTML = `
          <div class="flex flex-col h-full">
            <span class="font-medium text-blue-600 dark:text-blue-400">${reading.type}</span>
            <h4 class="font-semibold text-lg mt-1">${reading.title}</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300 mt-2 flex-1">${reading.description}</p>
          </div>
        `;

        readingsContainer.appendChild(button);
      });

      dayCard.appendChild(readingsContainer);
      daysContent.appendChild(dayCard);
    }
  });
}

function applyDayRange() {
  const slider = document.getElementById('daySlider');
  if (!slider || !slider.noUiSlider) {
    return;
  }

  const values = slider.noUiSlider.get();
  const minDay = parseInt(values[0], 10);
  const maxDay = parseInt(values[1], 10);

  if (minDay > maxDay) {
    alert('Minimum day cannot be greater than maximum day.');
    return;
  }

  displayReadingPlan(minDay, maxDay);
}

document.addEventListener('DOMContentLoaded', () => {
  initializeThemeToggle();
  loadReadingPlan();

  const applyButton = document.getElementById('applyDayRange');
  if (applyButton) {
    applyButton.addEventListener('click', applyDayRange);
  }
});
