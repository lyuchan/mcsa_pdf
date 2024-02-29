const fs = require('fs');
const { PDFDocument, rgb, degrees } = require('pdf-lib');
async function addWatermark(inputFile, watermarkFile, outputFile) {
    const existingPdfBytes = fs.readFileSync(inputFile);
    const watermarkImageBytes = fs.readFileSync(watermarkFile);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const watermarkImage = await pdfDoc.embedPng(watermarkImageBytes);
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
    for (let i = 2; i < pages.length; i += 2) {
        const page = pages[i];
        const page1 = pages[i - 1];
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
addWatermark('Meow.pdf', 'test.png', './output/output.pdf');
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}