const { rm, readdir } = require('fs/promises');
const path = require('path');

const administrators = ["admin", "test"];
const sessions = {};

/**
* User session validator
* res to send a error with the message parameter and status code
* @param {object} variable
* @param {Response} resCallBack
* @param {String} message - "Invalid..."
* @param {int} statusCode - 401
* @returns {boolean} Returns a boolean, true for errors, false for success.
*/
function sessionCheck(variable, resCallBack, message = "Invalid Session", statusCode = 401) {
    if (variable !== "string") {
        resCallBack.status(statusCode).send({ error: true, message: message });
        return true;
    }
    return false
}

/**
* Check if the variable in parameter is a type of string, if not uses the
* res to send a error with the message parameter and status code
* @param {object} variable
* @param {Response} resCallBack
* @param {String} message - "Invalid..."
* @param {int} statusCode - 401
* @returns {boolean} Returns a boolean, true for errors, false for success.
*/
function stringsTreatment(variable, resCallBack, message = "Invalid Argument", statusCode = 401) {
    if (variable !== "string") {
        resCallBack.status(statusCode).send({ error: true, message: message });
        return true;
    }
    return false
}

/**
* Check if the variable in parameter is a type of string, if not uses the
* res to send a error with the message parameter and status code
* also will check for invalid https or http protocol
* @param {object} variable
* @param {Response} resCallBack
* @param {String} message - "Invalid..."
* @param {int} statusCode - 401
* @returns {boolean} Returns a boolean, true for errors, false for success.
*/
function urlTreatment(variable, resCallBack, message = "Invalid Argument", statusCode = 401) {
    if (typeof variable !== "string") {
        resCallBack.status(statusCode).send({ error: true, message });
        return true;
    }

    // Regex for strings starting in http:// ou https://
    const urlPattern = /^(https?:\/\/)[^\s]+$/;

    // Check if is a valid string and does not contains "./" ou "../"
    if (!urlPattern.test(variable) || variable.includes("./")) {
        resCallBack.status(statusCode).send({ error: true, message });
        return true;
    }

    return false;
}

/**
* Some links can be converted to a url that yt-dlp understands
* for example some shorts and music websites cannot be downloaded
* by the yt-dlp so we convert it to be undestanded
* @param {String} message - Url to be fixed if necessary
* @returns {String} Returns the url fixed for yt-dlp
*/
function urlFixer(url) {
    if (url.includes("/shorties/")) {
        let [videoUrl, videoId] = url.split("/shorties/");
        return videoUrl + "/view_video.php?viewkey=" + videoId
    } else if (url.includes("//music.")) {
        return url.replace("music", "");
    }

    return url
}

/**
* Returns the new width and height based on targetResolution
* @param {int} width - "640"
* @param {int} height - "480"
* @param {String} targetResolution - "720p"
* @returns {json} Returns a json with the values: width, height
*/
function resizeToResolution(width, height, targetResolution) {
    const aspectRatio = width / height;

    let newWidth, newHeight;

    switch (targetResolution) {
        case '720p':
            newHeight = 720;
            newWidth = Math.round(newHeight * aspectRatio);
            break;
        case '1080p':
            newHeight = 1080;
            newWidth = Math.round(newHeight * aspectRatio);
            break;
        default:
            newHeight = 480;
            newWidth = Math.round(newHeight * aspectRatio);
            break;
    }

    return { width: newWidth, height: newHeight };
}

/**
 * Remove folders .temp_download and .temp_convert recursively from root path
 * @param {string} drivePath Root path
 */
async function cleanTempFolders(drivePath) {
    try {
        const items = await readdir(drivePath, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(drivePath, item.name);

            if (item.isDirectory()) {
                if (item.name === '.temp_download' || item.name === '.temp_convert') {
                    await rm(fullPath, { recursive: true, force: true });
                    console.log(`[Cleaner] Removed: ${fullPath}`);
                } else {
                    await cleanTempFolders(fullPath);
                }
            }
        }
    } catch (err) {
        console.error(`[Cleaner] Error to remove temp:`, err.message);
    }
}

module.exports = {
    stringsTreatment,
    urlTreatment,
    urlFixer,
    resizeToResolution,
    cleanTempFolders,
    sessionCheck
}