import { prisma } from "../prisma.js";
import { s3, upload } from "../aws/s3.js";
import { messageFormatter, yearMap } from "../utils/index.js";

export const checkForContacts = async (req, res) => {
  const user_id = req.user_id;
  const { contacts } = req.body;

  try {
    let contact_numbers = contacts.map((item) => item.phone);

    let users = await prisma.user.findMany({
      where: {
        phone: { in: contact_numbers },
        NOT: { id: user_id },
        friends_added_by_user: {
          none: {
            friend_who_accepted_id: user_id,
          },
        },
        friends_added_user: {
          none: {
            friend_who_added_id: user_id,
          },
        },
        friend_requests_sent: {
          none: {
            friend_request_to_id: user_id,
          },
        },
        friend_requests_received: {
          none: {
            friend_request_by_id: user_id,
          },
        },
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone: true,
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
    });

    users = users.map(user => ({...user, year_of_study: yearMap[user.year_of_study]}))

    let contacts_in_app = users.map((request) => request.phone);
    let contacts_outside = contacts.filter(
      (user) => !contacts_in_app.includes(user.phone)
    );

    res
      .status(200)
      .json({ contacts_on_app: users, contacts_outside: contacts_outside });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUser = async (req, res) => {
  const user_id = req.user_id;

  try {
    let user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      include: {
        poll: {
          include: {
            questions: true,
          },
        },
        _count: {
          select: {
            friends_added_user: true,
            friends_added_by_user: true,
          },
        },
      },
    });

    if (
      new Date().setMinutes(new Date().getMinutes() - 40) >
      new Date(user.poll.last_completed_date)
    ) {
      let poll = await prisma.poll.update({
        where: {
          id: user.id,
        },
        include: {
          questions: true,
        },
        data: {
          available: true,
        },
      });

      user.poll = poll;
    }

    delete user["password"];

    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserForProfile = async (req, res) => {
  const user_id = req.user_id;

  try {
    let user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      select: {
        first_name: true,
        last_name: true,
        year_of_study: true,
        username: true,
        tokens: true,
        profile_image: true,
        _count: {
          select: {
            friends_added_user: true,
            friends_added_by_user: true,
            votes_for_user: true,
          },
        },
        institute: {
          select: {
            name: true,
          },
        },
      },
    });

    let top_votes = await prisma.vote.findMany({
      where: {
        created_for_user_id: user_id,
      },
      orderBy: {
        question_id: "desc",
      },
      select: {
        question: {
          select: {
            text: true,
            emoji: true,
          },
        },
      },
      take: 3,
    });

    top_votes = top_votes.map((vote) => ({
      emoji: vote.question.emoji,
      text: vote.question.text,
    }));

    user.year_of_study = yearMap[user.year_of_study];

    res.status(200).json({ user, top_votes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUsersInSameInstitue = async (req, res) => {
  const user_id = req.user_id;
  const { institute_id, last_user_id } = req.params;

  /* const query_object = {
    where: {
      institute_id: institute_id,
      NOT: { id: user_id },
      friends_added_by_user: {
        none: {
          friend_who_accepted_id: user_id,
        },
      },
      friends_added_user: {
        none: {
          friend_who_added_id: user_id,
        },
      },
      friend_requests_sent: {
        none: {
          friend_request_to_id: user_id,
        },
      },
      friend_requests_received: {
        none: {
          friend_request_by_id: user_id,
        },
      },
    },
    orderBy: [
      {
        friends_added_by_user: {
          _count: "desc",
        },
      },
      {
        friends_added_user: {
          _count: "desc",
        },
      },
      {
        created_at: "desc",
      },
    ],
    take: 20,
  }; */

  try {
    let users;

    users = await prisma.user.findMany({
      where: {
        institute_id: institute_id,
        NOT: { id: user_id },
        friends_added_by_user: {
          none: {
            friend_who_accepted_id: user_id,
          },
        },
        friends_added_user: {
          none: {
            friend_who_added_id: user_id,
          },
        },
        friend_requests_sent: {
          none: {
            friend_request_to_id: user_id,
          },
        },
        friend_requests_received: {
          none: {
            friend_request_by_id: user_id,
          },
        },
      },
      orderBy: [
        {
          friends_added_by_user: {
            _count: "desc",
          },
        },
        {
          friends_added_user: {
            _count: "desc",
          },
        },
        {
          created_at: "desc",
        },
      ],
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
    });

    /* if (last_user_id === "null") {
      users = await prisma.user.findMany({
        ...query_object,
      });
    } else {
      users = await prisma.user.findMany({
        ...query_object,
        skip: 1,
        cursor: {
          id: last_user_id,
        },
      });
    } */

    users = users.map((user) => ({
      ...user,
      year_of_study: yearMap[user.year_of_study],
    }));

    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUsersInSameInstitueBySearch = async (req, res) => {
  const user_id = req.user_id;
  const { institute_id, search_value } = req.params;

  const query_object = {
    where: {
      institute_id: institute_id,
      NOT: { id: user_id },
      friends_added_by_user: {
        none: {
          friend_who_accepted_id: user_id,
        },
      },
      friends_added_user: {
        none: {
          friend_who_added_id: user_id,
        },
      },
      friend_requests_sent: {
        none: {
          friend_request_to_id: user_id,
        },
      },
      friend_requests_received: {
        none: {
          friend_request_by_id: user_id,
        },
      },
    },
    orderBy: [
      {
        friends_added_by_user: {
          _count: "desc",
        },
      },
      {
        friends_added_user: {
          _count: "desc",
        },
      },
      {
        created_at: "desc",
      },
    ],
    take: 20,
  };

  try {
    let users;

    if (search_value === "null") {
      users = await prisma.user.findMany({
        ...query_object,
      });
    } else {
      query_object.where.OR = [
        {
          first_name: {
            contains: search_value,
            mode: "insensitive",
          },
        },
        {
          last_name: {
            contains: search_value,
            mode: "insensitive",
          },
        },
        {
          username: {
            contains: search_value,
            mode: "insensitive",
          },
        },
      ];
      users = await prisma.user.findMany({
        ...query_object,
      });
    }

    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getInboxMessagesForUser = async (req, res) => {
  const user_id = req.user_id;
  const { last_vote_id } = req.params;

  let reveal = await prisma.reveal.findUnique({
    where: {
      id: user_id,
    },
  });

  if (new Date(reveal.last_updated_date).getDate() !== new Date().getDate()) {
    reveal = await prisma.reveal.update({
      where: {
        id: user_id,
      },
      data: {
        last_updated_date: new Date(),
        remaining_hints: 3,
      },
    });
  }

  let query_object = {
    where: {
      created_for_user_id: user_id,
    },
    include: {
      question: true,
      created_by_user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          gender: true,
          year_of_study: true,
        },
      },
      created_for_user: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
    take: 20,
  };

  try {
    let votes;
    if (last_vote_id === "null") {
      votes = await prisma.vote.findMany({
        ...query_object,
      });
    } else {
      votes = await prisma.vote.findMany({
        ...query_object,
        skip: 1,
        cursor: {
          id: last_vote_id,
        },
      });
    }

    let user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      select: {
        reveals: {
          select: {
            remaining_hints: true,
          },
        },
      },
    });

    let messages = votes.map((vote) => ({
      poll: {
        id: vote.id,
        question: { emoji: vote.question.emoji, text: vote.question.text },
        option1: vote.option1,
        option2: vote.option2,
        option3: vote.option3,
        option4: vote.option4,
        created_by_initial_letter: vote.created_by_user.first_name[0],
        created_for: `${vote.created_for_user.first_name} ${vote.created_for_user.last_name}`,
        revealed: vote.revealed,
      },
      message: {
        ...messageFormatter(
          vote.id,
          vote.created_by_user.gender,
          vote.created_by_user.year_of_study
        ),
        viewed: vote.viewed,
      },
    }));

    res.status(200).json({
      messages: messages,
      remaining_hints: user.reveals.remaining_hints,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const refreshFcmToken = async (req, res) => {
  const user_id = req.user_id;
  const { fcm_token } = req.body;
  try {
    const user = await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        fcm_token: fcm_token,
      },
    });
    res.status(200).json({ fcm_token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateInboxMessage = async (req, res) => {
  const { vote_id } = req.body;

  try {
    const vote = await prisma.vote.update({
      where: {
        id: vote_id,
      },
      data: {
        viewed: true,
      },
    });

    res.status(200).json({ message: vote });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const uploadImage = async (req, res) => {
  const id = req.user_id;
  try {
    const uploadSingle = upload().single("image");

    uploadSingle(req, res, async (err) => {
      if (err) {
        console.log("err", err);
        return res.status(400).json({ success: false, message: err.message });
      }

      const user = await prisma.user.update({
        where: {
          id,
        },
        data: {
          profile_image: req.file.location,
        },
        select: {
          first_name: true,
          last_name: true,
          year_of_study: true,
          username: true,
          tokens: true,
          profile_image: true,
          _count: {
            select: {
              friends_added_user: true,
              friends_added_by_user: true,
              votes_for_user: true,
            },
          },
          institute: {
            select: {
              name: true,
            },
          },
        },
      });

      user.year_of_study = yearMap[user.year_of_study];

      res.status(200).json({ user });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
