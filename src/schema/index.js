const graphql = require('graphql');

const carController = require('../controllers/carController');
const ownerController = require('../controllers/ownerController');
const serviceController = require('../controllers/serviceController');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const ownerType = new GraphQLObjectType({
  name: 'Owner',
  fields: () => ({
    _id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    cars: {
      type: new GraphQLList(carType),
      resolve: async (parent, args) => ownerController.getOwnersCars({ id: parent._id }),
    },
  }),
});

const serviceType = new GraphQLObjectType({
  name: 'Service',
  fields: () => ({
    _id: { type: GraphQLID },
    car_id: { type: GraphQLID },
    name: { type: GraphQLString },
    date: { type: GraphQLString },
    car: {
      type: carType,
      resolve: async (parent, args) => carController.getSingleCar({ id: parent.car_id }),
    },
  }),
});

const carType = new GraphQLObjectType({
  name: 'Car',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    brand: { type: GraphQLString },
    price: { type: GraphQLString },
    age: { type: GraphQLInt },
    owner_id: { type: GraphQLID },
    owner: {
      type: ownerType,
      resolve: async (parent, args) => ownerController.getSingleOwner({ id: parent.owner_id }),
    },
    services: {
      type: new GraphQLList(serviceType),
      resolve: async (parent, args) => serviceController.getCarsServices({ id: parent._id }),
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    car: {
      type: carType,
      args: { id: { type: GraphQLID } },
      resolve: async (parent, args) => carController.getSingleCar(args),
    },
    cars: {
      type: new GraphQLList(carType),
      resolve: async (parent, args) => carController.getCars(),
    },
    owner: {
      type: ownerType,
      args: { id: { type: GraphQLID } },
      resolve: async (parent, args) => ownerController.getSingleOwner(args),
    },
    service: {
      type: serviceType,
      args: { id: { type: GraphQLID } },
      resolve: async (parent, args) => serviceController.getSingleService(args),
    },
  },
});

const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    addCar: {
      type: carType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        brand: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: GraphQLString },
        age: { type: GraphQLInt },
        owner_id: { type: GraphQLID },
      },
      resolve: async (parent, args) => carController.addCar(args),
    },
    editCar: {
      type: carType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        brand: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        owner_id: { type: GraphQLID },
      },
      resolve: async (parent, args) => carController.updateCar(args),
    },
    deleteCar: {
      type: carType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => carController.deleteCar(args),
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations,
});
