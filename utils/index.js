const fs = require("fs");
const path = require("path");

async function listDirContents(filepath) {
    try {
        // add the following
        const files = await fs.promises.readdir(filepath);
        const detailedFilesPromises = files.map(async (file) => {
            let fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
            const { size, birthtime } = fileDetails;
            return { filename: file, "size(KB)": size, created_at: birthtime };
        });
        // add the following
        const detailedFiles = await Promise.all(detailedFilesPromises);
        console.table(detailedFiles);
    } catch (error) {
        console.error("Error occurred while reading the directory!", error);
    }
}

async function readJSON(file_path) {

    return new Promise((resolve) => {
        fs.readFile(file_path, 'utf-8', (err, data) => {
            if (err) throw (err)
            return resolve(JSON.parse(data))
        })
    })
}

async function checkDirExistOrCreate(dir) {
    return new Promise((resolve, reject) => {
        fs.access(dir, (err) => {
            if (err) {
                fs.mkdirSync(dir)
                resolve()
            } else {
                resolve()
            }
        })
    })
}

/**
 * 
 * @param {number} time 
 */
async function sleep(time) {

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(1)
        }, time)
    })

}

module.exports = {
    listDirContents,
    readJSON,
    checkDirExistOrCreate,
    sleep
}