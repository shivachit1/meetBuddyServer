import express from "express";
import {
    createEvent,
    deleteEventById,
    getAllFutureEvents,
    getEventById,
    updateEventById,
} from "../controllers/event.js";
import {
    createUser,
    deleteUserById,
    getUserById,
    getUserProfileData,
    googleLogIn,
    searchUsers,
    updateUserById,
} from "../controllers/user.js";
import { checkFollow, followUser, getFollowers, unFollowUser } from "../controllers/follow.js";
import { authenticateJWT } from "../middleware/authentication.js";

export const router = express.Router();

router.post("/auth/google", googleLogIn);

// users crud routes
router.post("/users", createUser);
router.get("/users/:userId", getUserById);
router.put("/users/:userId", updateUserById);
router.delete("/users/:userId", deleteUserById);

router.get("/users", authenticateJWT, searchUsers);
router.get("/users/:userId/profileDetails", getUserProfileData); // userdata + upComingEvents + pastEvents + reviews

// events crud routes
router.get("/events", getAllFutureEvents);
router.post("/events", authenticateJWT, createEvent);
router.get("/events/:eventId", getEventById);
router.put("/events/:eventId", updateEventById);
router.delete("/events/:eventId", deleteEventById);

// follow routes
router.get("/follow/:userId", getFollowers);
router.get("/follow/:userId/:targetedUserId", checkFollow);
router.post("/follow/:userId", followUser);
router.delete("/unfollow/:userId", unFollowUser);
