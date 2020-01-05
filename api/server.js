/* eslint no-console: "off" */

require('dotenv').config();
const fs = require('fs');
const express = require('express');
const { MongoClient } = require('mongodb');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const app = express();
let db;

const port = process.env.API_SERVER_PORT || 3000;
const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
const schemaPath = './schema.graphql';
const dbUrl = process.env.DB_URL || 'mongodb://localhost/issuetracker';


let aboutMessage = 'Issue Tracker API v1.0';


const GraphQLDate = new GraphQLScalarType({
    name: 'GraphQLDate',
    description: 'A Date() type in GraphQL as a scalar',
    serialize(value) {
        return value.toISOString();
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            const value = new Date(ast.value);
            return Number.isNaN(value.getTime()) ? undefined : value;
        }
        return undefined;
    },
    parseValue(value) {
        const dateValue = new Date(value);
        return Number.isNaN(dateValue.getTime()) ? undefined : dateValue;
    },
});


function setAboutMessage(_, { message }) {
    aboutMessage = message;
    return aboutMessage;
}

function validateIssue(issue) {
    const errors = [];
    if (issue.title.length < 3) {
        errors.push('Field "title" must be at least 3 characters long');
    }

    if (issue.status === 'Assigned' && !issue.owner) {
        errors.push('Field "owner" is required when status is "Assigned"');
    }

    if (errors.length > 0) {
        throw new UserInputError('Invalid input(s)', { errors });
    }
}

async function connectToDb() {
    const client = new MongoClient(dbUrl, { useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB at', dbUrl);
    db = client.db();
}

async function getNextSequence(name) {
    const result = await db.collection('counters').findOneAndUpdate(
        { _id: name },
        { $inc: { current: 1 } },
        { returnOriginal: false },
    );
    return result.value.current;
}

async function issuesList() {
    const issues = await db.collection('issues').find({}).toArray();
    return issues;
}

async function addIssue(_, { issue }) {
    validateIssue(issue);
    const newIssue = { ...issue };
    newIssue.created = new Date();

    newIssue.id = await getNextSequence('issues');
    const result = await db.collection('issues').insertOne(newIssue);
    const savedIssue = await db.collection('issues').findOne({ _id: result.insertedId });

    return savedIssue;
}

const resolvers = {
    Query: {
        about: () => aboutMessage,
        issues: issuesList,
    },
    Mutation: {
        setAboutMessage,
        addIssue,
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

console.log('CORS Setting:', enableCors);
server.applyMiddleware({ app, path: '/graphql', cors: enableCors });

(async function main() {
    try {
        await connectToDb();
        app.listen(port, () => console.log(`API started on port ${port}`));
    } catch (err) {
        console.log('ERROR:', err);
    }
}());
