const { startCase } = require('lodash');


// Default message builders
function getRequiredMsg(field) {
  return `${startCase(field)} is required`;
}

function getLenMsg(field, [min, max]) {
  const boundsConfig = `${+(!!min)}${+(max != null)}`;
  let phrase;
  switch (boundsConfig) {
    case '01':
      phrase = `up to ${max}`;
      break;
    case '10':
      phrase = `at least ${min}`;
      break;
    case '11':
      phrase = `between ${min} and ${max}`;
  }

  return `${startCase(field)} must be ${phrase} characters long`;
}

function getEmailMsg() {
  return 'Please enter a valid email address';
}

function getIsInMsg(field, [values]) {
  return `${startCase(field)} must be one of ${values.join(', ')}`;
}

const messages = {
  len: getLenMsg,
  required: getRequiredMsg,
  isEmail: getEmailMsg,
  isIn: getIsInMsg
};

// Build 'validate' for a model
function buildValidate(validations, field) {
  const validate = {};
  validations.forEach(v => {
    const isPrimitive = typeof v === 'string';
    const vName = isPrimitive ? v : v.name;
    const vFields = vName === 'required' ? ['notNull', 'notEmpty'] : [vName];
    vFields.forEach(vField => {
      const vObj = { msg: v.msg || messages[vName](field, v.args) };
      if (v.args) {
        vObj.args = v.args;
      }
      validate[vField] = vObj;
    });
  });

  return validate;
}


module.exports = {
  buildValidate,
  messages
};