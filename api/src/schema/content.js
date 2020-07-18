import sanitizeHtml from 'sanitize-html';

export default (error = 'Supply content') => {
  return {
    errorMessage: error,
    trim: true,
    isLength: {
      options: { max: 5000 }
    },
    escape: false,
    customSanitizer: {
      options: (value) => {
        return sanitizeHtml(value, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h2', 'figure', 'figcaption', 'img'])
        });
      }
    }
  };
};
