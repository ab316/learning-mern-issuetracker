const fs = require('fs');
const express = require('express');
const app = express();

// DB
const { MongoClient } = require('mongodb');
let db;

// GraphQL
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const dbUrl = 'mongodb://localhost/issuetracker';


let aboutMessage = "Issue Tracker API v1.0"


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
        issues: issuesList
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

function validateIssue(issue) {
    const errors = [];
    if (issue.title.length < 3) {
        errors.push('Field "title" must be at least 3 characters long');
    }

    if (issue.status == 'Assigned' && !issue.owner) {
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
        { returnOriginal: false }
    );
    return result.value.current;
}

async function issuesList() {
    const issues = await db.collection('issues').find({}).toArray();
    return issues;
}

async function addIssue(_, { issue }) {
    validateIssue(issue);
    issue.created = new Date();
    
    issue.id = await getNextSequence('issues');
    const result = await db.collection('issues').insertOne(issue);
    const savedIssue = await db.collection('issues').findOne({ _id: result.insertedId });

    return savedIssue;
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

(async function () {
    try {
        await connectToDb();
        app.listen(3000, () => console.log('App started on port 3000'));
    } catch (err) {
        console.log('ERROR:', err);
    }
})();
