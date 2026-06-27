//   DEITIES
async function loadDeity() {

    const response =
        await fetch("../ABOUT/deities.json");

    const deities =
        await response.json();

    const params =
        new URLSearchParams(window.location.search);

    const deityId =
        params.get("id");

    const deity =
        deities.find(
            d => d.id === deityId
        );

    if (!deity) {

        document.getElementById(
            "deityContainer"
        ).innerHTML =

            "<h1>Deity not found</h1>";

        return;
    }


//new
let sayingsHTML = "";

deity.sayings.forEach(saying => {

    sayingsHTML += `
        <h3>${saying.phrases.join(" / ")}</h3>
        <p><i>${saying.meaning}</i></p>
    `;

});



    document.getElementById(
        "deityContainer"
    ).innerHTML = `

        <h1 class="alt-section-title">${deity.name}</h1>

        <img
            id="deitypic" 
            src="${deity.image}"
            alt="${deity.name}"
        >
        
        <div class="deity-description">
        <h2 class="card-title">About</h2>
        <p>${deity.description}</p>

        <h2 class="card-title">Symbols</h2>
        <p>${deity.symbol}</p>

        <h2 class="card-title">Sayings</h2>
        <p>${sayingsHTML}</p>

        <h2 class="card-title">Offerings</h2>
        <p>${deity.offerings}</p>

        <h2 class="card-title">Rituals</h2>
        <p>${deity.rituals}</p>

        <h2 class="card-title">Associations</h2>
        <p>${deity.associations}</p>

        </div>
    `;
}

loadDeity();

//   EXPANDING BOXES
var coll = document.getElementsByClassName("collapsible");
console.log(coll.length);
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}

//   PRACTICES - SAYINGS
async function loadSayings() {
    const response =
        await fetch("../ABOUT/deities.json");
    const deity =
        await response.json();

console.log(deity);

    const practicingDeities =
        deity.filter(d => d.type === "Deity");

    let sayingsHTML = "";
    practicingDeities.forEach(deity => {
        sayingsHTML += `

            <img class="practices-pic" 
            src="${deity.image}"
            alt="${deity.name}"
            >
            <h1>${deity.name}</h1>

    `;      
        
        deity.sayings.forEach(saying => {
        sayingsHTML += `

            <h3 class="card-title">${saying.phrases.join(" / ")}</h3>
            <p><i>${saying.meaning}</i></p>

        `;
     });

    });

    document.getElementById("sayingsContainer").innerHTML = sayingsHTML;}
loadSayings();


//            <p>${deity.sayings.phrases.join(" / ")}</p>