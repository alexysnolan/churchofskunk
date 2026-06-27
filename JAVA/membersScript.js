//calculate membership length
function getMembershipLength(joindate) {
    const joined = new Date(joindate);
    const today = new Date();

    let years = today.getFullYear() - joined.getFullYear();
    let months = today.getMonth() - joined.getMonth();

    // Adjust if we haven't reached the join anniversary this month
    if (today.getDate() < joined.getDate()) {
        months--;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    if (years > 0) {
    return `${years} year${years !== 1 ? "s" : ""}, ${months} month${months !== 1 ? "s" : ""}`;
    }
    return `${months} month${months !== 1 ? "s" : ""}`;
}



//Load members and council to page
async function loadMembers() {
    const response =
        await fetch("../LISTS/memberslist.json");
    const members =
        await response.json();
    const councilMembers =
        members.filter(m => m.council);
    const regularMembers =
        members.filter(m => !m.council);

    let councilHTML = "";
    councilMembers.forEach(member => {
        councilHTML += `
         
            <p class="councilList">${member.displayname}</p>
            <p class="councilList"><i>${member.council}</i></p>

        `;
     });

    document.getElementById("councilList").innerHTML = councilHTML;

    let memberHTML = "";
    regularMembers.forEach(member => {
        const membershipLength = getMembershipLength(member.joindate);
        memberHTML += `
            <div class="public-members">
            <p class="names">${member.displayname}</p>
            <p>Member for: ${membershipLength}</p>
            <p><i>Joined: ${member.joindate}</i></p>
            </div>
        `;
    });

    document.getElementById("membersList").innerHTML = memberHTML;
}

loadMembers();


//BUSHISMS GENERATOR


async function initQuotes() {
    const response =
        await fetch('../LISTS/bushisms.json');
    quotes = await response.json();
    showRandomQuote();
}
initQuotes();


function showRandomQuote() {
    if (!quotes.length) {
        console.log("Quotes not loaded yet.");
        return;
    }
    const randomQuote =
        quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quoteBox').textContent =
        `"${randomQuote.quote}"`;
    document.getElementById('quoteSource').textContent =
        randomQuote.source;
}
