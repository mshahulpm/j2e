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



module.exports = {
    listDirContents,
    readJSON
}