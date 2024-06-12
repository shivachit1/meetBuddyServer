import logger from "../logger.js";
import { Follow } from "../model/follow.js";

// Function to unfollow a user
export const checkFollow = async (followerUserId, followedUserId) => {
  try {
    // Remove the follow relationship from the Follow collection
    const follow = await Follow.findOne({
      followerUserId: followerUserId,
      followedUserId: followedUserId
    });

    if (follow) {
      logger.info(`User ${followerUserId} is following ${followedUserId}`);
      return true;
    } else {
      logger.info(`User ${followerUserId} is not following ${followedUserId}`);
      return false;
    }
  } catch (err) {
    logger.error('Error occurred while checking follow:', err);
  }
}

export const handleFollowUser = async (followerUserId, followedUserId) => {
  // Check if the follow relationship already exists
  const existingFollow = await Follow.findOne({
    followerUserId: followerUserId,
    followedUserId: followedUserId,
  });
  if (existingFollow) {
    const logMessage = `User ${followerUserId} is already following ${followedUserId}`;
    logger.warn(logMessage);
    throw new Error(logMessage);
  }

  // Add the follow relationship to the Follow collection
  await Follow.create({
    followerUserId: followerUserId,
    followedUserId: followedUserId,
  });

  logger.info(`User ${followerUserId} is now following ${followedUserId}`);
  return true;
};

// Function to unfollow a user
export const handleUnfollowUser = async (followerUserId, followedUserId) => {
    try {
      // Remove the follow relationship from the Follow collection
      const removedFollow = await Follow.findOneAndDelete({
        followerUserId: followerUserId,
        followedUserId: followedUserId
      });
  
      if (removedFollow) {
        logger.info(`User ${followerUserId} has unfollowed ${followedUserId}`);
      } else {
        logger.warn(`User ${followerUserId} was not following ${followedUserId}`);
      }
    } catch (err) {
      logger.error('Error occurred while unfollowing user:', err);
    }
}

// Function to get followers of a user
export const getMyFollowData =  async (followerUserId, includeDetails) =>  {
  try {
    const followingsData = await Follow.find({ followerUserId: followerUserId }).populate(includeDetails ? "followedUserId" : undefined);
    const followersData = await Follow.find({ followedUserId: followerUserId }).populate(includeDetails ? "followerUserId" : undefined);

    return {followings : followingsData.map(follow => follow.followedUserId), followers : followersData.map(follow => follow.followerUserId)}
  } catch (err) {
    logger.error("Error occurred while getting followers for user ", followerUserId, err);
  }
}