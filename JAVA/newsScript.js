// NEWS PULL FOR FRONT PAGE
async function loadLatestNews() {
    try {
        const response = await fetch("../LISTS/monthlyUpdates.json");
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const updates = await response.json();
        if (!Array.isArray(updates) || updates.length === 0) {
            throw new Error("No news updates found.");
        }

        // Find the entry with the most recent date
        const latestUpdate = updates.reduce((latest, current) => {
            return new Date(current.date) > new Date(latest.date)
                ? current
                : latest;
        });

        displayNewsUpdate(latestUpdate);
    } catch (error) {
        console.error("Error loading monthly news:", error);
    }
}


function displayNewsUpdate(update) {
    const newsContainer = document.getElementById("latest-news");

    if (!newsContainer) {
        console.error('Could not find element with id="latest-news".');
        return;
    }

    // Prevent duplicate content if function runs more than once
    newsContainer.innerHTML = "";

    // Format date as "October, 2026"
    const date = new Date(update.date + "T00:00:00");
    const monthYear = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    });


    // TITLE
    const title = document.createElement("h2");
    title.textContent = `${update.title} (${monthYear})`;
    newsContainer.appendChild(title);


    // IMAGES
    if (update.images?.length) {
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("news-images");

        update.images.forEach(image => {
            const img = document.createElement("img");

            img.src = image.url;
            img.alt = image.name || "";
            img.classList.add("news-image");

            imageContainer.appendChild(img);
        });

        newsContainer.appendChild(imageContainer);
    }


// CONTENT
if (update.content?.length) {
    const contentContainer = document.createElement("div");
    contentContainer.classList.add("news-content");

    update.content.forEach((paragraphText, index) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = paragraphText;

        // Hide everything after the first paragraph
        if (index > 0) {
            paragraph.classList.add("extra-news-content");
        }

        contentContainer.appendChild(paragraph);
    });

    newsContainer.appendChild(contentContainer);


    // READ MORE BUTTON
    if (update.content.length > 1) {
        const readMoreButton = document.createElement("button");

        readMoreButton.textContent = "Read more ...";
        readMoreButton.classList.add("read-more-button");

        readMoreButton.addEventListener("click", () => {
            const extraParagraphs =
                contentContainer.querySelectorAll(".extra-news-content");

            const isExpanded =
                readMoreButton.classList.toggle("expanded");

            extraParagraphs.forEach(paragraph => {
                paragraph.style.display = isExpanded ? "block" : "none";
            });

            readMoreButton.textContent = isExpanded
                ? "Show less"
                : "...Read more";
        });

        newsContainer.appendChild(readMoreButton);
    }
}


    // LINKS
    if (update.links?.length) {
        const linkContainer = document.createElement("div");
        linkContainer.classList.add("news-links");

        update.links.forEach(link => {
            const button = document.createElement("a");

            button.href = link.url;
            button.textContent = link.name;

            button.classList.add("news-button");
            button.target = "_blank";
            button.rel = "noopener noreferrer";

            linkContainer.appendChild(button);
        });

        newsContainer.appendChild(linkContainer);
    }
}


loadLatestNews();


// ---------------------------------
// NEWS PAGE
// ---------------------------------
let allNewsUpdates = [];
let archiveIndex = 4;

const archiveBatchSize = 6;

async function loadNewsPage() {

    try {

        const response = await fetch("../LISTS/monthlyUpdates.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const updates = await response.json();

        if (!Array.isArray(updates) || updates.length === 0) {
            throw new Error("No news updates found.");
        }

        // Sort newest to oldest
        allNewsUpdates = [...updates].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        // 1. Featured article
        displayFeaturedNews(allNewsUpdates[0]);
        // 2. Next 3 newest articles
        displayRecentNews(allNewsUpdates.slice(1, 4));
        // 3. Set up archive button
        setupArchive();

    }
    catch (error) {
        console.error("Error loading news:", error);
    }
}


// ---------------------------------
// DATE FORMATTER
// ---------------------------------
function formatNewsDate(dateString) {

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    });

}



