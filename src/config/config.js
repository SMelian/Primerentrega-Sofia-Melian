require('dotenv').config();

module.exports = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
};





// import dotenv from 'dotenv';

// dotenv.config();

// export default {
//     port: process.env.PORT,
//     mongoUrl:process.env.MONGO_URL,
//     adminName: process.env.ADMIN_NAME,
//     adminPassword: process.env.ADMIN_PASSWORD,
// }