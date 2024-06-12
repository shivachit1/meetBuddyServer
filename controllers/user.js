import logger from "../logger.js";
import { generateToken } from "../middleware/authentication.js";
import { Event } from "../model/event.js";
import { Follow } from "../model/follow.js";
import { Review } from "../model/review.js";
import { User } from "../model/user.js";
import { getMyFollowData } from "../service/follow.js";

import { OAuth2Client } from "google-auth-library";

const CLIENT_ID =
  "123"; // here comes the api key 2
const client = new OAuth2Client(CLIENT_ID);

const verifyIdToken = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
};

export const googleLogIn = async (req, res) => {
  const { token } = req.body;
  try {
    const payload = await verifyIdToken(token);

    const user = await User.findOne({ email: payload.email });

    if (user) {
      logger.info("User already exists");
      const userJson = user.toJSON()
      const jwtToken = generateToken(userJson);
      return res.status(200).send({...userJson, jwtToken});
    }

    logger.info("Creating new user");
    const newUser = await new User({
      name: payload.name,
      email: payload.email,
      userName: "",
      bio: "",
      imageUrl: payload.picture,
    }).save();

    logger.info("New User successfully created : ", newUser.name);

    const newUserJson = newUser.toJSON()
    const jwtToken = generateToken(newUserJson);
    return res.status(200).send({...newUserJson, jwtToken});
  } catch (error) {
    logger.error(error)
    res.status(401).send("Unauthorized");
  }
};

export const createUser = async (req, res) => {
  logger.info("Create new User");
  try {
    const newUser = new User(req.body);
    await newUser.save();

    logger.info("Create new User successful");
    res.status(201).send(newUser);
  } catch (error) {
    logger.error("Failed to create new User successful");
    res.status(500).send(error);
  }
};

export const getUserById = async (req, res) => {
  const userId = req.params.userId;
  logger.info("get user by id : ", userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    logger.error("failed to fetch user by Id : ", userId);
    res.status(500).send(error);
  }
};

export const updateUserById = async (req, res) => {
  const userId = req.params.userId;
  logger.info("update user by id : ", userId);
  const userData = req.body.user;

  logger.info("update user data hello: ", userData);
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { ...userData },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    logger.error("failed to update user by id : ", userId, error);
    res.status(500).send(error);
  }
};

export const deleteUserById = async (req, res) => {
  const userId = req.params.userId;
  logger.info("delete user by id : ", userId);
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.sendStatus(204);
  } catch (error) {
    logger.error("failed to delete user by id : ", userId);
    res.status(500).send(error);
  }
};

// extra routes controllers
export const searchUsers = async (req, res) => {
  const searchQuery = req.query.search || '';
  const userId = req.user.id
  logger.info("searching user by,", searchQuery);
  try {
    const regex = new RegExp(searchQuery, 'i'); // 'i' makes it case-insensitive
    const users = await User.find({
      $and: [
        { name: { $regex: regex } },
        { _id: { $ne: userId } }
      ]
    }).limit(10); // Limit the number of results
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfileData = async (req, res) => {
  const userId = req.params.userId;
  logger.info("get user profile details, userId: ", userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      logger.warn("User not found, userId: ", userId);
      return res.status(404).send("User not found");
    }

    // filter to search events created by this user
    const events = await Event.find({ createdBy: userId })
      .sort({
        eventStartTime: 1,
      })
      .populate("createdBy");

    const reviews = await Review.find({ reviewedUser: userId }).populate(
      "reviewerUser"
    );
    const followers = await getMyFollowData(userId);

    // sorting events with current time
    const currentTime = new Date();
    const upComingEvents = events.filter(
      (event) => new Date(event.eventStartTime) > currentTime
    );
    const pastEvents = events
      .filter((event) => new Date(event.eventStartTime) < currentTime)
      .sort(
        (event1, event2) =>
          new Date(event2.eventStartTime) - new Date(event1.eventStartTime)
      );

    logger.info(
      "Successfully completed get user profile details, userId: ",
      userId
    );
    res.json({
      user: user,
      upComingEvents: upComingEvents,
      pastEvents: pastEvents,
      reviews: reviews,
      followData: followers,
    });
  } catch (error) {
    logger.error("failed to get user profile details, userId: ", userId);
    res.status(500).send(error);
  }
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
