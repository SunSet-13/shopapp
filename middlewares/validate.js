const validate = (requestType) => {
  return (req, res, next) => {
    const { error } = requestType.validate(req.body); // Validate the request body against the schema
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        error: error.details[0].message, // Return the first validation error message
      });
    }
    next(); // If validation passes, proceed to the next middleware or route handler
  };
};
export default validate;