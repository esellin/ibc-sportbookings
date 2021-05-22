
require('dotenv').config();
import { launch } from 'puppeteer';

const sleep = (ms: number) => new Promise(resolve => {
  setTimeout(resolve, ms);
});

(async () => {

  const browser = await launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 600 });

  // Go to login page
  await page.goto('https://sportbookings.ipswich.gov.uk/myipswichfit/en/public');
  await sleep(5000);

  // Accept cookies
  await page.click('button.xn-cta');
  await sleep(5000);

  // Click "Login to your account" button
  await page.click('a#xn-account-login-link');
  await sleep(5000);

  // Fill in login form
  await page.type('input#xn-Username', process.env.USERNAME);
  await page.type('input#xn-Password', process.env.PASSWORD);
  await page.click('button#login.xn-cta');
  await sleep(5000);

  // Click "Make a Booking" button
  await page.click('a#xn-online-booking-link');
  await sleep(5000);

  // Open calendar
  await page.click('li.calendar');
  await sleep(5000);

  // Go to next month if required
  const now = new Date().getTime();
  const currentDay = new Date(now).getDate();
  const targetDay = new Date(now + 86400000 * 7).getDate();
  if (targetDay < currentDay) {
    await page.click('span.next-month');
    await sleep(5000);
  } // end if

  // Click on target day
  const calendarDays = await page.$$('td.calendar-day:not(.disabled)');
  for (const calendarDay of calendarDays) {
    const text = await page.evaluate(calendarDay => calendarDay.innerText, calendarDay);
    if (text == targetDay) {
      await calendarDay.click();
      break;
    }
  } // end for
  await sleep(5000);

  // Quick book
  await page.click('xn-card-component:first-of-type button.xn-cta');
  await sleep(5000);
  await page.click('div#xn-book-now-confirm button.xn-cta');
  await sleep(5000);

  // Close browser
  await browser.close();

})();

