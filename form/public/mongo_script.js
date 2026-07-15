const { MongoClient } = require('mongodb');

async function main() {
    const uri = 'mongodb+srv://chcare18:chcare18@communityhealthcare.gsoni.mongodb.net/';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        await client.close();
    }
}

main();
