import crypto from "crypto";
export function ssh224(username, password) {
    const hash = crypto.createHash('sha224');
    const data = hash.update(`${username}:${password}`, 'utf-8');
    const gen_hash = data.digest('hex');
    return gen_hash;
}