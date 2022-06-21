import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
// // firebase deploy --only functions
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// TODO remove
exports.addNameLowerCase = functions.region("europe-west2").firestore
    .document("homes/{homeId}/items/{itemsId}")
    .onCreate((snap) => {
      const incomingData = snap.data();
      const nameLowerCase = incomingData.name.toLowerCase();
      return snap.ref.update({nameLowerCase});
    });

// export const subscribeToTopic = functions.https.onCall(
//     async (data, context) => {
//       admin.messaging().
//       await admin.messaging().subscribeToTopic(data.token, data.topic);
//       return `Subscribed to ${data.topic}`;
//     }
// );

// export const unsubscribeToTopic = functions.https.onCall(
//     async (data, context) => {
//       await admin.messaging().unsubscribeFromTopic(data.token, data.topic);
//       return `Unsubscribed from ${data.topic}`;
//     }
// );

// export const scheduledJob = functions.pubsub.schedule("0 18 20 6")
//     .onRun((context) => {
//       console.log(context.auth?.uid);
//       const notification: admin.messaging.Notification = {
//         title: "Out of date",
//         body: "Out of date body",
//       };

//       const payload: admin.messaging.Message = {
//         notification,
//         topic: "outOfDate",
//       };

//       return admin.messaging().send(payload);
//     //   admin.messaging().subscribeToTopic(data.token)
//     });
