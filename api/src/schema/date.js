export default (error, required = true) => {
  return {
    errorMessage: error,
    optional: !required,
    isISO8601: true
  };
};
