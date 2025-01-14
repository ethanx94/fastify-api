const boom = require('boom');

const Car = require('../models/Car');

exports.getCars = async (req, reply) => {
  try {
    const cars = await Car.find();
    return cars;
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.getSingleCar = async (req, reply) => {
  try {
    const id = req.params === undefined
      ? req.id
      : req.params.id;
    const car = await Car.findById(id);
    return car;
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.addCar = async (req, reply) => {
  try {
    const car = new Car(req);
    return car.save();
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.updateCar = async (req, reply) => {
  try {
    const id = req.params === undefined
      ? req.id
      : req.params.id;
    const update = await Car.findByIdAndUpdate(id, req, { new: true });
    return update;
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.deleteCar = async (req, reply) => {
  try {
    const id = req.params === undefined
      ? req.id
      : req.params.id;
    const car = await Car.findByIdAndRemove(id);
    return car;
  } catch (err) {
    throw boom.boomify(err);
  }
};
