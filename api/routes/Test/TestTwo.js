function getArrayMutations (arr, perms = [], len = arr.length) {
    if (len === 1) perms.push(arr.slice(0));

    for (let i = 0; i < len; i++) {
        getArrayMutations(arr, perms, len - 1);

        len % 2 // parity dependent adjacent elements swap
            ? [arr[0], arr[len - 1]] = [arr[len - 1], arr[0]]
            : [arr[i], arr[len - 1]] = [arr[len - 1], arr[i]]
    }

    return perms
}

const arrayToMutate = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const startTime = performance.now();
const arrayOfMutations = getArrayMutations(arrayToMutate, []);
const stopTime = performance.now();
const duration = (stopTime - startTime) / 1000;


//console.log(`${arrayOfMutations.length.toLocaleString('en-US')} permutations found in ${duration.toLocaleString('en-US')}s`);

function phone_number_regex(phone_num){
    let regex = /\+2519[0-9]{8}/;
    return phone_num.length === 13 && regex.test(phone_num);
}

console.log(phone_number_regex("+251930538714"));