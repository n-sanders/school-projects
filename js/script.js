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

// Check for saved theme on page load
window.onload = function() {
  var savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.className = savedTheme;
    if (savedTheme === 'dark-mode') {
      document.getElementById('checkbox').checked = true;
    }
  }
};

document.addEventListener('DOMContentLoaded', (event) => {
  fetch('data/links.json')
    .then(response => response.json())
    .then(data => {
      const linksContainer = document.getElementById('links-container');
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

      data.evie.forEach(link => createLinkCard(evieContainer, link));
      data.noah.forEach(link => createLinkCard(noahContainer, link));
      data.hannah.forEach(link => createLinkCard(hannahContainer, link));
      data.judah.forEach(link => createLinkCard(judahContainer, link));
      data.ezra.forEach(link => createLinkCard(ezraContainer, link));
    })
    .catch(error => console.error('Error fetching links:', error));
});
