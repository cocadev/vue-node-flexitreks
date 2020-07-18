export default (error, required = true) => {
  const optional = required ? false : { options: { nullable: true, checkFalsy: true } };
  return {
    errorMessage: error,
    isInt: true,
    toInt: true,
    optional
  };
};
