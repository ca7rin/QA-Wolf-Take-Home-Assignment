// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  const articles = [];

  // Loop to get articles until we have 100
  while (articles.length < 100) {
    // Get articles from the current page
    const pageArticles = await page.$$eval('.athing', rows => {
      return rows.map(row => {
        // Extract the title
        const titleElement = row.querySelector('.titleline a'); // Title link
        const title = titleElement ? titleElement.innerText : ''; // Extract title text
        const id = row.id; // Article ID from the `.athing` row

        // Extract the time
        const timeElement = row.nextElementSibling.querySelector('.age'); // Time is in the next sibling
        const time = timeElement ? timeElement.innerText : ''; // Extract display time text
        const timestamp = timeElement ? timeElement.getAttribute('title') : ''; // Extract the full timestamp from title attribute

        return { title, id, time, timestamp };
      });
    });

    // Append articles up to 100
    for (const article of pageArticles) {
      if (articles.length < 100) {
        articles.push(article);
      } else {
        break; // Stop adding if we already have 100 articles
      }
    }

    // Check if we need to go to the next page
    const nextPageLink = await page.$('a[rel="next"]');
    if (nextPageLink && articles.length < 100) {
      await Promise.all([
        nextPageLink.click(),
        page.waitForNavigation({ waitUntil: 'networkidle' }),
      ]);
    } else {
      break; // No more pages or we have enough articles
    }
  }

  // Sort articles based on timestamp (newest first)
  articles.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  console.log("Sorted articles based on time:", articles);

  // Validate that the articles are sorted (IDs should be decreasing from newest to oldest)
  const sorted = articles.every((article, i, arr) => {
    if (i === 0) return true; // First article, no comparison
    return new Date(article.timestamp) <= new Date(arr[i - 1].timestamp); // Articles should be sorted in descending order
  });

  if (sorted) {
    console.log("Articles are sorted from newest to oldest.");
  } else {
    console.log("Articles are NOT sorted correctly.");
  }

  // Display the count of articles sorted
  console.log(`Total articles sorted: ${articles.length}`);

  // Close the browser
  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
