const readline = require('readline');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const args = process.argv.slice(2)[0];

createXl(args);

function exitProcess(no) {
    console.log('Exiting...' + no);
    // rl.close();
    process.exit();
}

// console.log('Enter JSON file path or directory path: ');

function createXl(line) {
    line = line.trim();

    if (line === 'exit') return exitProcess(1);

    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'Mr X';
    workbook.lastModifiedBy = 'Mr Y';
    workbook.created = new Date(2021, 8, 30);
    workbook.modified = new Date();
    workbook.lastPrinted = new Date(2021, 7, 27);

    if (line.includes('.json')) {
        let filePath = line;

        try {
            const data = require(path.join(__dirname, filePath));

            const worksheet = workbook.addWorksheet('Sheet 1');

            worksheet.columns = [
                { header: 'Name', key: 'name', width: 30 },
                { header: 'En', key: 'en', width: 30 },
            ]

            Object.keys(data).sort().forEach(key => {
                worksheet.addRow({
                    name: key,
                    en: data[key]
                });
            })

            workbook.xlsx.writeFile(path.join(__dirname, 'output2.xlsx'))
            console.log('Output file saved to: ', path.join(__dirname, 'output2.xlsx'));
            exitProcess(2)
        } catch (error) {
            console.log('Invalid JSON File')
        }

    } else {
        let dirPath = line;

        try {
            const files = fs.readdirSync(path.join(__dirname, dirPath));
            files.forEach(file => {
                const [name, ext] = file.split('.');
                if (ext === 'json') {

                    try {
                        let filePath = path.join(dirPath, file);
                        const data = require(path.join(__dirname, filePath));

                        const worksheet = workbook.addWorksheet(name);
                        worksheet.columns = [
                            { header: 'Name', key: 'name', width: 30 },
                            { header: 'En', key: 'en', width: 30 },
                        ]

                        Object.keys(data).sort().forEach(key => {
                            worksheet.addRow({
                                name: key,
                                en: data[key].toString()
                            });
                        })
                    } catch (error) {
                        console.log('Invalid JSON File: ', file + '.json');
                    }
                }
            })
            workbook.xlsx.writeFile(path.join(__dirname, 'output2.xlsx'))
            console.log('Output file saved to: ', path.join(__dirname, 'output2.xlsx'));
            exitProcess(3)

        } catch (error) {
            console.log('enter valid path or enter "exit" to exit');
        }
    }

}

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

    workbook.xlsx.writeFile(path.join(__dirname, 'output2.xlsx'))


}