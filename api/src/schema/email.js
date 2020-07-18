export default (error = 'Supply an email address') => {
  return {
    errorMessage: error,
    trim: true,
    escape: true,
    isEmail: true,
    normalizeEmail: true,
    isLength: {
      options: { min: 2, max: 255 }
    }
  };
};
