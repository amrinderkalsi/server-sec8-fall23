import { MongoClient } from 'mongodb';

const url = 'mongodb+srv://mongoDb:mongodb@cluster0.7gomg1h.mongodb.net/issuetracker?retryWrites=true&w=majority';
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
