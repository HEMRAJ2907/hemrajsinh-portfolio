const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

// Initialize DB if not exists
if (!fs.existsSync(DB_PATH)) {
    const initialData = {
        visitors: [],
        contacts: [],
        projects: [],
        experiences: []
    };
    // Create directory if it doesn't exist
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
}

// Read DB
const readDb = () => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            return { visitors: [], contacts: [] }; // Fallback
        }
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading DB:', error);
        return { visitors: [], contacts: [] };
    }
};

// Write DB
const writeDb = (data) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing DB:', error);
        return false;
    }
};

module.exports = { readDb, writeDb };
