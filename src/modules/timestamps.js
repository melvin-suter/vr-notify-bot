import * as fs from 'fs';

export const getTimestamps = (format) => {
    let lastVideoTimestamps = {};

    // Load previous timestamps from a file
    if (fs.existsSync(`timestamps/${format}.json`)) {
        lastVideoTimestamps = JSON.parse(fs.readFileSync(`timestamps/${format}.json`, 'utf-8'));
    }

    return lastVideoTimestamps;
};

export const setTimestamps = (format,timestamps) => {
    fs.writeFileSync(`timestamps/${format}.json`, JSON.stringify(timestamps));
};