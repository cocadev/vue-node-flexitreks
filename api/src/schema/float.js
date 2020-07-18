export default (error, required = true) => {
  const optional = required ? false : { options: { nullable: true } };
  return {
    errorMessage: error,
    isFloat: true,
    toFloat: true,
    optional
  };
};
