import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";
import dotenv from "dotenv";
dotenv.config();

export const checkUniqueUsername = async (req, res) => {
  const { username } = req.body;

  try {
    let existing_user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (existing_user) {
      return res.status(422).json({
        message: "User with same username already exists",
      });
    }

    return res.status(200).json({ message: "Username unique" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const checkUniquePhone = async (req, res) => {
  const { phone, type } = req.body;

  try {
    let existing_user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });
    if (existing_user) {
      if (type === "signup") {
        return res.status(422).json({
          message: "User with same phone number already exists",
        });
      } else {
        return res.status(200).json({
          message: "User with same phone number already exists",
        });
      }
    }

    if (type === "signup") {
      return res.status(200).json({ message: "Phone unique" });
    } else {
      return res.status(404).json({ message: "Phone not registered" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const userSignup = async (req, res) => {
  let {
    first_name,
    last_name,
    username,
    phone,
    age,
    allow_contact_invites,
    institute_id,
    new_institute_name,
    institute_type,
    year_of_study,
    gender,
    friend_ids,
    state_id,
  } = req.body;

  try {
    if (new_institute_name) {
      let institute = await prisma.institute.create({
        data: {
          name: new_institute_name,
          state_id,
          type: institute_type,
          requested_by_user: true,
        },
        select: {
          id: true,
        },
      });
      institute_id = institute.id;
    }

    let user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        username,
        phone,
        age,
        allow_contact_invites,
        institute_id,
        year_of_study,
        gender,
      },
    });

    const poll = await prisma.poll.create({
      data: {
        id: user.id,
      },
    });

    const subscription = await prisma.subscription.create({
      data: {
        id: user.id,
      },
    });

    const reveal = await prisma.reveal.create({
      data: {
        id: user.id,
      },
    });

    if (friend_ids?.length) {
      let formatted_data = friend_ids.map((id) => ({
        friend_request_by_id: user.id,
        friend_request_to_id: id,
      }));
      // console.log(formatted_data);
      let friend_requests = await prisma.friend_request.createMany({
        data: formatted_data,
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "60d",
    });

    res.status(200).json({ id: user.id, institute_id: institute_id, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const userLogin = async (req, res) => {
  const { phone } = req.body;

  try {
    let existing_user;
    existing_user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    const token = jwt.sign(
      { id: existing_user.id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "60d",
      }
    );

    delete existing_user["password"];

    res.status(200).json({
      id: existing_user.id,
      institute_id: existing_user.institute_id,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
