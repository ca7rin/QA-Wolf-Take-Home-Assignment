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
        return;
    }

    const articles = [];
    const startTime = Date.now();

    while (articles.length < 100) {
    const pageArticles = await page.$$eval('.athing', rows => {
        return rows.map(row => {
            // Extract the title
            const titleElement = row.querySelector('.titleline a');
            const title = titleElement ? titleElement.innerText : '';
            const id = row.id;
            const timeElement = row.nextElementSibling.querySelector('.age');
            const time = timeElement ? timeElement.innerText : '';
            const timestamp = timeElement ? timeElement.getAttribute('title') : '';

            // Return article only if it has valid data
            return (title && id && timestamp) ? { title, id, time, timestamp } : null;
        }).filter(article => article !== null); // Filter out invalid articles
    });

    if (pageArticles.length === 0) {
        console.warn("No articles found.");
        break;
    }

    for (const article of pageArticles) {
        if (articles.length < 100) {
        articles.push(article);
        } else {
            break;
        }
    }

    // Check if there's a "next" link and navigate to the next page if needed
    const nextPageLink = await page.$('a[rel="next"]');
    if (nextPageLink && articles.length < 100) {
        await Promise.all([
        nextPageLink.click(),
        page.waitForNavigation({ waitUntil: 'networkidle' }),
    ]);
        await page.waitForSelector('.athing');
    } else {
        break;
    }
    }

    let allArticlesValid = true;

  articles.forEach(article => {
    const isValid = article.title && article.timestamp && article.id;
    if (!isValid) {
      console.warn(`❌ Invalid article: ${JSON.stringify(article)}`);
      allArticlesValid = false;
    }
  });

    const sorted = articles.every((article, i, arr) => {
        if (i === 0) return true; // First article, no comparison
        return new Date(article.timestamp) <= new Date(arr[i - 1].timestamp); // Articles should be sorted in descending order
    });

    console.log("\n=== Scraping Results ===");
    console.log(`✅ Successfully collected ${articles.length} articles.`);

    if (articles.length === 100) {
    console.log("✅ Successfully collected 100 valid articles.");
    } else {
    console.warn(`Only ${articles.length} valid articles were collected. Please check the website or scraping logic.`);
    }

    if (allArticlesValid) {
    console.log("✅ All articles are valid.");
  } else {
    console.warn("❌ Some articles are invalid.");
  }

  if (sorted) {
    console.log("✅ Articles are sorted from newest to oldest.");
  } else {
    console.warn("❌ Articles are NOT sorted correctly.");
  }

  const endTime = Date.now();
  console.log(`️ Scraping completed in ${endTime - startTime} milliseconds`);
  console.log("=========================\n");

    // Ensure we have exactly 100 articles collected
//    if (articles.length === 100) {
//    console.log("Successfully collected 100 valid articles.");
//    } else {
//    console.warn(`Only ${articles.length} valid articles were collected. Please check the website or scraping logic.`);
//    }
//
//    if (allValid) {
//        console.log("All articles are valid.");
//    } else {
//        console.warn("Only ${articles.length} valid articles were collected.");
//    }
//    if (sorted) {
//        console.log("Articles are sorted from newest to oldest.");
//    } else {
//        console.log("Articles are NOT sorted correctly.");
//    }
//
//
//    const endTime = Date.now();
//    console.log(`Scraping completed in ${endTime - startTime} milliseconds`);
    // Close the browser
    await browser.close();
}

(async () => {
    await sortHackerNewsArticles();
})();
