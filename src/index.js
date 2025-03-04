const { ApolloServer } = require('apollo-server');

const typeDefs = `
# enum definition
enum PhotoCategory {
  SELFIE
  PORTRAIT
  NIGHT
  LANDSCAPE
  MARCRO
}

#type user definition
type User {
  githubLogin: ID!
  name: String
  avatar: String
  postedPhotos: [Photo!]!
  inPhotos: [Photo!]!
}

# Photo type definition
type Photo {
  id: ID!
  url: String!
  name: String!
  description: String,
  category: PhotoCategory!
  postedBy: User!
}

type Query {
  totalPhotos: Int!
  allPhotos: [Photo!]!
}

type PostPhotoInput { # input type like ts interface
  name: String!
  category: PhotoCategory=PORTRAIT
  description: String
}

type Mutation {
  postPhoto(input: PostPhotoInput!): Photo!
}
`;

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
  },
  {
    id: '2',
    name: 'Enjoying the sunshine',
    category: 'SELFIE',
    githubUser: 'user2',
  },
  {
    id: '3',
    name: 'Gunbarrel 25',
    description: '25 laps on gunbarrel today',
    category: 'LANDSCAPE',
    githubUser: 'user3',
  },
];

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
