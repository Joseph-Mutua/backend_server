const admin = require("../firebase");

exports.authCheck = async (req, res, next) => {
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);

    console.log("FIREBASE USER IN AUTH CHECK", firebaseUser);
    req.user = firebaseUser;
    next();
  } catch (err) {
    console.log(err.message);
    res.status(401).json({
      // err: err.message
      err: "Invalid or Expired token",
    });
  }
};
