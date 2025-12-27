const { MongoClient } = require('mongodb');

// Connection string provided by user
// NOTE: In production, this should be in an environment variable process.env.MONGODB_URI
const uri = "mongodb+srv://sohail:qwertyuiop@cluster0.yks7d.mongodb.net/?retryWrites=true&w=majority";

let cachedClient = null;
let clientPromise = null;

if (!clientPromise) {
    clientPromise = MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

exports.handler = async (event, context) => {
    // Only allow GET requests (or simple navigation mostly uses GET)
    // But since we want to 'write' (increment), we might want a POST, 
    // or just handle it all in one logic for this simple use case.
    
    // We'll support a query param ?action=hit or ?action=get
    const action = event.queryStringParameters.action || 'hit';
    
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        const client = await clientPromise;
        const db = client.db('jlm_portfolio');
        const collection = db.collection('visitors');

        let result;
        
        if (action === 'hit') {
            // Increment the counter
            // We use 'jlm_site' as the unique ID for this counter document
            result = await collection.findOneAndUpdate(
                { _id: 'jlm_site' },
                { $inc: { count: 1 } },
                { upsert: true, returnDocument: 'after' }
            );
            // findOneAndUpdate returns the document in result.value (or result if new driver)
            // In MongoDB Node driver v5/v6, it returns just the document or a result object depending on options.
            // Let's safe check.
        } else {
            // Just read
            const doc = await collection.findOne({ _id: 'jlm_site' });
            result = doc || { count: 0 };
        }

        // Handle different driver return structures (v3 vs v4+)
        const count = result.value ? result.value.count : (result.count || (result === null ? 0 : result));

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Allow CORS
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ value: count })
        };

    } catch (error) {
        console.error('Database Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to connect to database' })
        };
    }
};
