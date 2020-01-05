const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost/issuetracker', { useUnifiedTopology: true });


async function testWithAsync() {
    try {
        await client.connect();
        const db = client.db();
        const collection = db.collection('employees');

        const employee = {
            id: 1,
            name: 'A. Callback',
            age: 23
        };

        const result = await collection.insertOne(employee);
        console.log('Result of insert: \n', result.insertedId);
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}

testWithAsync();
