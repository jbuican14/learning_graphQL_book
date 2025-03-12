const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: (parent, args) => {
      console.log('🚀 ~ args:', args);
      args.after;
      return photos;
    },
  },
  Mutation: {
    postPhoto(parent, args) {
      // new photo created with generated id
      // spread the name and description fields from args into new photo object
      var newPhoto = {
        id: _id++,
        ...args.input,
        created: new Date(),
      };
      photos.push(newPhoto);
      return newPhoto;
    },
  },
  Photo: {
    url: (parent) => `http://example.com/img/${parent.id}.jpg`,
    postedBy: (parent) => {
      // console.log('🚀 ~ parent:', parent);
      return users.find((u) => u.githubUser === parent.githubUser);
    },
    taggedUsers: (parent) =>
      tags
        .filter((tag) => tag.photoID === parent.id)
        .map((tag) => tag.userID)
        .map((userID) => users.find((u) => u.githubUser === userID)),
  },
  User: {
    postedPhotos: (parent) => {
      return photos.filter((p) => p.githubUser === parent.githubUser);
    },
    inPhotos: (parent) =>
      tags
        .filter((tag) => tag.userID === parent.githubUser)
        .map((tag) => tag.photoID)
        .map((photoID) => photos.find((p) => p.id === photoID)),
  },
  DateTime: {
    timestamp: (parent) => parent.getTime(),
  },
};

module.exports = resolvers;
