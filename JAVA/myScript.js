// *****FOOTER*****

fetch('../COMPONENTS/footsies.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('Footer file not found');
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('footsies').innerHTML = data;
  })
  .catch(error => {
    console.error('Error loading footer:', error);
  });


  // *****HEADER*****
  fetch('../COMPONENTS/top.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('Header file not found');
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('top').innerHTML = data;
  })
  .catch(error => {
    console.error('Error loading header:', error);
  });




//SKUNK FACT GENERATOR

let facts = [];

async function initFacts() {
    const response =
        await fetch('../LISTS/skunkfacts.json');
    facts = await response.json();
}

function showRandomFact() {
    const randomFact =
        facts[Math.floor(Math.random() * facts.length)];
    document.getElementById('factBox').textContent =
        randomFact.fact;
}



//fact fade stuff that doesnt work yet
initFacts();

function factFade() {
const factBox =
    document.getElementById("factBox");
factBox.textContent =
    randomFact.fact;
factBox.classList.remove("fact-fade");

// Force browser to notice removal
void factBox.offsetWidth;
factBox.classList.add("fact-fade");

}


//PRAYER GENERATOR

async function loadPrayersFromFile(fileName) {
    const response = await fetch(fileName);
    const text = await response.text();
    return text 
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !=='');
}

async function showRandomPrayer() {
  const prayers = await
loadPrayersFromFile('../LISTS/prayers.txt');
  const RandomPrayer =
prayers[Math.floor(Math.random() *
prayers.length)];
  document.getElementById('prayerBox').textContent = RandomPrayer;
}



function displayText() {
  const outputDiv = document.getElementById("textcontainer");
  outputDiv.textContent = "THUSLY SKUNK HAS SPOKEN";
}


let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}