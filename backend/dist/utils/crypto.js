"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.JWT_SECRET || 'shreeraj_admin_jwt_secret_token_key_1298471984'; // fallback key (32 bytes required for key)
const IV_LENGTH = 16;
const encrypt = (text) => {
    const key = Buffer.from(SECRET_KEY.padEnd(32, '0').substring(0, 32));
    const iv = crypto_1.default.randomBytes(IV_LENGTH);
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};
exports.encrypt = encrypt;
const decrypt = (text) => {
    try {
        const textParts = text.split(':');
        if (textParts.length < 2)
            return text;
        const iv = Buffer.from(textParts.shift() || '', 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const key = Buffer.from(SECRET_KEY.padEnd(32, '0').substring(0, 32));
        const decipher = crypto_1.default.createDecipheriv(ALGORITHM, key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
    catch (error) {
        return text;
    }
};
exports.decrypt = decrypt;
