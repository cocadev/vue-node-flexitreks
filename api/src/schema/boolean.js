export default (error = 'Supply content', required = true) => {
  const optional = required ? false : { options: { nullable: true } };
  return {
    errorMessage: error,
    isBoolean: true,
    optional
  };
};
