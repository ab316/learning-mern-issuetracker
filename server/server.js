const fs = require('fs');
const express = require('express');
const app = express();
const { ApolloServer } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');


let aboutMessage = "Issue Tracker API v1.0"
const issuesDb = [
    { id: 1, status: 'New', owner: 'Abdullah', effort: 5, created: new Date('2020-01-04'), due: undefined, title: 'Error in console when clicking Add' },
    { id: 2, status: 'Assigned', owner: 'Asad', effort: 14, created: new Date('2019-11-12'), due: new Date('2020-01-01'), title: 'Missing bottom border on panel' }
];

const GraphQLDate = new GraphQLScalarType({
    name: 'GraphQLDate',
    description: 'A Date() type in GraphQL as a scalar',
    serialize(value) {
        return value.toISOString();
    },
    parseLiteral(ast) {
        return (ast.kind == Kind.STRING) ? new Date(ast.value) : undefined;
    },
    parseValue(value) {
        return new Date(value);
    }
});


const resolvers = {
    Query: {
        about: () => aboutMessage,
        issues: () => issuesDb
    },
    Mutation: {
        setAboutMessage,
        addIssue
    },
    GraphQLDate
}


function setAboutMessage(_, { message }) {
    return aboutMessage = message;
}

function addIssue(_, { issue }) {
    issue.created = new Date();
    issue.id = issuesDb.length + 1;
    if (issue.status == undefined) issue.status = 'New';
    issuesDb.push(issue);
    
    return issue;
}


const server = new ApolloServer({
    typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
    resolvers
});

app.use('/', express.static('public'));
server.applyMiddleware({ app, path: '/graphql' });

app.listen(3000, () => console.log('App started on port 3000'));
