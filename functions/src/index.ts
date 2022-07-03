import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const firestore = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
// // firebase deploy --only functions
// // firebase deploy --only functions:functionName
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// TODO figure how to set the functions region in the front end

exports.onUserCreate = functions // .region("europe-west2")
    .auth.user().onCreate((user) => {
      const userRef = firestore.doc(`users/${user.uid}`);
      return userRef.set({
        displayName: user.displayName,
        uid: user.uid,
        email: user.email,
      });
    });

exports.onDisplayNameChange = functions // .regions("europe-west2")
    .firestore.document("users/{userId}")
    .onUpdate(async (change, context) => {
      const oldUserDetail = change.before.data();
      const newUserDetail = change.after.data();

      if (oldUserDetail.displayName === newUserDetail.displayName) return null;

      const batch = firestore.batch();
      const userId: string = context.params.userId;

      const snapshot = await firestore.collection("homes")
          .where(`users.${userId}`, "==", true).get();

      snapshot.forEach(((home) => {
        batch.update(
            home.ref,
            {[`usersDetails.${userId}`]: newUserDetail}
        );
      }));

      try {
        return batch.commit();
      } catch (error) {
        return error; // TODO
      }
    });


exports.addUsersToHomeUsingEmail = functions // .region("europe-west2")
    .https.onCall(async (data, context) => {
      if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Not logged in."
        );
      }

      const homeId = data.homeId;
      const email = data.email;

      // TODO try catch
      const usersSnapshot = await firestore.collection("users")
          .where("email", "==", email).limit(2).get();
      // TODO is limit of 2 above correct?

      if (usersSnapshot.size === 0) {
        throw new functions.https.HttpsError(
            "not-found",
            "Can not find a user with the given email."
        );
      }
      if (usersSnapshot.size > 1) {
        throw new functions.https.HttpsError(
            "out-of-range",
            "More than one user with the current email."
            // Please add user using user ID."
        );
      }

      // if only one user with the email
      const homeDocRef = firestore.doc(`homes/${homeId}`);
      const homeDocSnapshot = await homeDocRef.get();
      const homeData = homeDocSnapshot.data();
      if (!homeData) {
        throw new functions.https.HttpsError(
            "not-found",
            "Home was not found."
        );
      }

      if (!homeData.users[context.auth.uid]) {
        throw new functions.https.HttpsError(
            "permission-denied",
            "You are not a user of this Home"
        );
      }

      const user = usersSnapshot.docs[0].data();
      return homeDocRef.update({
        [`usersDetails.${user.uid}`]: user,
        [`users.${user.uid}`]: true,
      });
    });

// TODO might not need below
// or at least refactor
// exports.updateDisplayNamesToHome = functions // .region("europe-west2")
//     .firestore.document("homes/{homeId}").onWrite(async (change) => {
//       const oldHome = change.before.data();
//       const newHome = change.after.data();
//       if (!oldHome) return null;
//       if (!newHome) return null;
//       if (isUsersObjectTheSame(oldHome, newHome)) return null;
//       // TODO test if we can just check if two Firestore maps are the same

//       const promises = [];
//       for (const userId of Object.keys(newHome.users)) {
//         const p = firestore.doc(`users/${userId}`).get();
//         promises.push(p);
//       }
//       const snapshots = await Promise.all(promises);

//       const displayNames: { [key: string]: string } = {};
//       snapshots.forEach((snap) => {
//         const data = snap.data();
//         if (data) {
//           displayNames[data.uid] = data.displayName;
//         }
//       });

//       return change.after.ref.update({displayNames});
//     });

// // eslint-disable-next-line require-jsdoc
// function isUsersObjectTheSame(
//     obj1: {[key: string]: boolean},
//     obj2: {[key: string]: boolean}
// ): boolean {
//   if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
//   for (const prop of Object.keys(obj1)) {
//     if (obj1[prop] !== obj2[prop]) {
//       return false;
//     }
//   }
//   return true;
// }

// TODO remove
// exports.addNameLowerCase = functions.region("europe-west2").firestore
//     .document("homes/{homeId}/items/{itemsId}")
//     .onCreate((snap) => {
//       const incomingData = snap.data();
//       const nameLowerCase = incomingData.name.toLowerCase();
//       return snap.ref.update({nameLowerCase});
//     });

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
