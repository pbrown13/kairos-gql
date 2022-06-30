const { RESTDataSource } = require("apollo-datasource-rest");
const querystring = require("querystring");
const axios = require("axios");

class IotInABoxAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.iotinabox.com/";
  }
  async willSendRequest(request) {
    const admin = await this.adminAuth();
    const token = (await request.path.includes("/admin/"))
      ? `Bearer ${admin.access_token}`
      : this.context.token;

    request.headers.set("Authorization", token);
  }
  async getCompaniesWithName(name) {
    let companies = await this.get(`companies`, null, {
      cacheOptions: { ttl: 60 }
    })
      .then(resp => {
        let comp = resp.filter(item =>
          item.name.toLowerCase().includes(name.toLowerCase())
        );
        return comp;
      })
      .catch(err => {
        console.log(err);
      });
    return companies;
  }

  async getAllCompanies() {
    // if (!context.user || !context.user.roles.includes('admin')) return null;
    return await this.get("companies", null, {
      cacheOptions: { ttl: 60 }
    });
  }

  async getAllCompaniesWithUsers() {
    const results = await getAllCompanies();
    
    return await results.map(async (result) => {
        result.users = await this.getAllUsersInCompany(result);
        return result;
      }
    )
  }

  async getAllUsersInCompany(company){
    const admin = await this.adminAuth();
    return await company.primary_users.map(async () => {
      const {
        firstName,
        lastName,
        phoneNumber,
        ...rest
      } = await this.getUserById(id, admin.access_token)

      return {
        ...rest,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber
      }
    });
  }

  async getUserById(id, token) {
    const result = await this.get(`users/${id}`, undefined)
      .then(res => {
        return res;
      })
      .catch(e => console.log(e));

    return result;
  }

  async getAllUsers() {
    const result = await this.get("users", null, {
      cacheOptions: { ttl: 60 }
    });

    return result;
  }

  async getACompany(id) {
    const result = await this.get(`companies/${id}`);
    return result;
  }

  async getAllLocations(company_id) {
    return this.get(`companies/${company_id}/locations`, null, {
      cacheOptions: { ttl: 60 }
    });
  }

  async getALocation(company_id, id) {
    return this.get(`companies/${company_id}/locations/${id}`);
  }
  async getAllThings(company_id, location_id) {
    return this.get(
      `companies/${company_id}/locations/${location_id}/things`,
      null,
      {
        cacheOptions: { ttl: 60 }
      }
    );
  }

  async getAllRules(company_id, id) {
    return await this.get(
      `companies/${company_id}/locations/${id}/rules`,
      null,
      {
        cacheOptions: { ttl: 60 }
      }
    );
  }

  async getAThing(company_id, location_id, id) {
    const result = await this.get(
      `companies/${company_id}/locations/${location_id}/things/${id}`
    );
  }
  async getAllReadings(company_id, location_id, thing_id) {
    let readings = await this.get(
      `companies/${company_id}/locations/${location_id}/things/${thing_id}/latest`,
      null,
      {
        cacheOptions: { ttl: 60 }
      }
    )
      .then(resp => {
        return resp.summary;
      })
      .catch(err => {
        console.log(err);
      });
    return readings;
  }
  async auth(email, pass) {
    let api_url = "https://api.iotinabox.com/v1.0/oauth/token";

    let string = querystring.stringify({
      grant_type: process.env.GRANT_TYPE,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      username: email,
      password: pass
    });

    try {
      let token = await axios.post(api_url, string, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      return token.data;
    } catch (err) {
      console.error(err);
      return err;
      ``;
    }
  }
  async adminAuth() {
    let api_url =
      "https://auth.mydevices.com/auth/realms/kairosiot/protocol/openid-connect/token";

    let string = querystring.stringify({
      grant_type: "client_credentials",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    });
    try {
      let token = await axios.post(api_url, string, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      return token.data;
    } catch (err) {
      console.error(err);
      return err;
      ``;
    }
  }
}

module.exports = IotInABoxAPI;
