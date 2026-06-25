const express = require('express');
const session = require('express-session');
const router = require('./routes');
const app = express();
const PORT = 3000;
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const FG_GREEN = '\x1b[32m';
const FG_RED = '\x1b[31m';
const BG_YELLOW = '\x1b[43m';

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

// Session Middleware Setup
app.use(session({
  secret: 'puls8-secret-key-123',
  resave: false,
  saveUninitialized: false
}));

app.use('/', router);

const server = app.listen(PORT, () => {
  const addressObj = server.address();
  const HOST = addressObj.address === '::' ? 'localhost' : addressObj.address;

  const url = `${HOST}:${PORT}`;
  console.log("----------------------------------------------------------------------------");
  console.log(`${BOLD}${FG_RED}Phase 1 | PAIR PROJECT${RESET}`);
  console.log(`${BOLD}${FG_RED}Puls8 - Classroom Tools for Hacktiv8 Instructors and Students${RESET}`);
  console.log("");
  console.log(`${FG_RED}Team 5 - Tim Perwakilan Tarung ${BG_YELLOW}DRAJAT${RESET}`);
  console.log(`${FG_RED}Adrianto Puji Irawan & Su${BG_YELLOW}drajat${RESET} ${BOLD}${FG_RED}Hermanto${RESET}`);
  console.log("");
  console.log(`${FG_GREEN}Server is running on: ${url}${RESET}`);
  console.log("----------------------------------------------------------------------------");
})
