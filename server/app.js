const { mongoUri, port, clientUri } = require("./config/config");
const path = require("path");
const qs = require("qs");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const User = require("./models/user");

const app = express();

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: clientUri,
  })
);

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const { errorHandler } = require("./middleware/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "../client/build")));

// app.post("*", (req, res) => {
//   res.json({
//     // req: qs.stringify({ af: { asd: 123, asfasf: "Asd" }, sd: "123" }),
//     req: qs.parse(req.body.todo),
//   });
// });

app.use("/admin", adminRoutes);
app.use("/api/users", userRoutes);

app.get("*", (req, res, next) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.use(errorHandler);

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port);
  })
  .catch((err) => console.log(err));
