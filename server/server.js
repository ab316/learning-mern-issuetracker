const fs = require('fs');
const express = require('express');
const app = express();
const { ApolloServer, UserInputError } = require('apollo-server-express');
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
        if (ast.kind == Kind.STRING) {
            const value = new Date(ast.value);
            return isNaN(value) ? undefined : value;
        }
    },
    parseValue(value) {
        const dateValue = new Date(value);
        return isNaN(dateValue) ? undefined : dateValue;
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
    validateIssue(issue);
    issue.created = new Date();
    issue.id = issuesDb.length + 1;
    issuesDb.push(issue);

    return issue;
}

function validateIssue(issue) {
    const errors = [];
    if (issue.title.length < 3) {
        errors.push('Field "title" must be alteast 3 characters long');
    }

    if (issue.status == 'Assigned' && !issue.owner) {
        errors.push('Field "owner" is required when status is "Assigned"');
    }

    if (errors.length > 0) {
        throw new UserInputError('Invalid input(s)', { errors });
    }
}


const server = new ApolloServer({
    typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
    resolvers,
    formatError: error => {
        console.log(error);
        return error;
    }
});

app.use('/', express.static('public'));
server.applyMiddleware({ app, path: '/graphql' });

app.listen(3000, () => console.log('App started on port 3000'));
