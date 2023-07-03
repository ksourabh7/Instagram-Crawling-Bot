const puppeteer = require("puppeteer");
const KnownDevices = require("puppeteer").KnownDevices;
const iphone = KnownDevices["iPhone 11"];

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function sigmoid(t) {
  return 1 / (1 + Math.exp(-t));
}

const scrapeInfiniteScrollItems = async (page) => {
  while (true) {
    const previousHeight = await page.evaluate("document.body.scrollHeight");

    var startX = randomIntFromInterval(150, 200);
    var startY = page.viewport().height - randomIntFromInterval(150, 230);
    var endX = page.viewport().width - randomIntFromInterval(20, 60);
    var endY = randomIntFromInterval(30, 90);
    page.evaluate(() => {
      document.addEventListener("mousemove", logKey);

      function logKey(e) {
        console.log(`Screen X/Y: ${e.screenX}, ${e.screenY}
              Client X/Y: ${e.clientX}, ${e.clientY}`);
      }
    });

    const distanceX = endX - startX;
    const distanceY = startY - endY;
    const numSteps = 10; // Adjust the number of steps as per your requirement

    console.log(endY);

    // Perform the sliding action
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    const ymove = distanceY / numSteps;

    let str = "[";
    let pointY = startY;
    for (let i = -5; i < 0; i += 0.5) {
      const pointX = startX + distanceX * sigmoid(i);

      pointY -= ymove;
      str += `(${pointX.toFixed(2)},${pointY.toFixed(2)}),`;
      // console.log(pointX, pointY);
      await page.mouse.move(pointX.toFixed(2), pointY.toFixed(2));
    }
    str += "]";
    console.log(str);

    await page.mouse.move(endX, endY);
    await page.mouse.up();

    await page.waitForFunction(
      `document.body.scrollHeight >= ${previousHeight}`
    );

    // Adding url in txt file
    fs.appendFile("reel-url.txt", page.url() + "\n", (err) => {
      if (err) throw err;
    });

    await new Promise((resolve) =>
      setTimeout(resolve, randomIntFromInterval(3500, 7500))
    );
  }
};

(async () => {
  const browser = await puppeteer.launch({
    args: [
      "--proxy-server =http://user-sp4teivrg9-country-in-city-mumbai-sessionduration-30:dg9dHI1bkcXpkhmK05@gate.smartproxy.com:10000",
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
    headless: false,
    dumpio: true,
  });

  const page = await browser.newPage();
  await page.emulate(iphone);
  await page.goto("https://instagram.com");

  await new Promise((resolve) =>
    setTimeout(resolve, randomIntFromInterval(3500, 7500))
  );

  await page.evaluate(() => {
    const bElements = document.getElementsByTagName("button");
    bElements[1].click();
  });

  await new Promise((resolve) =>
    setTimeout(resolve, randomIntFromInterval(3500, 7500))
  );

  // Login

  let id = "your_id";
  let pass = "your_password";

  let inputs = await page.$$("input");

  let idSel = "#loginForm > div > div:nth-child(3) > div > label > input";
  let passSel = "#loginForm > div > div:nth-child(4) > div > label > input";

  const boundingBoxId = await inputs[0].boundingBox();
  const boundingBoxPass = await inputs[1].boundingBox();

  console.log(boundingBoxId);

  // const mouse = page.evaluate(() => {
  //   document.addEventListener("mousemove", logKey);

  //   function logKey(e) {
  //     console.log(`Screen X/Y: ${e.screenX}, ${e.screenY}
  //         Client X/Y: ${e.clientX}, ${e.clientY}`);
  //   }
  // });
  page.mouse.click(
    boundingBoxId.x + (boundingBoxId.width / 2 + randomIntFromInterval(5, 10)),
    boundingBoxId.y + (boundingBoxId.height / 2 + randomIntFromInterval(5, 7))
  );

  await new Promise((resolve) =>
    setTimeout(resolve, randomIntFromInterval(1500, 3500))
  );

  console.log(id, pass);

  await page.type(idSel, id, { delay: randomIntFromInterval(50, 100) });

  await new Promise((resolve) =>
    setTimeout(resolve, randomIntFromInterval(1500, 3500))
  );

  page.mouse.click(
    boundingBoxPass.x +
      (boundingBoxPass.width / 2 + randomIntFromInterval(5, 10)),
    boundingBoxPass.y +
      (boundingBoxPass.height / 2 + randomIntFromInterval(5, 7))
  );

  await new Promise((resolve) =>
    setTimeout(resolve, randomIntFromInterval(1500, 3500))
  );

  await page.type(passSel, pass, { delay: randomIntFromInterval(50, 100) });

  await new Promise((resolve) =>
    setTimeout(resolve, randomIntFromInterval(1500, 3500))
  );

  let loginSel = "#loginForm > div > div:nth-child(6)";

  await page.click(loginSel);

  await page.waitForNavigation();

  await page.click("button");

  await page.waitForNavigation();

  await new Promise((resolve) =>
    setTimeout(resolve, randomIntFromInterval(3500, 7500))
  );

  const buttons = await page.$$("button");

  const lastButton = buttons[buttons.length - 1];

  console.log(lastButton);
  await lastButton.click();

  await new Promise((resolve) =>
    setTimeout(resolve, randomIntFromInterval(3500, 7500))
  );

  // GoToReels

  await page.goto("https://instagram.com/reels/");

  await page.waitForNavigation();

  await new Promise((resolve) =>
    setTimeout(resolve, randomIntFromInterval(2500, 6500))
  );

  // Scroll

  await scrapeInfiniteScrollItems(page);

  // fs.writeFileSync("items.json", JSON.stringify(items));
})();
