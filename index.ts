
require('dotenv').config();
import { launch } from 'puppeteer';

const sleep = ms => new Promise(resolve => {
  setTimeout(resolve, ms);
});

(async () => {

  const browser = await launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 960 });

  // Go to login page
  await page.goto('https://sportbookings.ipswich.gov.uk/');
  await page.click('input.button#logOn');
  await sleep(2000);

  // Fill in login form
  await page.type('input#UserName', process.env.USERNAME);
  await page.type('input#Password', process.env.PASSWORD);
  await page.click('div.inputForm input[value="Log on"]');

  // Open booking form, select "Fore Street Pool" and submit
  await page.waitForSelector('a.ibc-booking-search-title');
  await page.click('a.ibc-booking-search-title');
  await page.waitForSelector('#SiteID');
  await page.select('#SiteID', '2');
  await page.waitForSelector('div#SearchCriteriaFooter input[value="Search"]');
  await sleep(2000);
  await page.click('div#SearchCriteriaFooter input[value="Search"]');
  await sleep(2000);

  // Click on "Next week >>"
  await page.waitForSelector('ul#SearchDateControl');
  await page.click('ul#SearchDateControl li:last-of-type a');
  await sleep(10000);

  // Click on 2nd available slot
  await page.waitForSelector('table.ActivitySearchResults');
  await sleep(5000);
  const anchors = await page.$$('a.sr_AddToBasket')
  await anchors[1].click();
  await sleep(5000);

  // Accept terms and submit
  await page.waitForSelector('input#CheckoutSubmit');
  await page.click('input[name="TermsAccepted"]');
  await page.click('input#CheckoutSubmit');
  await sleep(5000);

  // Confirm booking
  await page.waitForSelector('p.CheckoutFoCLink');
  await page.click('p.CheckoutFoCLink a');
  await sleep(5000);

  // Close browser
  await browser.close();

})();

