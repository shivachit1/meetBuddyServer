import logger from "../logger.js";
import * as FollowService from "../service/follow.js";

export const checkFollow = async (req, res) => {
  const userId = req.params.userId;
  const targetedUserId = req.params.targetedUserId;

  try {
    // Check if the follow relationship already exists
    const isFollowing = await FollowService.checkFollow(userId, targetedUserId)
    res.status(200).send(isFollowing)
  } catch (err) {
    logger.error('Error occurred while checking following', err);
  }
};

export const followUser = async (req, res) => {
  const userId = req.params.userId;
  const { followedUserId } = req.body;
  try {
    // Check if the follow relationship already exists
    await FollowService.handleFollowUser(userId, followedUserId)
    res.status(201)
  } catch (err) {
    logger.error('Error occurred while following user: ', err);
  }
};

export const unFollowUser = async (req, res) => {
  const userId = req.params.userId;
  const { unFollowedUserId } = req.body;
  try {
    // Check if the follow relationship already exists
    await FollowService.handleUnfollowUser(userId, unFollowedUserId)
    res.status(200)
  } catch (err) {
    logger.error('Error occurred while unfollowing user: ', err);
  }
};

// Function to get followers of a user
export const getFollowers = async (req, res) =>  {
  try {
    const userId = req.params.userId;
    const followers = await FollowService.getMyFollowData(userId)
    res.status(200).json(followers)
  } catch (err) {
    console.error('Error getting followers:', err);
  }
}