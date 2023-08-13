import express from "express";
import {
  createFriendRequest,
  createFriends,
  deleteFriendRequest,
  getFriendRequests,
} from "../controllers/index.js";

var router = express.Router();

router.post("/create", createFriends);
router.post("/request/create", createFriendRequest);
router.post("/request/delete", deleteFriendRequest);
router.get("/getlist/requests-received", getFriendRequests);

export default router;
