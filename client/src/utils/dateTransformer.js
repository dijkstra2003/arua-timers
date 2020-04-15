export function invertDate(date) {
    date = date
        .split('-');

    date.forEach((element, index) => {
        if(element.length === 1) {
            date[index] = '0' + element
        }            
    });

    date = date
        .reverse()
        .join('-');

    return date;
}