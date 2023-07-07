require('dotenv').config();

/**
 * port number
 */
const serverPort = process.env.SERVER_PORT || 3000;

/**
 * local mongodb url
 */
const mongodbURL = process.env.DATABASE_LOCAL;

/**
 * user Default image path
 */
const defaultImagePath =
    process.env.DEFAULT_USER_IMAGE_PATH || 'public/images/users/me.jpg';

/**
 * JSON web token activation key
 */
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY;

/**
 * SMTP Server Username and Password
 */
const smtpUserName = process.env.SMPT_SERVER_USERNAME || '';
const smtpPassword = process.env.SMTP_SERVER_PASSWORD || '';

/**
 * Client URL or Client Doamin name
 */
const clientURL = process.env.CLIENT_URL;

module.exports = {
    serverPort,
    mongodbURL,
    defaultImagePath,
    jwtActivationKey,
    smtpUserName,
    smtpPassword,
    clientURL
};
