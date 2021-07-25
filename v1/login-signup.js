const router = require("express").Router();
var jwt = require("jsonwebtoken");
const User = require("./model/users");

router.post("/signup", async (req, res) => {
  const fullname = req.body.fullname || "";
  const username = req.body.username || "";
  const email = req.body.email || "";
  const password = req.body.password || "";

  var isValidate = validateEmpty(res, req, [
    "fullname",
    "username",
    "email",
    "password",
  ]);

  if (isValidate["validate"]) {
    const newUser = new User({
      fullname: fullname,
      username: username,
      email: email,
      password: password,
    });

    await newUser
      .save()
      .then((user) => {
        res.send(user);
      })
      .catch((error) => {
        //console.log(error);
        if (error.code === 11000) {
          res
            .json({
              message:
                "Duplicate key error. ( username and email must be unique. )",
            })
            .status(400);
        } else {
          res
            .json({
              message: "Bad Request",
            })
            .status(400);
        }
      });
  } else {
    res.send(isValidate);
  }
});

/**
 * Helper Fucntion
 *
 * @function validateEmpty
 * @param requiredField ( array )
 * @return boolean
 *
 * Defination :
 * Use with route to check/validate required field.
 */

function validateEmpty(res, req, requiredField) {
  var validate_data = {};

  validate_data = {
    required: "All Good",
    validate: true,
  };

  requiredField.forEach((element) => {
    if (!req.body.hasOwnProperty(element)) {
      validate_data = {
        required: "Field " + element + " is requried",
        validate: false,
      };
    } else {
      if (req.body[element] == "") {
        validate_data = {
          required: "Field " + element + " must not be null.",
          validate: false,
        };
      }
    }
  });

  return validate_data;
}

router.post("/login", async (req, res) => {
  // const user = {
  //   id: 1,
  //   username: "ramiz",
  //   email: "ramiz.gameti534@gmail.com",
  // };

  const username = req.body.username || "";
  const password = req.body.password || "";

  var isValidate = validateEmpty(res, req, ["username", "password"]);

  if (isValidate) {
    await User.find({
      username: username,
      password: password,
    })
      .then((get_user) => {
        if (Object.keys(get_user).length !== 0) {
          jwt.sign(
            { get_user },
            "secretkey",
            // { expiresIn: "30s" },
            (err, token) => {
              res.json({
                token,
                get_user,
              });
            }
          );

          //res.json(get_user);
        } else {
          res.json({
            message: "No user found...!",
          });
        }
      })
      .catch((err) => {
        res.json(err);
      });
  } else {
    res.send(isValidate);
  }

  // jwt.sign({ user }, "secretkey", { expiresIn: "30s" }, (err, token) => {
  //   res.json({
  //     token,
  //   });
  // });
});

// router.post("/create-post", verifyToken, (req, res) => {
//   jwt.verify(req.token, "secretkey", (err, authData) => {
//     if (err) {
//       res.json(err);
//     } else {
//       res.json({
//         message: "Post Created...!",
//         authData,
//       });
//     }
//   });
// });

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ");

    const bearerToken = bearer[1];

    req.token = bearerToken;

    next();
  } else {
    res.status(403).json({
      message: "bearerToken not found.",
    });
  }
}

module.exports = router;
