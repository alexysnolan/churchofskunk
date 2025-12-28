function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}




var facts = ["Straight men who Praise Skunk get 20% more pussy than men who do not praise skunk", "please help me...I'm trapped in this website... it's a nice place to live but I want to see my son again...please get me out", "A skunks black fur with white stripes or spots serves as a warning to predators.", "Skunks have bad eyesight but excellent senses of smell and hearing.", "Skunks are nocturnal: mostly active at night, sleeping in dens during the day.",
"Before spraying, skunks will do a warning dance that entails stamping their feet, growling, possibly even a handstand to show their stripes.", "A skunks musk spray can hit targets up to 12 feet away.", "The smell of a skunks spray can be detectable for over a mile away.", "A skunks spray is highly flammable.", "Skunks eat insects, grubs, berries, roots, small rodents, eggs, and even snakes.", "Skunks help control pest populations, reducing the need for pesticides.", "Skunks help disperse seeds by eating fruits and shitting out the seeds in a different area.", "A group of skunks is called a surfeit.", "Baby skunks are called kits.", "Skunks are immune to snake venom and eat venomous snakes like rattlesnakes.", "About 1 in 1,000 people can't smell skunk spray.", "There are five species of skunks in North America: the Striped Skunk, Eastern Spotted Skunk, Western Spotted Skunk, Hooded Skunk, and the Hog-nosed Skunk.", "The Latin name of the Striped Skunk is <em>Mephitis mephitis</em>, which literlly translates to <em>Foul odor foul odor</em>.", "Striped skunks are polygamous.", "Skunks have been captively bred for their fur.", "The earliest fossil finds of skunks was in Nebraska, dating back to 1.8 million years ago.", "The english word <em>skunk</em> originates in Native American languages (Algonquian and Iroquoian).", "The Cree and Ojibwe word <em>shee-gawk</em> is the root word for Chicago, which means <em>skunk-land</em>.", "An alternative english name for a skunk is <em>prairie polecat</em>.", "Adult male Striped Skunks are 10% larger than adult females.", "Striped skunks typically weigh 4-10 pounds (some weight up to 12 pounds).", "Skunks have curved claws adapted for digging.", "Skunks have two highly developed scent glands arranged on either side of the anus - each contain about 15 millileters of musk.", "Skunk musk is yellow and oily.", "Skunk musk contains sulfur compounds called thiols.", "Skunk musk can cause a temporary burning sensation if sprayed in the eyes.", "Skunks normally breed once a year; breeding season typically begins in mid-February and lasts until mid-April.", "In January and February, prior to copulating, the male skunks testicles swell - attaining their maximum size in March.", "During mating season, male skunks will travel up to 2.5 miles per night in search of female skunks.", "When a male skunk locates a female skunk during breeding season, he will approach her from the rear and give her a good licking before biting her neck and gettin it on.",
"A single male skunks may have a harem of several females, which he mates with and defends against other males for a period of about 35 days.", "Impregnated skunks confine themselves to their dens.", "The skunk gestation period is 59-77 days.", "Skunk litters consist of 2-12 kits, with the average being five or six.", "The largest recorded skunk litter contained 18 kits.", "Skunk kits are born blind and sparsley furred.", "Skunk kits typically weigh 25-40 grams.", "Skunk kits open their eyes after around three weaks, and they are weaned after 42-56 days.", "When threatened, skunk kits will assume the defensive stand position even though their musk is still undeveloped.", "Skunk kits become independed after 2.5 months.", "Striped skunks may dig their own dens, but they will gladly appropriate and abandoned den, should the opportunity present itself.", "In winter, it is common for skunk dens to be occupied by several females and one male.", "During the winter, striped skunks save energy by reducing their body temperatures from 38 degrees celsius to 32 degrees celsius.", "Striped skunks primarily rely on fat reserve during cold weather - they can lose up to 50% of their body weight over the winter.", "Skunks primarily eat insects, but they'll also yonk on mice, voles, eggs, birds, amphibians, and reptiles.", "Striped skunks in California's coastal areas will feed on crabs."]
var randomFact = randomlist(facts);


function generateFacts() { var randomFact = randomlist(facts);
  document.getElementById('here').innerHTML = randomFact;
}



function randomlist(list) {
  var x = Math.floor(Math.random() * list.length);
  return list[x];
}



