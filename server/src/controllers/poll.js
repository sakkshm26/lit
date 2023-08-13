import { prisma } from "../prisma.js";
import { sendMessage } from "./firebase.js";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export const answerPoll = async (req, res) => {
  const user_id = req.user_id;
  const {
    question_num,
    user_id_to_vote,
    phone,
    question_id,
    option1,
    option2,
    option3,
    option4,
    skip,
  } = req.body;

  console.log(req.body);

  try {
    let poll, tokens_earned;

    if (question_num === 1 && skip) {
      poll = await prisma.poll.update({
        where: {
          id: user_id,
        },
        data: {
          questions_viewed_num: 1,
          started_by_user: true,
        },
      });

      return res.status(200).json({ poll });
    }

    if (question_num === 12 && skip) {
      poll = await prisma.poll.findUnique({
        where: {
          id: user_id,
        },
        include: {
          questions: {
            select: {
              id: true,
            },
          },
        },
      });

      let poll_questions = poll.questions;

      tokens_earned = poll.questions_completed_num * 2;

      let user = await prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          tokens: { increment: tokens_earned },
        },
      });

      poll = await prisma.poll.update({
        where: {
          id: user_id,
        },
        data: {
          questions_viewed_num: 0,
          questions_completed_num: 0,
          last_completed_date: new Date(),
          available: false,
          started_by_user: false,
          questions: {
            disconnect: poll_questions,
          },
        },
      });

      return res.status(200).json({ poll, tokens_earned });
    }

    if (skip) {
      poll = await prisma.poll.update({
        where: {
          id: user_id,
        },
        data: {
          questions_viewed_num: { increment: 1 },
        },
      });

      return res.status(200).json({ poll });
    }

    if (question_num === 1) {
      poll = await prisma.poll.update({
        where: {
          id: user_id,
        },
        data: {
          questions_viewed_num: 1,
          questions_completed_num: 1,
          started_by_user: true,
        },
      });
    } else if (question_num === 12) {
      poll = await prisma.poll.findUnique({
        where: {
          id: user_id,
        },
        include: {
          questions: {
            select: {
              id: true,
            },
          },
        },
      });

      let poll_questions = poll.questions;

      tokens_earned = poll.questions_completed_num * 2 + 2;

      let user = await prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          tokens: { increment: tokens_earned },
        },
      });

      poll = await prisma.poll.update({
        where: {
          id: user_id,
        },
        data: {
          questions_viewed_num: 0,
          questions_completed_num: 0,
          last_completed_date: new Date(),
          available: false,
          started_by_user: false,
          questions: {
            disconnect: poll_questions,
          },
        },
      });
    } else {
      poll = await prisma.poll.update({
        where: {
          id: user_id,
        },
        data: {
          questions_viewed_num: { increment: 1 },
          questions_completed_num: { increment: 1 },
        },
      });
    }

    let vote = await prisma.vote.create({
      data: {
        created_by_user_id: user_id,
        created_for_user_id: user_id_to_vote,
        option1,
        option2,
        option3,
        option4,
        question_id,
      },
    });

    if (user_id_to_vote) {
      let created_for_user = await prisma.user.findUnique({
        where: {
          id: user_id_to_vote,
        },
        select: {
          fcm_token: true,
        },
      });

      if (created_for_user.fcm_token?.length) {
        sendMessage(
          created_for_user.fcm_token,
          "You just got rizzed!",
          "Tap to see who has chosen you."
        );
      }
    }

    res.status(200).json({ poll, tokens_earned: tokens_earned });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const revealPoll = async (req, res) => {
  const { vote_id } = req.body;

  try {
    let vote = await prisma.vote.findUnique({
      where: {
        id: vote_id,
      },
      select: {
        revealed: true,
        created_by_user: {
          select: {
            first_name: true,
          },
        },
      },
    });

    if (vote.revealed) {
      return res.status(200).json({
        hint: vote.created_by_user.first_name[0],
        already_revealed: true,
      });
    }

    let reveal = await prisma.reveal.update({
      where: {
        id: req.user_id,
      },
      data: {
        remaining_hints: {
          decrement: 1,
        },
      },
    });

    vote = await prisma.vote.update({
      where: {
        id: vote_id,
      },
      data: {
        revealed: true,
      },
      select: {
        created_by_user: {
          select: {
            first_name: true,
          },
        },
      },
    });

    res.status(200).json({
      hint: vote.created_by_user.first_name[0],
      already_revealed: false,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getPollQuestions = async (req, res) => {
  const user_id = req.user_id;

  try {
    let poll = await prisma.poll.findUnique({
      where: {
        id: user_id,
      },
      include: {
        questions: true,
      },
    });

    if (!poll.questions.length && poll.available === true) {
      const questions =
        await prisma.$queryRaw`SELECT id FROM "question" ORDER BY RANDOM() LIMIT 12;`;
      poll = await prisma.poll.update({
        where: {
          id: user_id,
        },
        data: {
          started_by_user: true,
          questions: {
            connect: questions,
          },
        },
        include: {
          questions: true,
        },
      });
    }

    res.status(200).json({ poll });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getPollOptions = async (req, res) => {
  const user_id = req.user_id;

  try {
    const friends_count = await prisma.friends.count({
      where: {
        OR: [
          {
            friend_who_accepted_id: user_id,
          },
          {
            friend_who_added_id: user_id,
          },
        ],
      },
    });

    let skip;

    if (friends_count <= 12) {
      skip = 0;
    } else {
      skip = Math.floor(Math.random() * (friends_count - 11));
    }

    let options = await prisma.friends.findMany({
      where: {
        OR: [
          {
            friend_who_accepted_id: user_id,
          },
          {
            friend_who_added_id: user_id,
          },
        ],
      },
      select: {
        friend_who_accepted_id: true,
        friend_who_accepted: {
          select: {
            first_name: true,
            last_name: true,
            profile_image: true,
          },
        },
        friend_who_added_id: true,
        friend_who_added: {
          select: {
            first_name: true,
            last_name: true,
            profile_image: true,
          },
        },
      },
      orderBy: [
        {
          friend_who_accepted: {
            votes_for_user: {
              _count: "desc",
            },
          },
        },
        {
          friend_who_added: {
            votes_for_user: {
              _count: "desc",
            },
          },
        },
      ],
      skip: skip,
      take: 12,
    });

    options = options.map((option) =>
      option.friend_who_accepted_id === user_id
        ? {
            id: option.friend_who_added_id,
            first_name: option.friend_who_added.first_name,
            last_name: option.friend_who_added.last_name,
            profile_image: option.friend_who_added.profile_image,
          }
        : {
            id: option.friend_who_accepted_id,
            first_name: option.friend_who_accepted.first_name,
            last_name: option.friend_who_accepted.last_name,
            profile_image: option.friend_who_accepted.profile_image,
          }
    );

    options = shuffleArray(options);

    res.status(200).json({ options });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const sendNewPollNotification = async (req, res) => {
  const user_id = req.user_id;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      select: {
        fcm_token: true,
      },
    });

    if (user.fcm_token) {
      sendMessage(user.fcm_token, "No more waiting ⏰", "New polls are available.");
    }

    res.status(200).json({ fcm_token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
