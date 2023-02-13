const chalk = require('chalk')
const ora = require('ora')
const fs = require('fs')
const path = require("path");
const ExcelJS = require('exceljs');
const { checkDirExistOrCreate, sleep } = require('../utils');
const prompt = require('inquirer').createPromptModule()

/**
 * 
 * @param {ExcelJS.Workbook} workbook 
 * @param {string} outDir 
 */
async function generateJson(workbook, outDir) {

    const option = await getRequiredOption()
    const spinner = ora('Generating Json...').start();
    await sleep(1000)

    await checkDirExistOrCreate(outDir)

    switch (option) {
        case '1':

            workbook.eachSheet(sheet => {
                const res = []
                sheet.eachRow(({ values }) => {
                    res.push({
                        [values[1]]: values.slice(2)
                    })
                })

                fs.writeFileSync(outDir + '/' + sheet.name + '.json', JSON.stringify(res), 'utf-8')

            })

            break;
        case '2':

            workbook.eachSheet(sheet => {
                if (sheet.columns?.length) {
                    const columnA = sheet.columns[0].values

                    sheet.columns.forEach((column, i) => {
                        if (i > 0) {
                            const result = {}
                            const fileName = sheet.name + '.' + column.values[1] + '.json'
                            column.values?.forEach((v, index) => {
                                if (index > 0) {
                                    result[columnA[index]] = v
                                }
                            })
                            fs.writeFileSync(outDir + '/' + fileName, JSON.stringify(result), 'utf-8')
                        }
                    })
                }
            })

            break;
        case '3':

            workbook.eachSheet(sheet => {
                let heading = []
                const result = []
                sheet.eachRow(({ values }, i) => {
                    if (i === 1) heading = values
                    else {
                        let obj = {}
                        values.forEach((v, ind) => {
                            if (ind) {
                                obj[heading[ind]] = v
                            }
                        })
                        result.push(obj)
                    }
                })
                fs.writeFileSync(outDir + '/3-' + sheet.name + '.json', JSON.stringify(result), 'utf-8')
            })

            break;
        default:
            console.log(chalk.red('Invalid option'))
            process.exit()
    }

    spinner.stop()
    console.log(chalk.green('\nJson files are saved to ' + outDir))

}


/**
 * 
 * @param {string} filePath 
 */
async function excelToJson(filePath) {

    const spinner = ora('Analyzing document...').start();
    await sleep(500)
    spinner.stop()

    const fileExt = path.extname(filePath)
    const outDir = path.dirname(fs.realpathSync(filePath)) + '/output'

    if (['.csv', '.xlsx'].includes(fileExt)) {

        try {
            const workbook = new ExcelJS.Workbook()

            if (fileExt === '.csv') await workbook.csv.readFile(filePath)
            else await workbook.xlsx.readFile(filePath)

            showPossibilities()

            generateJson(workbook, outDir)


        } catch (error) {
            console.log(chalk.red("couldn't read the file"))
            console.log(chalk.red(error.message))
        }

    } else {
        throw new Error(chalk.red('supported files are csv and xlsx'))
    }
}



function showPossibilities() {

    console.log(chalk.green('How do you want to generate json file ?'))
    console.log(chalk.blue('Option 1'))
    console.log(chalk.blue('column A as key and other columns are values of array'))
    console.log(chalk.blue('example'))
    console.log(chalk.yellow(`
    [
        { "key" : [ value1, value2, value3 ] },
        { "key2" : [ value1, value2, value3 ] },
    ]`))

    console.log(chalk.blue('Option 2'))
    console.log(chalk.blue('column A as key and other columns deferent file'))
    console.log(chalk.blue('example'))
    console.log(chalk.yellow(`
  col B (file 1)              |      col C (file 2)

[                             |    [
    { "col a" : "col b" }     |        { "col a" : "col c" }
]                             |    ]
    `))

    console.log(chalk.blue('Option 3'))
    console.log(chalk.blue('First row as key and other rows are values'))
    console.log(chalk.blue('example'))
    console.log(chalk.yellow(`
    [
        { "name" : "shahul" , "age" : 28 },
        { "name" : "other name" , "age" : 25 },
    ]
    `))


}


async function getRequiredOption() {

    const req_option = await prompt([{
        message: "select option 1/2/3",
        type: 'input',
        choices: ["1", "2", "3"],
        name: "option",
    }])

    return req_option.option

}




module.exports = {
    excelToJson
}