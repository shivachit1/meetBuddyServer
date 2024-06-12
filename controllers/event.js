import logger from "../logger.js";
import { Event } from "../model/event.js";
import { User } from "../model/user.js";
import { eventsDataSample } from "./data.js";

export const getAllFutureEvents = async (req, res) => {
  try {
    logger.info("Accessing get all events");
    const currentDate = new Date();
    const futureEvents = await Event.find({})
      .sort({ eventStartTime: 1 })
      .populate("createdBy");
    res.status(200).json(futureEvents);
  } catch (error) {
    logger.error("Error occured while fetch all events: ", error);
    res.status(500).send(error);
  }
};

export const createEvent = async (req, res) => {
  try {
    const userId = req.user.id
    logger.info('new event created by: ', userId);
    const { event } = req.body;
    const savedEvent = await new Event({ ...event, createdBy: userId }).save();
    logger.info('new event created by: ', event);
    logger.info('new event created by: ', savedEvent);
    const afterSavedEvent = await Event.findById(savedEvent._id).populate("createdBy");
    res.status(201).json(afterSavedEvent);
  } catch (error) {
    logger.error("Failed to create new event", error);
    res.status(500).send(error);
  }
};

export const getEventById = async (req, res) => {
  const eventId = req.params.eventId;
  try {
    logger.info("Get event by id : ", eventId);
    const event = await Event.findById(eventId).populate("createdBy");
    if (!event) {
      return res.status(404).send("Event not found");
    }
    res.json(event);
  } catch (error) {
    logger.error("Failed to get event by id : ", eventId, error);
    res.status(500).send(error);
  }
};

export const updateEventById = async (req, res) => {
  const eventId = req.params.eventId;
  try {
    logger.info("Update event by id : ", eventId);
    const event = await Event.findByIdAndUpdate(eventId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res.status(404).send("Event not found");
    }
    res.json(event);
  } catch (error) {
    logger.error("Failed to uodate event by id : ", eventId, error);
    res.status(500).send(error);
  }
};

export const deleteEventById = async (req, res) => {
  const eventId = req.params.eventId;
  logger.info("Delete event by id : ", eventId);
  try {
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      return res.status(404).send("Event not found");
    }
    res.sendStatus(204);
  } catch (error) {
    logger.error("Failed to delete event by id : ", eventId);
    res.status(500).send(error);
  }
};

export const getEventsByUserId = (req, res) => {
  const userId = req.params.userId;
  logger.info("getEventsByUserId: ", userId);
  const events = eventsDataSample.filter((event) => event.createdBy === userId);
  const currentTime = new Date();
  res.json({
    upComingEvents: events.filter((event) =>
      isAfter(new Date(event.eventStartTime), currentTime)
    ),
    pastEvents: events.filter(
      (event) => !isAfter(new Date(event.eventStartTime), currentTime)
    ),
  });
};

function isAfter(date1, date2) {
  // Get the time in milliseconds for each date
  const time1 = date1.getTime();
  const time2 = date2.getTime();

  if (time1 > time2) {
    return true; // date1 is later than date2
  }

  return false;
}
