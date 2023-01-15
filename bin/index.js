#! /usr/bin/env node
const { Command } = require('commander');
const figlet = require("figlet");

// lib 
const { jsonToExcel } = require('../lib/JsonToExcel');


/* Showing Name in terminal */
console.log(figlet.textSync("Json to Excel"));

/* Program begins */
const program = new Command()
program
    .version("1.0.0")
    .description("CLI for converting json to excel and vice versa")
    .option("-j2e, --j2ePath  <value>", "Convert JSON to Excel (a file or directory of multiple json file)")
    .option("-e2j, --e2jPath  <value>", "Convert JSON to Excel (a file or dir of multiple excel file)")

    .parse(process.argv);

const options = program.opts();


/**
 *   Convert a json file to excel
 *   Or Convert all json files inside a directory to excel 
 */

if (options.j2ePath) {
    jsonToExcel(options.j2ePath);
}


