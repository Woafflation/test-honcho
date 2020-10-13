const fs = require('fs');
const path = require('path');
require('mocha');
const assert = require('chai').assert;

const parseXmlToJson = (xml) => {
    const parsed_items = [];
    for (const res of xml.matchAll(/(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm)) {
        if (!res[1] || res[1] === 'script') {
            continue;
        }

        const key = res[1].toLowerCase();
        let value = res[2];

        const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
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
    const new_arr = [];
    for (let i = 0; i < arr.length + 1; i = i + 2) {
        if (arr[i + 1]) {
            new_arr.push({...arr[i], ...arr[i + 1]});
        }
    }
    return new_arr
}

describe('parse xml', function () {
    it('it should parse xml to json', function (done) {
        const xml_file = fs.readFileSync(path.resolve(__dirname, './CodeTest-XML.xml'), 'utf8');
        const fileExpected = fs.readFileSync(path.resolve(__dirname, './CodeTest-JSON.json'));

        const arr = parseXmlToJson(xml_file)
        const joined_arr = joinArrItems(arr)

        const expected = JSON.parse(fileExpected);
        assert.deepEqual(joined_arr[0], expected[0]);
        done();
    });
});