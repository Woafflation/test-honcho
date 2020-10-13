const fs = require('fs')

const XML_REGEX = /(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm;
const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

const parseStreamService = (file_path, parseResultHandler) => {
    const parseXmlToJson = (xml) => {
        const parsed_items = [];

        for (const res of xml.matchAll(XML_REGEX)) {
            const resKey = res[1];

            if (!resKey || resKey === 'script') {
                continue;
            }
            const key = resKey.toLowerCase();
            let value = res[2];

            while (SCRIPT_REGEX.test(value)) {
                value = value.replace(SCRIPT_REGEX, '');
            }

            parsed_items.push({
                [key]: value,
            })

        }
        return parsed_items;
    }

    const joinArrItems = (arr) => {
        const joined_arr = [];

        for (let i = 0; i < arr.length + 1; i = i + 2) {
            if (arr[i + 1]) {
                joined_arr.push({...arr[i], ...arr[i + 1]});
            }
        }

        return joined_arr;
    }

    fs.readFile(file_path, 'utf8', (err, data) => {
        if (err) {
            return parseResultHandler(err, null);
        }

        const arr = parseXmlToJson(data);
        const joined_arr = joinArrItems(arr);

        return parseResultHandler(undefined, joined_arr);
    });
}

module.exports = {
    parseStreamService,
};