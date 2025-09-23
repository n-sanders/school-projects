function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Function to set the theme based on user preference
function setTheme(theme) {
  document.body.className = theme;
  localStorage.setItem('theme', theme);
}

// Toggle theme function
document.getElementById('checkbox').addEventListener('change', function() {
  if (this.checked) {
    setTheme('dark-mode');
  } else {
    setTheme(''); // Revert to light mode
  }
});

// Check for saved theme on page load and initialize UI state
window.onload = function() {
  // Set theme
  var savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.className = savedTheme;
    if (savedTheme === 'dark-mode') {
      document.getElementById('checkbox').checked = true;
    }
  }
  // Ensure reading plan starts hidden
  const readingPlanSection = document.getElementById('reading-plan-section');
  if (readingPlanSection) {
    readingPlanSection.style.display = 'none';
  }
  const slider = document.getElementById('daySlider');
  // Initialize noUiSlider with default styling
  noUiSlider.create(slider, {
    start: [8, 14],
    connect: true,
    range: {
      'min': 1,
      'max': 14
    },
    step: 1,
    tooltips: [true, true],
    format: {
      to: value => Math.round(value),
      from: value => Number(value)
    }
  });
};

// Function to toggle reading plan visibility
function toggleReadingPlan() {
  const readingPlanSection = document.getElementById('reading-plan-section');
  const showButton = document.querySelector('button[onclick="toggleReadingPlan()"]');

  if (readingPlanSection.style.display === 'none' || readingPlanSection.style.display === '') {
    // Show the reading plan
    readingPlanSection.style.display = 'block';
    showButton.textContent = 'Hide Reading Plan';
    if (!window.readingPlanData) {
      loadReadingPlan();
    } else {
      displayReadingPlan();
    }
  } else {
    // Hide the reading plan
    readingPlanSection.style.display = 'none';
    showButton.textContent = 'Show Reading Plan';
  }
}

// Function to load reading plan
function loadReadingPlan() {
  fetch('data/reading-plan.json')
    .then(response => response.json())
    .then(data => {
      window.readingPlanData = data;
      displayReadingPlan();
    })
    .catch(error => console.error('Error loading reading plan:', error));
}

// Function to display reading plan
function displayReadingPlan(minDay, maxDay) {
  const daysContent = document.getElementById('daysContent');
  daysContent.innerHTML = '';
  
  if (!window.readingPlanData) return;

  // Use slider values if no arguments provided
  let min = minDay;
  let max = maxDay;
  if (typeof min === 'undefined' || typeof max === 'undefined') {
    const slider = document.getElementById('daySlider');
    if (slider && slider.noUiSlider) {
      const values = slider.noUiSlider.get();
      min = parseInt(values[0], 10);
      max = parseInt(values[1], 10);
    } else {
      min = 1;
      max = window.readingPlanData.reading_plan.length;
    }
  }

  window.readingPlanData.reading_plan.forEach((day, index) => {
    const dayNum = index + 1;
    if (dayNum >= min && dayNum <= max) {
      const dayCard = document.createElement('div');
      dayCard.className = 'mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden';

      // Day header
      const dayHeader = document.createElement('div');
      dayHeader.className = 'bg-blue-500 dark:bg-blue-700 text-white p-3';
      dayHeader.innerHTML = `<h3 class="text-xl font-bold">Day ${dayNum}</h3>`;
      dayCard.appendChild(dayHeader);

      // Readings container using flexbox
      const readingsContainer = document.createElement('div');
      readingsContainer.className = 'p-4 flex flex-wrap gap-4';

      // Add each reading as a button
      day.readings.forEach(reading => {
        const button = document.createElement('a');
        button.href = reading.link;
        button.target = '_blank';
        button.className = 'flex-1 min-w-[300px] max-w-[300px] p-4 m-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow hover:scale-105 transition-transform transition-colors';

        // Button content
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

      // Add day card to container
      daysContent.appendChild(dayCard);
    }
  });
}

// Function to apply day range filter
function applyDayRange() {
  const slider = document.getElementById('daySlider');
  if (!slider.noUiSlider) {
    alert('Slider not initialized.');
    return;
  }
  const values = slider.noUiSlider.get();
  // Ensure values are integers
  const minDay = parseInt(values[0], 10);
  const maxDay = parseInt(values[1], 10);

  if (minDay > maxDay) {
    alert('Minimum day cannot be greater than maximum day.');
    return;
  }
  displayReadingPlan(minDay, maxDay);
}

document.addEventListener('DOMContentLoaded', (event) => {
  // Fetch and display links
  fetch('data/links.json')
    .then(response => response.json())
    .then(data => {
      const linksContainer = document.getElementById('links-container');
      const arcadeContainer = document.getElementById('arcade-container');
      const evieContainer = document.getElementById('evie-container');
      const noahContainer = document.getElementById('noah-container');
      const hannahContainer = document.getElementById('hannah-container');
      const judahContainer = document.getElementById('judah-container');
      const ezraContainer = document.getElementById('ezra-container');

      // Function to create and append a link card
      const createLinkCard = (container, link) => {
        const card = document.createElement('div');
        card.className = "border rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 m-2 flex flex-col items-center";
        card.onclick = () => {
          window.open(link.url, "_blank");
        };

        const img = document.createElement('img');
        img.src = link.icon;
        img.alt = `${link.name} icon`;
        img.style.width = "100px"; 
        img.style.height = "100px"; 
        img.style.objectFit = "cover"; 
        img.className = "rounded-full items-center pt-2";

        const textContainer = document.createElement('div');
        textContainer.className = "p-4 text-center";

        const a = document.createElement('span');
        a.className = "text-lg font-bold text-blue-600 hover:underline";
        a.textContent = link.name;

        textContainer.appendChild(a);
        card.appendChild(img);
        card.appendChild(textContainer);
        container.appendChild(card);
      };

      // Create cards for common links
      data.common.forEach(link => createLinkCard(linksContainer, link));

      if (Array.isArray(data.arcade)) {
        data.arcade.forEach(link => createLinkCard(arcadeContainer, link));
      }

      data.evie.forEach(link => createLinkCard(evieContainer, link));
      data.noah.forEach(link => createLinkCard(noahContainer, link));
      data.hannah.forEach(link => createLinkCard(hannahContainer, link));
      data.judah.forEach(link => createLinkCard(judahContainer, link));
      data.ezra.forEach(link => createLinkCard(ezraContainer, link));
    })
    .catch(error => console.error('Error fetching links:', error));
});
