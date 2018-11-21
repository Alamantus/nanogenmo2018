const {capitalize} = require('../../helpers');

module.exports = (target) => {
  let output = '';

  output += `${capitalize(target.name)} succumbed to the pain`;
  switch (target.personality) {
    default: {
      output += ` and fell to ${target.pronoun.possessive} knees.`;
      break;
    }
    case 'sweet': {
      output += `, crying out as ${target.pronoun.subject} fell backwards.`;
      break;
    }
    case 'kind': {
      output += `, dropping to ${target.pronoun.possessive} knees and falling to their side.`;
      break;
    }
    case 'mean': {
      output += `, yelling out in anger as ${target.pronoun.subject} fell.`;
      break;
    }
    case 'salty': {
      output += ` and groaned as ${target.pronoun.subject} slumped backward.`;
      break;
    }
  }
  
  return output;
}