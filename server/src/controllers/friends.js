import { prisma } from "../prisma.js";
import { sendMessage } from "./firebase.js";

export const createFriends = async (req, res) => {
  const { friend_who_added_id, friend_who_accepted_id } = req.body;

  try {
    const friends = await prisma.friends.create({
      data: {
        friend_who_accepted_id,
        friend_who_added_id,
      },
    });

    const friend_request = await prisma.friend_request.delete({
      where: {
        friend_request_by_id_friend_request_to_id: {
          friend_request_by_id: friend_who_added_id,
          friend_request_to_id: friend_who_accepted_id,
        },
      },
    });

    res.status(200).json({ friends });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createFriendRequest = async (req, res) => {
  try {
    const { friend_request_by_id, friend_request_to_id } = req.body;

    const friend_request = await prisma.friend_request.create({
      data: {
        friend_request_by_id,
        friend_request_to_id,
      },
      include: {
        friend_request_by: {
          select: {
            first_name: true,
          },
        },
        friend_request_to: {
          select: {
            fcm_token: true,
          },
        },
      },
    });

    if (friend_request.friend_request_to.fcm_token?.length) {
      sendMessage(
        friend_request.friend_request_to.fcm_token,
        `${friend_request.friend_request_by.first_name} wants to be your friend`,
        "Tap to accept the request."
      );
    }

    res.status(200).json({ friend_request });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteFriendRequest = async (req, res) => {
  const { friend_request_by_id, friend_request_to_id } = req.body;

  try {
    const friend_request = await prisma.friend_request.delete({
      where: {
        friend_request_by_id_friend_request_to_id: {
          friend_request_by_id,
          friend_request_to_id,
        },
      },
    });

    res.status(200).json({ friend_request });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getFriendRequests = async (req, res) => {
  const user_id = req.user_id;

  try {
    let requests = await prisma.friend_request.findMany({
      where: {
        friend_request_to_id: user_id,
      },
      select: {
        friend_request_by: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            username: true,
            profile_image: true,
            year_of_study: true,
            institute: {
              select: {
                name: true,
              },
            },
            _count: {
              select: {
                votes_for_user: true,
              },
            },
          },
        },
      },
    });

    requests = requests.map((request) => ({...request.friend_request_by, year_of_study: yearMap[request.friend_request_by.year_of_study]}));

    res.status(200).json({ requests });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
