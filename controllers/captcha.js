const axios = require("axios");
const { HttpError } = require("../helpers");
const ctrlWrapper = require("../decorators/ctrlWrapper");

const postCaptcha = async (req, res, next) => {
  const body = req.body;

  const { secret, response } = body;
  const postData = `secret:${secret}\nresponse:${response}`;

  const captchaResponse = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    postData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (captchaResponse.status === 200) {
    res.status(200).json(captchaResponse.data);
  } else {
    throw new HttpError(
      captchaResponse.status,
      "Request to external site failed"
    );
  }
};

module.exports = {
  postCaptcha: ctrlWrapper(postCaptcha),
};
