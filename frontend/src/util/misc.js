function applyToOneOrMany(args, callback) {
  return Array.isArray(args) ? args.map(arg => callback(arg)) : callback(args);
}

export {
  applyToOneOrMany
};