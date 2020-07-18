export default (error = 'Supply a telephone number', required = true) => {
  return {
    errorMessage: error,
    trim: true,
    escape: true,
    isLength: {
      options: { min: required ? 2 : 0, max: 30 }
    }
  };
};
