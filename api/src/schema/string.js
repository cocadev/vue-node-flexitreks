export default (error, required = true, escape = true) => {
  return {
    errorMessage: error,
    trim: true,
    escape,
    isLength: {
      options: { min: required ? 2 : 0, max: 255 }
    }
  };
};
