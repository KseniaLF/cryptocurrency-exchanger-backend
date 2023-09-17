const HttpError = require("../HttpError");
const sendEmail = require("../Mail");

const sendVerificationEmail = async (to, verificationCode) => {
  try {
    await sendEmail({
      to,
      subject: "Verify code",
      html: `<p>Code: ${verificationCode}</p`,
    });

    return true;
  } catch (error) {
    throw new HttpError(500, "Email sending failed");
  }
};

module.exports = sendVerificationEmail;
