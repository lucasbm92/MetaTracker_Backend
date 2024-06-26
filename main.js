const express = require("express");

require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());

require("./config");

app.use(express.urlencoded({ extended: false }));

const jwt = require("jsonwebtoken");

app.use(cookieParser());

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

function authenticateToken(req, res, next) {
  const token = req.cookies.accessToken;

  if (token == null) return res.redirect("login");

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.redirect("login");
    req.user = user;
    next();
  });
}

app.get("/", authenticateToken, (req, res) => {
  if (req.user.tipo === 0) {
    res.render("homealuno");
  } else {
    res.render("homeprofessor");
  }
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  //const error = req.query.error ? req.query.error : null;
  //res.render("login", { error: error });

  if (req.user) {
    if (req.user.tipo === 0) {
      return res.redirect("/");
    } else if (req.user.tipo === 1) {
      return res.redirect("/");
    }
  } else {
    res.render("login");
  }
});

app.get("/errologin", (req, res) => {
  res.render("errologin");
});

app.get("/novameta", authenticateToken, (req, res) => {
  if (req.user.tipo === 1) {
    res.render("novameta");
  } else {
    res.render("homealuno");
  }
});

app.get("/homealuno", authenticateToken, (req, res) => {
  if (req.user.tipo === 0) {
    res.render("homealuno");
  } else {
    res.render("homeprofessor");
  }
});

app.get("/homeprofessor", authenticateToken, (req, res) => {
  if (req.user.tipo === 1) {
    res.render("homeprofessor");
  } else {
    res.render("homealuno");
  }
});

app.get("/metasaluno", authenticateToken, (req, res) => {
  if (req.user.tipo === 0) {
    res.render("metasaluno");
  } else {
    res.render("metasprofessor");
  }
});

app.get("/metasprofessor", authenticateToken, (req, res) => {
  if (req.user.tipo === 1) {
    res.render("metasprofessor");
  } else {
    res.render("metasaluno");
  }
});

module.exports = { authenticateToken };

const userRoutes = require("./routes/userRoutes");
const metaRoutes = require("./routes/metaRoutes");

app.use(userRoutes);
app.use(metaRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
