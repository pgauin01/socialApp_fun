const { db } = require("../util/admin");

exports.getAllScreams = (request, response) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          ...doc.data(),
        });
      });
      return response.json(screams);
    })
    .catch((err) => {
      console.error(err);
      response.status(500).json({ error: err.code });
    });
};

exports.postOneScream = (request, response) => {
  if (request.body.body.trim() === "") {
    return response.status(400).json({ body: "Body must not be empty" });
  }
  const newScream = {
    body: request.body.body,
    userHandle: request.user.handle,
    userImage: request.user.imageUrl,
    createdAt: new Date().toISOString(),
    likesCount: 0,
    commentsCount: 0,
    // userImage: doc.data().userImage,
  };
  return db
    .collection("screams")
    .add(newScream)
    .then((doc) => {
      const resScream = newScream;
      resScream.screamId = doc.id;
      response.json(resScream);
    })
    .catch((err) => {
      response.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};

//fetch one scream
exports.getScream = (request, response) => {
  let ScreamData = {};
  db.doc(`/screams/${request.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Scream not found!!!!!!" });
      }
      ScreamData = doc.data();
      ScreamData.screamId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("screamId", "==", request.params.screamId)
        .get();
    })
    .then((data) => {
      ScreamData.comments = [];
      data.forEach((doc) => {
        ScreamData.comments.push(doc.data());
      });
      return response.json(ScreamData);
    })
    .catch((err) => {
      console.error(err);
      response.status(500).json({ error: err.code });
    });
};

//comment on scream
exports.commentOnScream = (request, response) => {
  if (request.body.body.trim() === "")
    return response.status(400).json({ comment: "Must not be empty" });

  const newComment = {
    body: request.body.body,
    createdAt: new Date().toISOString(),
    screamId: request.params.screamId,
    userHandle: request.user.handle,
    userImage: request.user.imageUrl,
  };
  db.doc(`/screams/${request.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Scream not found" });
      }
      return doc.ref.update({ commentsCount: doc.data().commentsCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      response.json(newComment);
    })
    .catch((err) => {
      console.error(err);
      response.status(500).json({ error: err.code });
    });
};

exports.likeScream = (request, response) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", request.user.handle)
    .where("screamId", "==", request.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/screams/${request.params.screamId}`);
  let ScreamData;
  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        ScreamData = doc.data();
        ScreamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        return response.status(404).json({ error: "scream not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            screamId: request.params.screamId,
            userHandle: request.user.handle,
          })
          .then(() => {
            ScreamData.likesCount++;
            return screamDocument.update({ likesCount: ScreamData.likesCount });
          })
          .then(() => {
            return response.json(ScreamData);
          });
      } else {
        return response.status(400).json({ error: "Scream Already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      response.status(500).json({ error: err.code });
    });
};

exports.getAllLikes = (request, response) => {
  db.collection("likes")
    .where("userHandle", "==", request.user.handle)
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          userHandle: doc.data().userHandle,
          screamId: doc.data().screamId,
        });
      });
      return response.json(screams);
    })
    .catch((err) => {
      console.error(err);
      response.status(500).json({ error: err.code });
    });
};

exports.unlikeScream = (request, response) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", request.user.handle)
    .where("screamId", "==", request.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/screams/${request.params.screamId}`);
  let ScreamData;
  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        ScreamData = doc.data();
        ScreamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        return response.status(404).json({ error: "scream not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return response.status(400).json({ error: "Scream not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            ScreamData.likesCount--;
            return screamDocument.update({ likesCount: ScreamData.likesCount });
          })
          .then(() => {
            response.json(ScreamData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      response.status(500).json({ error: err.code });
    });
};

exports.deleteScream = (request, response) => {
  const document = db.doc(`/screams/${request.params.screamId}`);
  document
    .get()
    .then((doc) => {
      console.log(request.user.handle);
      if (!doc.exists) {
        return response.status(404).json({ error: "scream not found" });
      }
      if (doc.data().userHandle !== request.user.handle) {
        return response.status(403).json({ error: "unauthorised" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      response.json({ message: "scream deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};
