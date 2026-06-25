const { where } = require("sequelize");
const { User } = require("../models");
const bcrypt = require("bcryptjs");

/**
 * AuthController
 * Handles all logic for registration, login, and logout.
 */
class AuthController {
  /**
   * Render the registration page.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getRegister(req, res) {
    try {
      const dummyData = { error: null };
      res.render("register", dummyData);
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  /**
   * Handle the submission of the registration form.
   * @param {Object} req - Express request object (Should contains req.body.email, req.body.password)
   * @param {Object} res - Express response object
   */
  static async postRegister(req, res) {
    try {
      const { email, password } = req.body;
      await User.create({ email, password, role: "student" });
      res.redirect("/login");
      /*
       * TODO: CREATE A NEW USER
       * 1. Get `email` and `password` from `req.body`.
       * 2. Use `await User.create({ email, password, role: 'student' })`.
       *    NOTE: Your password will be automatically hashed because of the `beforeCreate` hook you wrote in `models/user.js`!
       * 3. Redirect them to `/login` upon success.
       *
       * KEYWORDS TO GOOGLE: "Sequelize model create", "Express req.body"
       * DOCS: https://sequelize.org/docs/v6/core-concepts/model-instances/#creating-an-instance
       */

      // Dummy redirect to keep app flowing
      res.redirect("/login");
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        return res.render("register", { error: err.errors[0].message });
      }
      if (err.name === "SequelizeValidationError") {
        return res.render("register", { error: "Email sudah terdaftar" });
      }
      /*
       * TODO: HANDLE SEQUELIZE VALIDATION ERRORS
       * If the user submits an invalid email, Sequelize throws a `SequelizeValidationError`.
       * You must catch this, extract `err.errors[0].message`, and pass it to `res.render('register', { error: extractedMessage })`.
       *
       * PITFALL: Do not `res.send(err)` to the client! You must render the error nicely on the page.
       */

      const dummyErrorData = {
        error: "Dummy register error. Build the validation logic!",
      };
      res.render("register", dummyErrorData);
    }
  }

  /**
   * Render the login page.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getLogin(req, res) {
    try {
      const error = req.query.error;
      /*
       * TODO: HANDLE REDIRECT ERRORS
       * If an unauthorized user is redirected here by a global middleware, they will likely
       * receive an error in the query string (e.g., `/login?error=Please+login+first`).
       * Extract `req.query.error` and pass it to the view below so the message renders on the screen!
       */
      const dummyData = { error: null };
      res.render("login", dummyData);
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  /**
   * Handle the submission of the login form.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async postLogin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.render("login", { error: "Email atau password salah" });
      }
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.render("login", { error: "Email atau password salah" });
      }

      /*
       * TODO: AUTHENTICATE THE USER
       * 1. Extract `email` and `password` from `req.body`.
       * 2. Find the user: `const user = await User.findOne({ where: { email } })`.
       * 3. If the user exists, compare passwords: `bcrypt.compareSync(password, user.password)`.
       * 4. If true, set `req.session.userId = user.id` and `req.session.role = user.role`.
       *    // [REQ: Explore - 1. Membuat sistem login dengan middleware, session & bcryptjs]
       *
       * KEYWORDS TO GOOGLE: "bcryptjs compareSync", "express-session store data"
       *
       * PITFALL: NEVER store the whole `user` object in the session! It will bloat your server memory.
       * Only store simple strings/numbers like `userId` and `role`.
       */

      // Dummy logic to keep app flowing
      req.session.userId = 999;
      req.session.role = "instructor"; // Or 'student'

      if (req.session.role === "instructor") {
        res.redirect("/instructor");
      } else {
        res.redirect("/student");
      }
    } catch (err) {
      const dummyErrorData = {
        error: "Dummy login error. Build the auth logic!",
      };
      res.render("login", dummyErrorData);
    }
  }

  /**
   * Handle user logout and session destruction.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async logout(req, res) {
    try {
      req.session.destroy();
      /*
       * TODO: DESTROY SESSION
       * Use `req.session.destroy()` and then redirect to `/login`.
       */

      res.redirect("/login");
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }
}

module.exports = AuthController;
