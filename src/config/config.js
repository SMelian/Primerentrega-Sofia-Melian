require('dotenv').config({ path: "../src/config/.env" });


const config = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    sessionSecret: process.env.SESSION_SECRET,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
};


module.exports = config;
