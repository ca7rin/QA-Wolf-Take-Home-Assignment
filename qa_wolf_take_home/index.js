// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  // Get the first 100 articles
  const articles = await page.$$eval('.athing', rows => {
    return rows.slice(0, 40).map(row => {
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
