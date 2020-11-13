const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const args = processArgs(process.argv);
// magie, variable globale définie par node qui contient le répertoire de ou le script est lancé
// il existe aussi __filename;
const basePath = __dirname;
// path.join va te construire un chemin en fonction de l'OS sur lequel tu es
const messagePath = path.join(basePath, 'messages');

(async () => {
    const dir = await fs.promises.opendir(messagePath);
    const browser = await puppeteer.launch();
    if (!args.save) {
        for await (const dirent of dir) {
            if (dirent.name !== 'template.json') {
                // pas besoin d'ouvrir le fichier pour connaitre son nom :p
                const content = await fs.promises.readFile(path.join(messagePath, dirent.name)).toString();
                // tu peux (normalement) remplacer par 'const obj = require(path.join(messagePath, dirent.name))';
                // ça ne fait pas exactement la même chose mais dans ton cas, ça fonctionnera
                let obj = JSON.parse(content);
                const page = await browser.newPage();
                await page.goto('https://discordembed.piotezaza.fr/');
                await page.waitForSelector('#message')
                await Promise.all(Object.entries(obj).map(async ([key, val]) => {
                    await page.$eval(`#${key}`, (input, value) => input.value = value, val);
                }));
                if (obj.send === true) {
                    await page.click('send');
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