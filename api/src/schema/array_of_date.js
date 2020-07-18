export default (error = 'Supply content') => {
  return {
    errorMessage: error,
    optional: true,
    custom: {
      options: (items) => {
        if (!Array.isArray(items) || items.length > 100) return false;
        items.forEach((item, index) => {
          const n = new Date(item);
          if (isNaN(n.getTime())) items.splice(index, 1);
          else items[index] = n;
        });
        return true;
      }
    }
  };
};
