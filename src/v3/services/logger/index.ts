const logger = {
  info: (identifier, message) => {
    console.log(`[${identifier}]`, message);
  },

  warn: (identifier, message) => {
    console.warn(`[${identifier}]`, message);
  },

  error: (identifier, message) => {
    console.error(`[${identifier}]`, message);
  },
};

export default logger;
