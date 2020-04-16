import md5 from 'md5';

export function hashPassword(password) {
    return(md5(md5(password) + "FyhjUi873jNHhK"));
}