export function PUBLIC_URL(path) {
    if (path.indexOf('http') !== -1) {
        path = path.substring(0)
        return path;
    }
    if (path.startsWith('/'))
        path = path.substring(1);
    if (path.endsWith('/'))
        path = path.substring(0, path.length - 1);
    return process.env.PUBLIC_URL + '/' + path;
}
export function BG_URL(path) {
    return `url(` + path + ')';
}
export function isJsonString(str) {
    if (str === undefined || typeof (str) !== 'string')
        return false;
    var check = (str.indexOf("{") !== -1 && str.indexOf("}") !== -1) || (str.indexOf("[") !== -1 && str.indexOf("]") !== -1);
    if (!check)
        return false;
    try {
        JSON.parse(str);
        return true;
    }
    catch (e) {
        return false;
    }
}
export function handleJsonFieldsWith(obj, fields) {
    for (var i = 0; i < fields.length; i++) {
        // console.log(fields[i]);
        console.log(obj[fields[i]]);
        if (isJsonString(obj[fields[i]]))
            obj[fields[i]] = JSON.parse(obj[fields[i]]);
    }
    return obj;
}
export function isEmptyString(str) {
    return (str === undefined || str == null || str === '' || str === '?');
}

export const makeCancelable = (promise) => {
    let hasCanceled_ = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            val => hasCanceled_ ? reject({ isCanceled: true }) : resolve(val),
            error => hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
        );
    });

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
    };
};
export function findInArray(arr, query = ['key', 'value'], all = false) {
    var result = all ? [] : undefined;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][query[0]] === query[1]) {
            if (all)
                result.push(arr[i]);
            else
                return arr[i];
        }
    }
    return result;
}
export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}