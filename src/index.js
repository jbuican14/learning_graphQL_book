const { ApolloServer } = require('apollo-server');

const typeDefs = `
scalar DateTime

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
  taggedUsers: [User!]!
  created: DateTime!
}

type Query {
  totalPhotos: Int!
  allPhotos(after: DateTime): [Photo!]!
}

input PostPhotoInput { # input type like ts interface
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
    postedBy: (parent) => {
      // console.log('🚀 ~ parent:', parent);
      return users.find((u) => u.githubLogin === parent.githubUser);
    },
    taggedUsers: (parent) => {
      return tags
        .filter((tag) => tag.photoID === parent.id) // filter tags for the current photo
        .map((tag) => tag.userID) // map the userIDs to an array of userIDs
        .map((userID) => users.find((u) => u.githubLogin === userID)); // map the userIDs to user objects
    },
  },
  User: {
    postedPhotos: (parent) => {
      return photos.filter((p) => p.githubUser === parent.githubLogin);
    },
    inPhotos: (parent) => {
      return tags
        .filter((tag) => tag.photoID === parent.id) // filter all tags to find the ones where the photo was taken by the current user
        .map((tag) => tag.photoID) // map the photoIDs to an array of photoIDs
        .map((photoID) => photos.find((p) => p.id === photoID)); // map the photoIDs to photo objects
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`GraphQL Service running at ${url}`);
});
