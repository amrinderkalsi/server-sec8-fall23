import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { readFile } from 'node:fs/promises';
import { GraphQLScalarType } from 'graphql';
import { connectToDb, getDb} from './db.js'

let db;

const app = express();

app.use(express.json());

// app.get('/api/issues', (req, res) => {
//     console.log('New request');
//     const metaData = {totalCount: issues.length};
//     res.json({
//         "metaData": metaData,
//         "records": issues
//     });
// });

const GraphQlDateResolver = new GraphQLScalarType({
  name: 'GraphQlDate',
  description: 'A GraphQl Date Type',
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
    const newDate = new Date(value);
    return isNaN(newDate) ? undefined : newDate
  }
});

const getNextSequence = async () => {
  const count = await db.collection('issues').find({}).count();
  return count + 1;
}

const issueAdd = async (_root, {issue}) => {
  issue.id = await getNextSequence();
  issue.status = 'New';
  issue.created = new Date();
  const result = await db.collection('issues').insertOne(issue);
  const savedIssue = await db.collection('issues').findOne({_id: result.insertedId});
  return savedIssue;
}

const issueList = async () => {
  const issues = await db.collection('issues').find({}).toArray();
  return issues;
}

const typeDefs = await readFile('./schema.graphql', 'utf8');

const resolvers = {
  Query: {
    name: () => 'Erick',
    issueList: issueList
  },
  Mutation: {
    sendName: (_root ,{name}) => {
      return name + '!';
    },
    issueAdd: issueAdd
  },
  GraphQlDate: GraphQlDateResolver
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

await apolloServer.start();

app.use('/graphql', expressMiddleware(apolloServer));


connectToDb((url, err) => {
  if(!err) {
    app.listen(5002, () => {
        console.log('Express Server started on port 5002');
        console.log('GraphQl Server started on port http://localhost:5002/graphql');
        console.log('MongoDb connected to ', url);
    });
    db = getDb();
  }
});