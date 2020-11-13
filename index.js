const puppeteer = require('puppeteer');

const args = processArgs(process.argv);

(async () => {
    // const browser = await puppeteer.launch();
     const browser = await puppeteer.launch({
         headless: false
     });
    const page = await browser.newPage();
    await page.goto('https://discordembed.piotezaza.fr/');
    await page.waitForSelector('#message')
    await page.$eval('#message', (input, value) => input.value = value, args.message || 'Message');
    await page.$eval('#embed_titre', (input, value) => input.value = value, args.titre || 'Titre');
    await page.$eval('#embed_message', (input, value) => input.value = value, args.eMessage || 'EMessage');
    await page.$eval('#embed_color', (input, value) => input.value = '#' + value, args.color || '6EB8CC');
    await page.screenshot({path: 'hello.png'});

    await browser.close();
})();

function processArgs(argsArray) {
    const [, , ...commandArgs] = argsArray;
    return commandArgs.reduce((res, arg) => {
        const [key, value] = arg.split('=')
        return {...res, [key.replace(/-/g, '')]: value};
    }, {});
}