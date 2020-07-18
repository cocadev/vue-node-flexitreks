
export default (error = 'Supply content', microSchema = {}) => {
  return {
    errorMessage: error,
    optional: true,
    custom: {
      options: (items) => {
        if (!Array.isArray(items) || items.length > 100) return false;
        items.forEach((item, index) => {
          try {
            if (typeof item !== 'object') throw new Error();
            const newItem = {};

            Object.keys(microSchema).map(key => {
              const schema = microSchema[key];
              if (schema.required && item[key] === undefined) throw new Error();

              if (item[key] !== undefined) {
                
                
                if (schema.type === Number) {
                  const val = schema.type(item[key]);
                  if (isNaN(val)) {
                    if (schema.required) throw new Error();
                    else delete item[key];
                  } else {
                    item[key] = val;
                  }
                } else {
                  item[key] = schema.type(item[key]);
                }
              }

              if (item[key] !== undefined) newItem[key] = item[key];
            });

            items[index] = newItem;

          } catch (e) {
            items.splice(index, 1);
          }
        });

        return true;
      }
    }
  };
};
