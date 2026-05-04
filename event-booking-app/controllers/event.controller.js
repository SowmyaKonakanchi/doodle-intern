const Event = require("../models/event.model");
const Booking = require("../models/booking.model");
const User = require("../models/user.model");

const sendMail = require("../utils/mail");
const geocoder = require("../utils/geocoder");

const sequelize = require("../config/db");
const { Op } = require("sequelize");


/* CREATE EVENT (ADMIN) */

exports.createEvent = async (req, res) => {

  try {

    const { title, description, location, startTime, endTime } = req.body;

    const geoData = await geocoder.geocode(location);

    const latitude = geoData[0]?.latitude;
    const longitude = geoData[0]?.longitude;

    const event = await Event.create({
      title,
      description,
      location,
      startTime,
      endTime,
      latitude,
      longitude
    });

    res.status(201).json({
      message: "Event created successfully",
      event
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};



/* LIST EVENTS WITH PAGINATION */

exports.getEvents = async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const offset = (page - 1) * limit;

    const events = await Event.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]]
    });

    res.json({
      totalEvents: events.count,
      currentPage: page,
      totalPages: Math.ceil(events.count / limit),
      events: events.rows
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};



/* SEARCH BY LOCATION */

exports.searchByLocation = async (req, res) => {

  try {

    const { location } = req.query;

    const events = await Event.findAll({
      where: {
        location: {
          [Op.like]: `%${location}%`
        }
      }
    });

    res.json(events);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};



/* NEARBY EVENTS BY PLACE */

exports.nearbyEventsByPlace = async (req, res) => {

  try {

    const { place, distance } = req.query;

    const geoData = await geocoder.geocode(place);

    const lat = geoData[0].latitude;
    const lng = geoData[0].longitude;

    const events = await Event.findAll({

      attributes: {
        include: [
          [
            sequelize.literal(`
            6371 * acos(
              cos(radians(${lat})) *
              cos(radians(latitude)) *
              cos(radians(longitude) - radians(${lng})) +
              sin(radians(${lat})) *
              sin(radians(latitude))
            )
            `),
            "distance"
          ]
        ]
      },

      having: sequelize.literal(`distance <= ${distance}`),

      order: sequelize.literal("distance ASC")

    });

    res.json({
      place,
      latitude: lat,
      longitude: lng,
      events
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};



/* NEARBY EVENTS FROM USER LOCATION */

exports.nearbyEvents = async (req, res) => {

  try {

    const radius = req.query.radius || 50;

    const user = await User.findByPk(req.user.id);

    if (!user.latitude || !user.longitude) {
      return res.status(400).json({
        message: "User location not available"
      });
    }

    const lat = user.latitude;
    const lng = user.longitude;

    const events = await Event.findAll({

      attributes: {
        include: [
          [
            sequelize.literal(`
            6371 * acos(
              cos(radians(${lat})) *
              cos(radians(latitude)) *
              cos(radians(longitude) - radians(${lng})) +
              sin(radians(${lat})) *
              sin(radians(latitude))
            )
            `),
            "distance"
          ]
        ]
      },

      having: sequelize.literal(`distance <= ${radius}`),

      order: sequelize.literal("distance ASC")

    });

    res.json({
      userLocation: {
        area: user.area,
        city: user.city
      },
      radius: radius,
      events
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};



/* JOIN EVENT */

exports.joinEvent = async (req, res) => {

  try {

    const userId = req.user.id;
    const { eventId } = req.body;

    const event = await Event.findByPk(eventId);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    const existingBooking = await Booking.findOne({
      where: { UserId: userId, EventId: eventId }
    });

    if (existingBooking)
      return res.json({ message: "Already joined this event" });

    const booking = await Booking.create({
      UserId: userId,
      EventId: eventId,
      status: "GOING"
    });

    const user = await User.findByPk(userId);

    await sendMail(
      user.email,
      "Event Booking Confirmation",
      `Hello ${user.name}, you joined ${event.title}`
    );

    res.json({
      message: "Event joined successfully",
      booking
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};



/* PARTICIPANTS */

exports.getParticipants = async (req, res) => {

  try {

    const participants = await Booking.findAll({

      where: { EventId: req.params.id },

      include: {
        model: User,
        attributes: ["id", "name", "email"]
      }

    });

    res.json(participants);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};



/* MY BOOKINGS */

exports.myBookings = async (req, res) => {

  try {

    const bookings = await Booking.findAll({
      where: { UserId: req.user.id },
      include: Event
    });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};



/* CANCEL BOOKING */

exports.cancelBooking = async (req, res) => {

  try {

    const { eventId } = req.body;

    const booking = await Booking.findOne({
      where: {
        UserId: req.user.id,
        EventId: eventId
      },
      include: Event
    });

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    const eventStart = new Date(booking.Event.startTime);

    const diffHours = (eventStart - new Date()) / (1000 * 60 * 60);

    if (diffHours < 8)
      return res.json({
        message: "Cannot cancel within 8 hours of event"
      });

    booking.status = "CANCELED";

    await booking.save();

    res.json({ message: "Booking cancelled successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};