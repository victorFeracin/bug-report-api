const bugService = require("../services/bugService");

function createBug(req, res) {
  const bug = bugService.createBugReport(req.validatedBug);

  return res.status(201).json(bug);
}

module.exports = {
  createBug,
};
