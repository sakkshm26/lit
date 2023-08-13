import { prisma } from "../prisma.js";
import { s3, upload } from "../aws/s3.js";

export const getInstitutesByState = async (req, res) => {
  const { type, state_id, search_value } = req.params;
  console.log(type, state_id, search_value);
  try {
    let institutes;

    if (search_value !== "null") {
      institutes = await prisma.institute.findMany({
        where: {
          state_id,
          name: {
            contains: search_value,
            mode: "insensitive",
          },
          type
        },
        include: {
          city: {
            select: {
              name: true,
            },
          },
          state: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              students: true,
            },
          },
        },
        orderBy: [
          {
            students: {
              _count: "desc",
            },
          },
          {
            name: "asc",
          },
        ],
        take: 20,
      });
    } else {
      institutes = await prisma.institute.findMany({
        where: {
          state_id,
          type
        },
        include: {
          city: {
            select: {
              name: true,
            },
          },
          state: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              students: true,
            },
          },
        },
        orderBy: [
          {
            students: {
              _count: "desc",
            },
          },
          {
            name: "asc",
          },
        ],
        take: 20,
      });
    }

    res.status(200).json({ institutes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUsersByInstitute = async (req, res) => {
  const { id: institute_id, last_user_id } = req.params;
  try {
    let users;

    if (last_user_id === "null") {
      users = await prisma.user.findMany({
        where: {
          institute_id,
        },
        include: {
          _count: {
            select: {
              friends_added_by_user: true,
              friends_added_user: true,
            },
          },
        },
        take: 20,
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
      });
    } else {
      users = await prisma.user.findMany({
        where: {
          institute_id,
        },
        include: {
          _count: {
            select: {
              friends_added_by_user: true,
              friends_added_user: true,
            },
          },
        },
        take: 20,
        skip: 1,
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
        cursor: {
          id: last_user_id,
        },
      });
    }

    /* users.sort((a, b) => {
        if (
          a._count.friends_added_by_user + a._count.friends_added_user <
          b._count.friends_added_by_user + b._count.friends_added_user
        )
          return 1;
        if (
          a._count.friends_added_by_user + a._count.friends_added_user >
          b._count.friends_added_by_user + b._count.friends_added_user
        )
          return -1;
        return 0;
      }); */

    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const uploadImageOnSignup = async (req, res) => {
  const {user_id} = req.params;
  try {
    const uploadSingle = upload().single("image");

    uploadSingle(req, res, async (err) => {
      if (err) {
        console.log("err", err);
        return res.status(400).json({ success: false, message: err.message });
      }

      const user = await prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          profile_image: req.file.location,
        },
        select: {
          profile_image: true
        },
      });

      res.status(200).json({ user });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
