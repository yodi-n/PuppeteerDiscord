const puppeteer = require('puppeteer');
const fs = require('fs');

const args = processArgs(process.argv);

(async () => {
    const dir = await fs.promises.opendir('./messages');
    const browser = await puppeteer.launch();
    if (!args.save) {
        for await (const dirent of dir) {
            const content = fs.readFileSync(`./messages/${dirent.name}`).toString();
            if (dirent.name != 'template.json') {
                let obj = JSON.parse(content);
                const page = await browser.newPage();
                await page.goto('https://discordembed.piotezaza.fr/');
                await page.waitForSelector('#message')
                await Promise.all(Object.entries(obj).map(async ([key, val]) => {
                    await page.$eval(`#${key}`, (input, value) => input.value = value, val);
                }));
                if (obj.send == true) {
                    await page.evaluate(() => {
                        document.querySelector('#send').click();
                    });
                }
            }
        }
    } else {
        // const page = await browser.newPage();
        // await page.goto('https://discordembed.piotezaza.fr/');
        // await page.waitForSelector('#message')
        // console.log(await page.$eval(`#embed_color`, input => input.value));
        console.log('save');
    }

    await browser.close();
})();

function processArgs(argsArray) {
    const [, , ...commandArgs] = argsArray;
    return commandArgs.reduce((res, arg) => {
        const [key, value] = arg.split('=')
        return {
            ...res,
            [key.replace(/-/g, '')]: value
        };
    }, {});
}