// ---------------------------------
// FEATURED ARTICLE
// ---------------------------------
function displayFeaturedNews(update) {
    const container = document.getElementById("featured-news");
    if (!container) return;
    container.innerHTML = "";


    // TITLE
    const title = document.createElement("h1");
    title.textContent = update.title;

    container.appendChild(title);


    // DATE
    const date = document.createElement("div");
    date.classList.add("news-date");
    date.textContent = formatNewsDate(update.date);

    container.appendChild(date);


    // IMAGES
    if (update.images?.length) {
        const imageContainer = createImageContainer(update.images);
        container.appendChild(imageContainer);

    }


    // CONTENT
    if (update.content?.length) {

        const contentContainer = document.createElement("div");
        contentContainer.classList.add("news-content");


        update.content.forEach((paragraphText, index) => {

            const paragraph = document.createElement("p");

            paragraph.textContent = paragraphText;


            // Hide everything except first paragraph
            if (index > 0) {
                paragraph.classList.add("extra-news-content");
            }

            contentContainer.appendChild(paragraph);

        });

        container.appendChild(contentContainer);


        // READ MORE
        if (update.content.length > 1) {

            const readMoreButton = document.createElement("button");

            readMoreButton.classList.add("read-more-button");
            readMoreButton.textContent = "Read more ...";


            readMoreButton.addEventListener("click", () => {

                const extraParagraphs =
                    contentContainer.querySelectorAll(".extra-news-content");

                const expanded =
                    readMoreButton.classList.toggle("expanded");

                extraParagraphs.forEach(paragraph => {
                    paragraph.style.display =
                        expanded ? "block" : "none";
                });
                readMoreButton.textContent =
                    expanded ? "Show less" : "...Read more";
            });
            container.appendChild(readMoreButton);
        }
    }


    // LINKS
    if (update.links?.length) {

        container.appendChild(
            createLinkContainer(update.links)
        );

    }

}



// ---------------------------------
// RECENT NEWS - NEXT THREE
// ---------------------------------

function displayRecentNews(updates) {
    const container = document.getElementById("recent-news");
    if (!container) return;
    container.innerHTML = "";

    updates.forEach(update => {
        const card = document.createElement("article");
        card.classList.add("recent-news-card");

        // COLLAPSED SUMMARY
        const summary = document.createElement("div");
        summary.classList.add("recent-news-summary");

        // THUMBNAIL
        if (update.images?.length) {
            const thumbnail = document.createElement("img");

            thumbnail.src = update.images[0].url;
            thumbnail.alt = update.images[0].name || "";
            thumbnail.classList.add("recent-news-thumbnail");

            summary.appendChild(thumbnail);

        }


        // SUMMARY TEXT
        const summaryText = document.createElement("div");

        const title = document.createElement("h3");

        title.textContent = update.title;


        const date = document.createElement("div");

        date.classList.add("news-date");
        date.textContent = formatNewsDate(update.date);


        const toggleText = document.createElement("div");

        toggleText.classList.add("card-toggle");
        toggleText.textContent = "Read article →";


        summaryText.appendChild(title);
        summaryText.appendChild(date);
        summaryText.appendChild(toggleText);


        summary.appendChild(summaryText);

        card.appendChild(summary);



        // FULL EXPANDED ARTICLE
        const expandedContent =
            createExpandedArticle(update);

        expandedContent.classList.add(
            "recent-news-expanded"
        );

        card.appendChild(expandedContent);



        // CLICK TO EXPAND
        summary.addEventListener("click", () => {

            const expanded =
                card.classList.toggle("expanded");


            toggleText.textContent =
                expanded
                    ? "Show less ↑"
                    : "Read article →";
        });

        container.appendChild(card);

    });

}



// ---------------------------------
// CREATE FULL ARTICLE CONTENT
// Used for recent + archive cards
// ---------------------------------

function createExpandedArticle(update) {

    const container = document.createElement("div");


    // ALL IMAGES
    if (update.images?.length) {

        container.appendChild(
            createImageContainer(update.images)
        );

    }


    // ALL TEXT
    if (update.content?.length) {

        const contentContainer =
            document.createElement("div");

        contentContainer.classList.add(
            "news-content"
        );


        update.content.forEach(paragraphText => {

            const paragraph =
                document.createElement("p");

            paragraph.textContent =
                paragraphText;

            contentContainer.appendChild(
                paragraph
            );

        });

        container.appendChild(
            contentContainer
        );

    }


    // LINKS
    if (update.links?.length) {

        container.appendChild(
            createLinkContainer(update.links)
        );

    }

    return container;

}


