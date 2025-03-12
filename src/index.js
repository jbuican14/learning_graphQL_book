const express = require('express');
const { GraphQLScalarType } = require('graphql');
const { ApolloServer } = require('apollo-server-express');
const expressPlayground = require('graphql-playground-middleware-express');
const { readFileSync } = require('fs');
const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8');
const { typeDefs } = require('./schema'); // import the schema from schema.js

var _id = 0; // private variable to mock database id generation
// var photos = [];
// testing only
var users = [
  { githubLogin: 'user1', name: 'Foo bar' },
  { githubLogin: 'user2', name: 'Jenny' },
  { githubLogin: 'user3', name: 'Any Amy' },
];
var photos = [
  {
    id: '1',
    name: 'Dropping the Heart Chute',
    description: 'The heart chute is one of my favorite chutes',
    category: 'ACTION',
    githubUser: 'user1',
    created: '3-28-2005',
  },
  {
    id: '2',
    name: 'Enjoying the sunshine',
    category: 'SELFIE',
    githubUser: 'user2',
    created: '3-28-1977',
  },
  {
    id: '3',
    name: 'Gunbarrel 25',
    description: '25 laps on gunbarrel today',
    category: 'LANDSCAPE',
    githubUser: 'user3',
    created: '3-28-2006',
  },
];

var tags = [
  { photoID: '1', userID: 'user1' },
  { photoID: '2', userID: 'user2' },
  { photoID: '2', userID: 'user3' },
  { photoID: '2', userID: 'user3' },
];

var date = new Date('03/11/2025');

const serializeDate = (date) => {
  return date.toISOString();
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startApolloServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start(); // Wait for the server to start before applying middleware
  server.applyMiddleware({ app }); // Mount the GraphQL endpoint on the Express app

  // Add a default route if you need one
  app.use((req, res) => {
    res.send('Hello!');
  });

  app.get('/', (req, res) =>
    res.end('Welcome to the PhotoShare API using express')
  );

  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

  const PORT = process.env.PORT || 4000;
  app.listen({ port: PORT }, () => {
    console.log(
      `GraphQL Server running @ http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startApolloServer();
