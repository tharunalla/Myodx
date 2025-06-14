// In error.js (utility to create errors)
export const createError = (status, message) => {
  const err = new Error(message); // Passing message to the Error constructor
  err.status = status;
  return err;
};
