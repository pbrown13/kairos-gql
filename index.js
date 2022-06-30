const dotenv = require('dotenv').config();
const IotInABoxAPI = require('./datasources/iotinabox/iotinabox')
const port = process.env.PORT || 3001;
const { ApolloServer, gql } = require('apollo-server');

const typeDefs = require('./typedefs/typedefs')
const resolvers = require('./resolvers/resolvers')

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  introspection: true,
  playground: true,  
  dataSources: () => {
    return {
      IotInABoxAPI: new IotInABoxAPI()
    };
  },
  context: async({ req, res }) => { 
        return {
          token: req.headers.authorization
        };
  }, });


server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`
    🚀  Server is ready at ${url}
    📭  Query at https://studio.apollographql.com/dev
  `);
});

