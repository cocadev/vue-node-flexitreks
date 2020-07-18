export default (error = 'Supply a postcode', required = true) => {
  return {
    errorMessage: error,
    trim: true,
    escape: true,
    optional: !required,
    isPostalCode: {
      options: 'any'
    }
  };
};
