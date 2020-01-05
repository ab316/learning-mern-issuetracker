/* eslint no-console: "off" */

require('dotenv').config();
const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const GraphQLDate = require('./graphqlDate');

const about = require('./about');
const issue = require('./issue');


const schemaPath = './schema.graphql';

const resolvers = {
    Query: {
        about: about.getMessage,
        issues: issue.list,
    },
    Mutation: {
        setAboutMessage: about.setMessage,
        addIssue: issue.add,
    },
    GraphQLDate,
};

const server = new ApolloServer({
    typeDefs: fs.readFileSync(schemaPath, 'utf-8'),
    resolvers,
    formatError: (error) => {
        console.log(error);
        return error;
    },
});

function installHandler(app) {
    const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
    console.log('CORS Setting:', enableCors);
    server.applyMiddleware({ app, path: '/graphql', cors: enableCors });
}

module.exports = { installHandler };
