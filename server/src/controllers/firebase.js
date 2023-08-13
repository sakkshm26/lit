import admin from "firebase-admin";
import {serviceAccount} from "../services/index.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendMessage = async (fcm_token, title, body) => {
  let payload = {
    notification: {
      title: title,
      body: body,
    },
    token: fcm_token
  };

  admin.messaging().send(payload).then((result) => {
    console.log("result", result);
  }).catch(err => console.log(err));
};
