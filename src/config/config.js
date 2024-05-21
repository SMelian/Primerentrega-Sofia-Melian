require('dotenv').config({ path: "../src/config/.env" });




const config = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    sessionSecret: process.env.SESSION_SECRET
};

console.log("Environment Variables:");
console.log("PORT:", config.port);
console.log("MONGO_URL:", config.mongoUrl);
console.log("ADMIN_NAME:", config.adminName);
console.log("ADMIN_PASSWORD:", config.adminPassword);

module.exports = config;
