import tripService from '../services/tripService.js';

const getAllTrips = async (req, res, next) => {
  try {
    const trips = await tripService.getAllTrips();
    res.json(trips);
  } catch (err) {
    next(err);
  }
};

const getTripById = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (err) {
    next(err);
  }
};

const createTrip = async (req, res, next) => {
  try {
    const newTrip = await tripService.createTrip(req.body);
    res.status(201).json(newTrip);
  } catch (err) {
    next(err);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    const updatedTrip = await tripService.updateTrip(req.params.id, req.body);
    if (!updatedTrip) return res.status(404).json({ message: "Trip not found" });
    res.json(updatedTrip);
  } catch (err) {
    next(err);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    const deleted = await tripService.deleteTrip(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Trip not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export default { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip };
