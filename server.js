import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { readFile } from 'node:fs/promises';
import { GraphQLScalarType } from 'graphql';

const app = express();

app.use(express.json());

const issues = [
    {
      id: 1, 
      status: 'Open', 
      owner: 'Ravan',
      created: new Date('2016-08-15'), 
      effort: 5, 
      completionDate: undefined,
      title: 'Error in console when clicking Add',
    },
    {
      id: 2, 
      status: 'Assigned', 
      owner: 'Eddie',
      created: new Date('2016-08-16'), 
      effort: 14, 
      completionDate: new Date('2016-08-30'),
      title: 'Missing bottom border on panel',
    },
];

app.get('/api/issues', (req, res) => {
    console.log('New request');
    const metaData = {totalCount: issues.length};
    res.json({
        "metaData": metaData,
        "records": issues
    });
});

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

const typeDefs = await readFile('./schema.graphql', 'utf8');

const resolvers = {
  Query: {
    name: () => 'Erick',
    issueList: () => {
      return issues;
    }
  },
  Mutation: {
    sendName: (_root ,{name}) => {
      return name + '!';
    },
    issueAdd: (_root, {issue}) => {
      issue.id = issues.length + 1;
      issue.status = 'New';
      issue.created = new Date();
      issues.push(issue);
      return issue;
    }
  },
  GraphQlDate: GraphQlDateResolver
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

await apolloServer.start();

app.use('/graphql', expressMiddleware(apolloServer));

app.listen(5002, () => {
    console.log('Server started on port 5002');
});