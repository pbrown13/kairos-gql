const { gql } = require("apollo-server");

const typeDefs = gql`
  type Company {
    id: Int
    external_id: String
    name: String
    city: String
    state: String
    zip: String
    country: String
    latitude: Float
    longitude: Float
    locations: [Location]
    users: [User]
    messages: [Message]
    primary_users: [String]
  }

  type Location {
    id: Int
    name: String
    rules: [Rule]
    latitude: Float
    longitude: Float
    things: [Thing]
  }

  type Thing {
    id: String
    company: Company
    location: Location
    thing_name: String
    thing_type: String
    sensor_type: String
    status: Int
    enabled: Int
    device_id: String
    hardware_id: String
    cayenne_id: String
    readings: [Reading]
  }

  type Rule {
    id: String
    title: String
    status: String
    last_triggered: String
    total_triggered: Int
    created_at: String
    notifications: [Notification]
    triggers: [Trigger]
  }

  type Notification {
    type: String
    value: String
    method: String
    data: NotificationData
  }

  type NotificationData {
    user_id: String
    alert_type: String
    child_name: String
    sensor_use: String
    device_name: String
    sensor_type: String
    display_text: String
    date_timezone: String
    copyright_year: Int
    custom_message: String
    email: String
    last_name: String
    first_name: String
  }

  type Trigger {
    id: String
    unit: String
    channel: Int
    query_type: String
    triggers_combination: String
    conditions: [TriggerConditions]
  }

  type TriggerConditions {
    value: Int
    operator: String
  }

  type Reading {
    v: Float
    ts: String
    channel: String
    unit: String
  }

  type User {
    id: String
    federated_user_id: String
    enabled: Boolean
    first_name: String
    last_name: String
    email: String
    username: String
    phone_number: String
    authorization: String
    companies: [Company]
  }

  type Message {
    id: Int
    message: String
    type: String
    user: User
    device: Thing
  }

  type Token {
    access_token: String
    expires_in: Int
    refresh_expires_in: Int
    refresh_token: String
  }

  type Report {
    company_id: String
    created_at: String
    created_by: String
    day: Int
    enabled: Int
    end_date: String
    frequency: String
    job_id: String
    job_token: String
    locations: [Location]
    name: String
    public: String
    start_date: String
    status: Int
    things: [Thing]
  }

  input ReportInput {
    company_id: String
    created_by: String
    day: Int
    enabled: Int
    end_date: String
    frequency: String
    locations: [String]
    name: String
    public: String
    start_date: String
    status: Int
    things: [String]
  }

  type Query {
    companies(name: String): [Company]
    company(id: Int): Company
    locations(company_id: Int!): [Location]
    location(company_id: Int!, id: Int!): Location
    things(company_id: Int!, location_id: Int!): [Thing]
    thing(company_id: Int!, location_id: Int!, id: Int!): Thing
    readings(company_id: Int!, location_id: Int!, thing_id: String!): [Reading]
    reading(thing_id: String!): Reading
    messages: [Message]
    message(id: Int!): Message
    users: [User]
    rules: [Rule]
    user(id: String): User
  }

  type Mutation {
    auth(email: String, password: String): Token
    adminAuth: Token
  }
`;

module.exports = typeDefs;
