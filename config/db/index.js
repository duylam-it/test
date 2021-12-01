const mongoose = require('mongoose');

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
async function connect() {
    try {
        await mongoose.connect(process.env.DB_HOST, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
    } catch (err) {
        console.warn('Mongoose Connection ERROR: ' + err.message);
    }
}

module.exports = { connect };
