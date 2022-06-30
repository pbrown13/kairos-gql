const resolvers = {
  Query: {
    things: () => things,
    readings: () => readings,
    companies: async (_source, { name }, { dataSources }) => {
      console.log("Hey");
      if (name) {
        return dataSources.IotInABoxAPI.getCompaniesWithName(name);
      } else {
        return dataSources.IotInABoxAPI.getAllCompanies();
      }
    },
    company: async (_source, { id, name }, { dataSources }) => {
      if (name) {
        return dataSources.IotInABoxAPI.getCompaniesWithName(name);
      } else {
        return dataSources.IotInABoxAPI.getACompany(id);
      }
    },
    locations: async (_source, { company_id }, { dataSources }) => {
      return dataSources.IotInABoxAPI.getAllLocations(company_id);
    },
    location: async (_source, { company_id, id }, { dataSources }) => {
      return dataSources.IotInABoxAPI.getALocation(company_id, id);
    },
    rules: async (_source, { company_id, location_id }, { dataSources }) => {
      return dataSources.IotInABoxAPI.getAllRules(company_id, location_id);
    },
    things: async (_source, { company_id, location_id }, { dataSources }) => {
      return dataSources.IotInABoxAPI.getAllThings(company_id, location_id);
    },
    thing: async (
      _source,
      { company_id, location_id, id },
      { dataSources }
    ) => {
      return dataSources.IotInABoxAPI.getAThing(company_id, location_id, id);
    },
    readings: async (
      _source,
      { company_id, location_id, thing_id },
      { dataSources }
    ) => {
      return dataSources.IotInABoxAPI.getAllReadings(
        company_id,
        location_id,
        thing_id
      );
    },
    users: async (_source, { name }, { dataSources }) => {
      return dataSources.IotInABoxAPI.getAllUsers()
    },
    user: async (_source,{id} , {dataSources}) => {
      const result = {
        ... await dataSources.IotInABoxAPI.getUserById(id),
        companies: await dataSources.IotInABoxAPI.getAllCompanies()
      };

      return result;
    }
  },
  Mutation: {
    auth: async (_source, { email, password }, { dataSources }) => {
      return dataSources.IotInABoxAPI.auth(email, password);
    },
    adminAuth: async (_source, { email, password }, { dataSources }) => {
      return dataSources.IotInABoxAPI.adminAuth();
    }
  },
  Company: {
    locations(parent, args, context) {
      return context.dataSources.IotInABoxAPI.getAllLocations(parent.id);
    }
  },
  Location: {
    things(parent, args, context) {
      let company_id = parent.company_id;
      let location_id = parent.id;

      return context.dataSources.IotInABoxAPI.getAllThings(
        company_id,
        location_id
      );
    },
    rules(parent, args, context) {
      let company_id = parent.company_id;
      let location_id = parent.id;

      return context.dataSources.IotInABoxAPI.getAllRules(
        company_id,
        location_id
      );
    }
  },
  Thing: {
    readings(parent, args, context) {
      let company_id = parent.company_id;
      let location_id = parent.location_id;
      let thing_id = parent.id;

      return context.dataSources.IotInABoxAPI.getAllReadings(
        company_id,
        location_id,
        thing_id
      );
    }
  }
};

module.exports = resolvers;