// ---------------------------------
// IMAGE CONTAINER
// ---------------------------------

function createImageContainer(images) {
    const imageContainer =
        document.createElement("div");
    imageContainer.classList.add(
        "news-images"
    );


    images.forEach(image => {

        const img =
            document.createElement("img");

        img.src = image.url;
        img.alt = image.name || "";

        img.classList.add(
            "news-image"
        );


        imageContainer.appendChild(img);

    });


    return imageContainer;

}



// ---------------------------------
// LINK BUTTONS
// ---------------------------------

function createLinkContainer(links) {

    const linkContainer =
        document.createElement("div");

    linkContainer.classList.add(
        "news-links"
    );


    links.forEach(link => {

        const button =
            document.createElement("a");

        button.href = link.url;
        button.textContent = link.name;

        button.classList.add(
            "news-button"
        );

        button.target = "_blank";

        button.rel =
            "noopener noreferrer";


        linkContainer.appendChild(
            button
        );

    });


    return linkContainer;

}



// ---------------------------------
// ARCHIVE / LOAD MORE
// ---------------------------------

function setupArchive() {

    const loadMoreButton =
        document.getElementById("load-more-news");


    if (!loadMoreButton) return;


    // If there aren't any articles older than
    // the featured + recent 3, hide button
    if (allNewsUpdates.length <= 4) {

        loadMoreButton.style.display = "none";

        return;

    }


    loadMoreButton.addEventListener(
        "click",
        loadMoreNews
    );

}



// ---------------------------------
// LOAD NEXT ARCHIVE BATCH
// ---------------------------------

function loadMoreNews() {
    const archiveContainer =
        document.getElementById("news-archive-grid");

    const loadMoreButton =
        document.getElementById("load-more-news");

    const nextUpdates =
        allNewsUpdates.slice(
            archiveIndex,
            archiveIndex + archiveBatchSize
        );


    nextUpdates.forEach(update => {
        const card =
            createArchiveCard(update);
        archiveContainer.appendChild(card);

    });

    archiveIndex += archiveBatchSize;

    // Hide button once all articles are shown
    if (archiveIndex >= allNewsUpdates.length) {

        loadMoreButton.style.display = "none";

    }

}



// ---------------------------------
// ARCHIVE CARD
// ---------------------------------

function createArchiveCard(update) {

    const card =
        document.createElement("article");

    card.classList.add(
        "archive-news-card"
    );


    // IMAGE
    if (update.images?.length) {

        const thumbnail =
            document.createElement("img");

        thumbnail.src =
            update.images[0].url;

        thumbnail.alt =
            update.images[0].name || "";

        thumbnail.classList.add(
            "archive-thumbnail"
        );


        card.appendChild(thumbnail);

    }


    // TITLE
    const title =
        document.createElement("h3");

    title.textContent =
        update.title;

    card.appendChild(title);


    // DATE
    const date =
        document.createElement("div");

    date.classList.add(
        "news-date"
    );

    date.textContent =
        formatNewsDate(update.date);

    card.appendChild(date);


    // CLICK PROMPT
    const toggle =
        document.createElement("div");

    toggle.classList.add(
        "card-toggle"
    );

    toggle.textContent =
        "Read article →";

    card.appendChild(toggle);


    // EXPANDED ARTICLE
    const expandedContent =
        createExpandedArticle(update);

    expandedContent.classList.add(
        "archive-news-expanded"
    );

    card.appendChild(
        expandedContent
    );


    // EXPAND / COLLAPSE
    card.addEventListener("click", event => {

        // Don't collapse card when clicking
        // one of the actual links
        if (event.target.closest("a")) {
            return;
        }


        const expanded =
            card.classList.toggle(
                "expanded"
            );


        toggle.textContent =
            expanded
                ? "Show less ↑"
                : "Read article →";

    });


    return card;

}



// ---------------------------------
// START
// ---------------------------------

loadNewsPage();