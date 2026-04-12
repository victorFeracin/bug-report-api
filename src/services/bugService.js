const { v4: uuidv4 } = require("uuid");
const bugs = require("../data/bugs");

function createBugReport(bugData) {
  const newBug = {
    id: uuidv4(),
    ...bugData,
    createdAt: new Date().toISOString(),
  };

  bugs.push(newBug);

  return newBug;
}

module.exports = {
  createBugReport,
};
