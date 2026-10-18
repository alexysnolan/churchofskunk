document.addEventListener('DOMContentLoaded', () => {
  fetch('../COMPONENTS/navbar.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('navbar').innerHTML = data;
       initNavbar(console.log("Navbar initialized"));
    });
});

function initNavbar() {
  const hamMenu = document.querySelector('.ham-menu');
  const offScreenMenu = document.querySelector('.off-screen-menu');
  const overlay = document.getElementById('overlay');

  if (!hamMenu || !offScreenMenu || !overlay) return;

hamMenu.addEventListener('click', () => {
  const isOpen = offScreenMenu.classList.contains('active');

  if (isOpen) {
    hamMenu.classList.remove('active');
    offScreenMenu.classList.remove('active');
    overlay.classList.remove('active');
  } else {
    hamMenu.classList.add('active');
    offScreenMenu.classList.add('active');
    overlay.classList.add('active');
  }
});

const toggles = document.querySelectorAll('.sub-toggle');

toggles.forEach(toggle => {
  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      // Close all other submenus
      toggles.forEach(otherToggle => {
        if (otherToggle !== toggle) {
          otherToggle.checked = false;
        }
      });
    }
  });
});

}

document.addEventListener('click', (e) => {
  const hamMenu = document.querySelector('.ham-menu');
  const offScreenMenu = document.querySelector('.off-screen-menu');

  const clickedInsideMenu = offScreenMenu.contains(e.target);
  const clickedHamburger = hamMenu.contains(e.target);

  if (!clickedInsideMenu && !clickedHamburger) {
    hamMenu.classList.remove('active');
    offScreenMenu.classList.remove('active');
    overlay.classList.remove('active');
  }

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hamMenu.classList.remove('active');
    offScreenMenu.classList.remove('active');
    overlay.classList.remove('active');
  }
});


});