/**
 * @return {number}
 */
function AccountNumber(id) {
    let num = 2432;
    num = (num + id);
    num = parseInt((num / 5000).toString(), 10);
    return zeroPad(((num) + (id === 0 ? num : ((num * id) + id))), 10);
}

const zeroPad = (num, places) => String(num).padEnd(places, '0');

function shortCode(id) {
    let now = new Date();
    let year = convert_(now.getFullYear().toString().slice(2));
    let month = convert(now.getMonth().toString());
    let day = convert(now.getDay());
    let code = "TP" + year + month + day;
    let time = now.getTime().toString();
    // console.log(time.length);
    time = time.substring(time.length - 4, time.length - 1);
    // console.log("H: =======> " + time);
    let _code = zeroPad(convert(id), 4);
    // console.log(_code);
    return code + _code;
}

function convert(num) {
    return num
        .toString()    // convert number to string
        .split('',)     // convert string to array of characters
        .map(Number)   // parse characters as numbers
        .map(n => (n || 10) + 64)   // convert to char code, correcting for J
        .map(c => String.fromCharCode(c))   // convert char codes to strings
        .join('');     // join values together
}

function convert_(num) {
    return num
        .toString()    // convert number to string
        .split('_',)     // convert string to array of characters
        .map(Number)   // parse characters as numbers
        .map(n => (n || 10) + 64)   // convert to char code, correcting for J
        .map(c => String.fromCharCode(c))   // convert char codes to strings
        .join('');     // join values together
}
let codes = [];


for (let n = 1; n < 10000; n++) {
    console.log(code);
    if(!codes.includes(code)){
        codes.push(code);
    }
    else console.log("code: " + code + " "  + n + " Exists!");

}



// console.log(convert(360));
// console.log(convert(230));
