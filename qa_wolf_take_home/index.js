// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto("https://news.ycombinator.com/newest");
  } catch (error) {
    console.error("Failed to load page:", error);
    await browser.close();
    return; // Exit the function in case of an error
  }

  const articles = [];
  const startTime = Date.now();

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

    if (pageArticles.length === 0) {
      console.log("No articles found.");
      break;
    }

    // Append articles up to 100
    for (const article of pageArticles) {
        if (!article.title) {
            console.warn("Found an article without a title:", article);
            continue;
        }
        if (isNaN(new Date(timestamp))) {
            console.warn("Invalid timestamp for article:", title);
            continue; // Skip invalid entries
        }

        articles.push(article);
        if (articles.length >= 100) break;
    }

    // Check if we need to go to the next page
    const nextPageLink = await page.$('a[rel="next"]');
    if (nextPageLink && articles.length < 100) {
      await Promise.all([
        nextPageLink.click(),
        page.waitForNavigation({ waitUntil: 'networkidle' }),
      ]);
      await page.waitForTimeout(2000); // Wait between requests
    } else {
      break; // No more pages or we have enough articles
    }
  }

  // Sort articles based on timestamp (newest first)
//  articles.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

//  console.log("Sorted articles based on time:", articles);

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
  console.log(`Total articles sorted: ${articles.length} (requested: 100)`);

    const endTime = Date.now();
  console.log(`Scraping completed in ${endTime - startTime} milliseconds`);
  // Close the browser
  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
