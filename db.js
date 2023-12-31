import { MongoClient } from 'mongodb';

const url = 'mongodb+srv://mongodb:mongodb@cluster0.3uchxes.mongodb.net/issuetracker?retryWrites=true&w=majority';

let db;

const connectToDb = (callback) => {
    MongoClient.connect(url)
        .then(client => {
            db = client.db();
            return callback(url);
        }).catch(err => {
            console.log(err);
            return callback(url, err);
        })
}

const getDb = () => {
    return db;
}

export {connectToDb, getDb};
