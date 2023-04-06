module["exports"] = {
    /**
     * @return {string}
     */
    Code: function (id) {
        let now = new Date();
        let year = this.convert_(now.getFullYear().toString().slice(2));
        let month = this.convert(now.getMonth().toString());
        let day = this.convert(now.getDay());
        let code = "SR" + year + month + day;
        let _code = this.zeroPad(this.convert(id), );
        return code + _code;
    },
    convert: function (num) {
        return num
            .toString()    // convert number to string
            .split('',)     // convert string to array of characters
            .map(Number)   // parse characters as numbers
            .map(n => (n || 10) + 64)   // convert to char code, correcting for J
            .map(c => String.fromCharCode(c))   // convert char codes to strings
            .join('');     // join values together
    },
    convert_: function (num) {
        return num
            .toString()    // convert number to string
            .split('_',)     // convert string to array of characters
            .map(Number)   // parse characters as numbers
            .map(n => (n || 10) + 64)   // convert to char code, correcting for J
            .map(c => String.fromCharCode(c))   // convert char codes to strings
            .join('');     // join values together
    },
    zeroPad: function (num, places) {
        return String(num).padEnd(places, '0')
    },
    filter: function (reqData, entries, dictionary) {
        let errorCount = 0;
        let error = {};
        const obj = {};
        for (let [key, value] of reqData) {
            obj[key] = value;
        }
        const data = {};
        const uniqueData = {};
        const mainEntries = entries['main'];
        const optEntries = entries['optional'];
        const uniqueEntries = entries['unique'] ?? [];

        //Main Entries
        for (let entry of mainEntries) {
            if ((typeof (obj[entry]) === "boolean")) obj[entry] = obj[entry].toString();

            if (!obj[entry] || obj[entry] === null || obj[entry] === 'null') {
                error[entry] = (dictionary[entry] ? (dictionary[entry] + " ") : "") + "can not be empty!";
                errorCount++;
            } else {
                if (obj[entry].toString().toLowerCase() === "true") {
                    data[entry] = true;
                } else if (obj[entry].toString().toLowerCase() === "false") {
                    data[entry] = false;
                } else {
                    data[entry] = obj[entry];
                }
            }
        }
        //Optional Entries
        for (let entry of optEntries) {
            if (obj[entry]) {
                if (obj[entry].toString().toLowerCase() === "true") {
                    data[entry] = true;
                } else if (obj[entry].toString().toLowerCase() === "false") {
                    data[entry] = false;
                } else {
                    data[entry] = obj[entry];
                }
            }
        }

        for (let entry of uniqueEntries) {
            if (data[entry]) {
                uniqueData[entry] = data[entry];
            }
        }

        // if (errorCount === 0) {
        //     for (let [key, value] of reqData) {
        //         data[key] = value;
        //     }
        // }

        return {errorCount: errorCount, error: error, data: data, uniqueData: uniqueData};
    },
    JSON_parse: function (data) {
        return JSON.parse(JSON.stringify(data));
    },
    randomString: function (length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    },
    diff_in_minute: function (date) {
        let now = new Date().getTime();
        let appTime = new Date(date).getTime();
        return Math.floor(((now - appTime) / 1000) / 60);
    },
    phone_number_regex: function(phone_num){
        let regex = /\+2519[0-9]{8}/;
        return phone_num.length === 13 && regex.test(phone_num);
    },
    /**
     * @return {string}
     */
    UpperCase: function (s) {
        return s[0].toUpperCase() + s.slice(1);
    }
};