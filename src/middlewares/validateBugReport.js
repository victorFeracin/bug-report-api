const ALLOWED_SEVERITIES = ["low", "medium", "high", "critical"];
const MAX_ATTACHMENTS = 10;

function sanitizeString(value) {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim();
}

function validateRequiredString(value, fieldName, details) {
  if (value === undefined) {
    details.push(`${fieldName} is required.`);
    return null;
  }

  if (typeof value !== "string") {
    details.push(`${fieldName} must be a string.`);
    return null;
  }

  const sanitizedValue = sanitizeString(value);

  if (!sanitizedValue) {
    details.push(`${fieldName} must not be empty.`);
    return null;
  }

  return sanitizedValue;
}

function validateSteps(steps, details) {
  if (steps === undefined) {
    details.push("steps is required.");
    return [];
  }

  if (!Array.isArray(steps)) {
    details.push("steps must be an array.");
    return [];
  }

  if (steps.length === 0) {
    details.push("steps must contain at least 1 item.");
    return [];
  }

  return steps.map((step, index) => {
    const sanitizedStep = validateRequiredString(
      step,
      `steps[${index}]`,
      details
    );

    return sanitizedStep;
  });
}

function validateAttachments(attachments, details) {
  if (attachments === undefined) {
    return [];
  }

  if (!Array.isArray(attachments)) {
    details.push("attachments must be an array.");
    return [];
  }

  if (attachments.length > MAX_ATTACHMENTS) {
    details.push(`attachments must contain at most ${MAX_ATTACHMENTS} items.`);
  }

  return attachments.map((attachment, index) => {
    if (!attachment || typeof attachment !== "object" || Array.isArray(attachment)) {
      details.push(`attachments[${index}] must be an object.`);
      return {
        filename: "",
        url: "",
      };
    }

    return {
      filename: validateRequiredString(
        attachment.filename,
        `attachments[${index}].filename`,
        details
      ),
      url: validateRequiredString(
        attachment.url,
        `attachments[${index}].url`,
        details
      ),
    };
  });
}

function validateBugReport(req, res, next) {
  const details = [];
  const body = req.body || {};

  const title = validateRequiredString(body.title, "title", details);
  const description = validateRequiredString(
    body.description,
    "description",
    details
  );
  const reporter = validateRequiredString(body.reporter, "reporter", details);
  const severity = validateRequiredString(body.severity, "severity", details);
  const steps = validateSteps(body.steps, details);
  const attachments = validateAttachments(body.attachments, details);

  if (severity && !ALLOWED_SEVERITIES.includes(severity)) {
    details.push(
      `severity must be one of: ${ALLOWED_SEVERITIES.join(", ")}.`
    );
  }

  if (details.length > 0) {
    return res.status(400).json({
      message: "Validation error",
      details,
    });
  }

  req.validatedBug = {
    title,
    description,
    reporter,
    severity,
    steps,
    attachments,
  };

  return next();
}

module.exports = validateBugReport;
