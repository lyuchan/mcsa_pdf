const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, degrees } = require('pdf-lib');
async function addWatermark(inputFile, outputFile) {
    const existingPdfBytes = fs.readFileSync(inputFile);
    //const watermarkImageBytes = fs.readFileSync(watermarkFile);
    const watermarkFiles = fs.readdirSync('./png_in').map(file => path.join('./png_in', file));
    const watermarkImageBytes = watermarkFiles.map(file => fs.readFileSync(file));
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    let watermarkImages = []
    for (let i = 0; i < watermarkImageBytes.length; i++) {
        watermarkImages.push(await pdfDoc.embedPng(watermarkImageBytes[i]));
    }
    let watermarkImage = watermarkImages[getRandomArbitrary(0, watermarkImages.length - 1)]
    const pages = pdfDoc.getPages();
    const pngsize = 6//越大越小
    const xrmax = -40;
    const xrmin = -30;
    const yrmax = 200;
    const yrmin = 400;
    const dgmax = 5;
    const dgmin = -5;
    for (let i = 1; i < pages.length; i += 2) {
        const page = pages[i];
        const page1 = pages[i - 1];

        let xr = getRandomArbitrary(xrmin, xrmax)
        let yr = getRandomArbitrary(yrmin, yrmax)
        let dg = getRandomArbitrary(dgmin, dgmax)
        watermarkImage = watermarkImages[getRandomArbitrary(0, watermarkImages.length - 1)]
        const watermarkDim = watermarkImage.scale(1);
        page.drawImage(watermarkImage, {
            x: xr,
            y: yr,
            width: watermarkDim.width / pngsize,
            height: watermarkDim.height / pngsize,
            rotate: degrees(dg),
        });
        page1.drawImage(watermarkImage, {
            x: xr + 597,
            y: yr,
            width: watermarkDim.width / pngsize,
            height: watermarkDim.height / pngsize,
            rotate: degrees(dg),
        });
    }
    for (let i = 2; i < pages.length; i += 2) {
        const page = pages[i];
        const page1 = pages[i - 1];
        watermarkImage = watermarkImages[getRandomArbitrary(0, watermarkImages.length - 1)]
        const watermarkDim = watermarkImage.scale(1);
        let xr = getRandomArbitrary(xrmin, xrmax)
        let yr = getRandomArbitrary(yrmin, yrmax)
        let dg = getRandomArbitrary(dgmin, dgmax)
        page.drawImage(watermarkImage, {
            x: xr,
            y: yr,
            width: watermarkDim.width / pngsize,
            height: watermarkDim.height / pngsize,
            rotate: degrees(dg),
        });
        page1.drawImage(watermarkImage, {
            x: xr + 597,
            y: yr,
            width: watermarkDim.width / pngsize,
            height: watermarkDim.height / pngsize,
            rotate: degrees(dg),
        });
    }
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputFile, pdfBytes);
}
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

if (!fs.existsSync('./output')) {
    fs.mkdirSync('./output');
}
if (!fs.existsSync('./pdf_in')) {
    fs.mkdirSync('./pdf_in');
}
if (!fs.existsSync('./png_in')) {
    fs.mkdirSync('./png_in');
}
fs.readdir('./pdf_in', (err, files) => {
    if (err) {
        throw err;
    }
    files.forEach(file => {
        addWatermark(`./pdf_in/${file}`, `./output/${file}`);
    });
});