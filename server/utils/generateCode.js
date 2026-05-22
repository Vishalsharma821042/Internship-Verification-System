/**
 * Generates a random alphanumeric string of a specified length
 * @param {number} length - The length of the verification code
 * @returns {string} - The generated code
 */
const generateVerificationCode = (length = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports = generateVerificationCode;
