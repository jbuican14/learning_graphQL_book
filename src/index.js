const { ApolloServer } = require('apollo-server');

const typeDefs = `
# Photo type definition
type Photo {
  id: ID!
  url: String!
  name: String!
  description: String
}

type Query {
  totalPhotos: Int!
  allPhotos: [Photo!]!
}

type Mutation {
  postPhoto(name: String! description: String): Photo!
}
`;

var _id = 0; // private variable to mock database id generation
var photos = [];

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
  },
  Mutation: {
    postPhoto(parent, args) {
      // new photo created with generated id
      // spread the name and description fields from args into new photo object
      var newPhoto = {
        id: _id++,
        ...args.input,
      };
      photos.push(newPhoto);
      return newPhoto;
    },
  },
  Photo: {
    url: (parent) => `http://example.com/img/${parent.id}.jpg`,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`GraphQL Service running at ${url}`);
});
