const validateGenerateCode = (req, res, next) => {
  const { name, designation, duration } = req.body;

  if (!name || !designation || !duration) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  next();
};

module.exports = { validateGenerateCode };
