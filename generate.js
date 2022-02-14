
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const args = process.argv.slice(2);

console.log(args)

function hello() {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'Mr X';
    workbook.lastModifiedBy = 'Mr Y';
    workbook.created = new Date(2021, 8, 30);
    workbook.modified = new Date();
    workbook.lastPrinted = new Date(2021, 7, 27);


    const data = require(path.join(__dirname, 'demo/d.json'));

    const sheet = workbook.addWorksheet('Sheet 1');
    sheet.columns = [
        { header: 'Name', key: 'name', width: 30 },
        { header: 'En', key: 'en', width: 30 },
    ]

    Object.keys(data).sort().forEach(key => {
        sheet.addRow({
            name: key,
            en: data[key]
        });
    })



    workbook.xlsx.writeFile(path.join(__dirname, 'd.xlsx'))


}

// hello();

