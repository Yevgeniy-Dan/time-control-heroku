const { mongoUri, port } = require("./config/config");
const path = require("path");
const qs = require("qs");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const User = require("./models/user");

const app = express();

const adminRoutes = require("./routes/admin");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "../client/build")));

// app.post("*", (req, res) => {
//   res.json({
//     // req: qs.stringify({ af: { asd: 123, asfasf: "Asd" }, sd: "123" }),
//     req: qs.parse(req.body.todo),
//   });
// });

app.use((req, res, next) => {
  User.findById("63ad892e80430b9c48e9df81")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);

app.get("*", (req, res, next) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

mongoose
  .connect(mongoUri)
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Jack",
          email: "jack@test.gmal",
        });

        user.save();
      }
    });
    app.listen(port);
  })
  .catch((err) => console.log(err));
