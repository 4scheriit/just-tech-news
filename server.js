const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const app = express();
const PORT = process.env.PORT || 3001;

// Import Sequelize and create a session store
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// Configure the session
const sess = {
  secret: "Super secret secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// Use the session middleware
app.use(session(sess));

// Import helper functions
const helpers = require("./utils/helpers");

// Create an instance of the handlebars engine with helpers
const hbs = exphbs.create({ helpers });

// Set the view engine to use handlebars
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Parse incoming JSON data and form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Import and use the controllers
app.use(require("./controllers/"));

// Sync Sequelize models and start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
