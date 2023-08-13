import express from "express";
import {
  getUser,
  getUserForProfile,
  getUsersInSameInstitue,
  getUsersInSameInstitueBySearch,
  getInboxMessagesForUser,
  uploadImage,
  checkForContacts,
  updateInboxMessage,
  refreshFcmToken,
} from "../controllers/index.js";

var router = express.Router();

router.get("/get", getUser);
router.get("/get/profile", getUserForProfile);
router.get("/getlist/:institute_id/:last_user_id", getUsersInSameInstitue);
router.get(
  "/getlist/search/:institute_id/:search_value",
  getUsersInSameInstitueBySearch
);
router.get("/getlist/votes/for-user/:last_vote_id", getInboxMessagesForUser);
router.post('/image-upload', uploadImage)
router.post('/check-contacts', checkForContacts)
router.post('/update/message', updateInboxMessage)
router.post('/refreshFcm', refreshFcmToken)

export default router;
