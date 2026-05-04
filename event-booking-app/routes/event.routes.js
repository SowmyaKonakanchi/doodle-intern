const express = require("express");
const router = express.Router();

const eventController = require("../controllers/event.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");


router.post(
 "/create",
 authMiddleware,
 roleMiddleware("ADMIN"),
 eventController.createEvent
);


router.get(
 "/",
 authMiddleware,
 eventController.getEvents
);


router.get(
 "/search",
 authMiddleware,
 eventController.searchByLocation
);


router.get(
 "/nearby-place",
 authMiddleware,
 eventController.nearbyEventsByPlace
);


router.get(
 "/nearby",
 authMiddleware,
 roleMiddleware("USER"),
 eventController.nearbyEvents
);


router.post(
 "/join",
 authMiddleware,
 roleMiddleware("USER"),
 eventController.joinEvent
);


router.get(
 "/my-bookings",
 authMiddleware,
 roleMiddleware("USER"),
 eventController.myBookings
);


router.post(
 "/cancel",
 authMiddleware,
 roleMiddleware("USER"),
 eventController.cancelBooking
);


router.get(
 "/:id/participants",
 authMiddleware,
 eventController.getParticipants
);


module.exports = router;