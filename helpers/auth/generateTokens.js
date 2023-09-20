const jwt = require("jsonwebtoken");

const { SECRET_KEY, REFRECH_SECRET_KEY } = process.env;

// const EXPIRATION_TIME_ACCESS = "2m";
// const EXPIRATION_TIME_REFRESH = "23h";

const generateTokens = (id) => {
  const payload = { id };

  const accessToken = jwt.sign(payload, SECRET_KEY, {
    expiresIn: 60,
  });
  const refreshToken = jwt.sign(payload, REFRECH_SECRET_KEY, {
    expiresIn: "24h",
  });

  return { token: accessToken, refreshToken };
};

module.exports = generateTokens;
