const sendEmail = require("../Mail");

const sendVerificationEmail = async (to, verificationCode) => {
  try {
    await sendEmail({
      to,
      subject: "Verify code",
      html: `<p>Code: ${verificationCode}</p`,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

module.exports = sendVerificationEmail;
