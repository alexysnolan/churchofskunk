function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}



async function loadQuotesFromFile(bushisms.txt) {
    const response = await fetch(bushisms.txt);
    const text = await response.text();
    return text 
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !=='');
}

async function showRandomQuote() {
  const quotes = await
loadQuotesFromFile('bushisms.txt');
  const randomQuote =
quotes[Math.floor(Math.random() *
quotes.length)];
  document.getElementsById('quoteBox').textContent = randomQuote;
}





function randomlist(list) {
  var x = Math.floor(Math.random() * list.length);
  return list[x];
}
