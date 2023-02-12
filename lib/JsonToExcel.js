const fs = require('fs')
const path = require("path");
const { readJSON } = require("../utils");
const ExcelJS = require('exceljs');
const chalk = require('chalk')


/**
 * 
 * @param {any} workbook 
 * @param {any} JsonContent 
 * @param {string} sheetName 
 */
function addDataToExcelSheet(workbook, JsonContent, sheetName = 'Sheet 1') {

    const worksheet = workbook.addWorksheet(sheetName)

    Object.entries(JsonContent).forEach(([key, value]) => {

        const row = [key]
        // if sub value is an another object
        if (
            typeof value === 'object' &&
            !Array.isArray(value) &&
            value !== null
        ) {
            Object.entries(value).forEach(([key_2, value_2]) => {
                row.push(value_2)
            })
        }
        else {
            row.push(value.toString())
        }
        worksheet.addRow(row)
    })
}


/**
 * 
 * @param {string} filePath 
 */
async function jsonToExcel(filePath) {
    const fileExt = path.extname(filePath)
    const outDir = path.dirname(fs.realpathSync(filePath))

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'xx';
    workbook.lastModifiedBy = 'xx';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();

    /* single file */
    if (fileExt) {

        if (fileExt != '.json') throw Error(chalk.red('Please provide a json file'))

        const JsonContent = await readJSON(filePath)

        addDataToExcelSheet(workbook, JsonContent)

        workbook.xlsx.writeFile(path.join(outDir, 'out.xlsx'))

    }

    /* Directory of files */
    else {

        let files = await fs.promises.readdir(filePath)
        files = files.filter(file => path.extname(file) === '.json');

        if (files.length) {
            files.forEach(async (file, i) => {

                const f_name = file.split('.')[0]

                const jsonContent = await readJSON(path.resolve(filePath, file))

                addDataToExcelSheet(workbook, jsonContent, f_name)

                // saving the work book on the last file 
                if (i === files.length - 1) {
                    workbook.xlsx.writeFile(path.join(outDir, 'out.xlsx'))
                }
            })
        } else {
            console.error(chalk.red('Folder is empty!'))
            process.exit(1)
        }
    }

}


module.exports = {
    jsonToExcel
}