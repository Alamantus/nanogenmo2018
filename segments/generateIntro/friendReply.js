module.exports = (person, story, describe = true) => {
  let output = '';

  switch (person.personality) {
    default: {
      output += 'Though hesitant at first,';
      break;
    }
    case 'sweet':
    case 'kind': {
      output += 'Ever eager to help,';
      break;
    }
    case 'mean':
    case 'salty': {
      output += 'Though incredulous at the mere suggestion,';
      break;
    }
  }

  output += ` ${describe ? person.describe(true) : person.pronoun.subject} agreed to join ${story.protagonist.name}.\n\n`;

  switch (person.personality) {
    default: {
      output += `"I hope we are able to do some good," ${person.name} said.`;
      break;
    }
    case 'sweet':
    case 'kind': {
      output += `"This is a good thing we are setting out to do," ${person.name} ${person.personality == 'sweet' ? 'chirped' : 'smiled'}.`;
      break;
    }
    case 'mean':
    case 'salty': {
      output += `"I hope you don't get us all killed," ${person.name} ${person.personality == 'mean' ? 'yelled' : 'grumbled'}.`;
      break;
    }
  }

  output += '\n\n';

  switch (story.protagonist.personality) {
    default: {
      switch (person.personality) {
        default: {
          output += `"I am certain that we will help many people. Thank you for joining me,"`;
          break;
        }
        case 'sweet':
        case 'kind': {
          output += `"Thank you so much! This will bring much peace to many people,"`;
          break;
        }
        case 'mean':
        case 'salty': {
          output += `"It might not be a great time for us, but it'll definitely help people,"`;
          break;
        }
      }
      output += ` ${story.protagonist.name} replied.`;
      break;
    }
    case 'sweet':
    case 'kind': {
      switch (person.personality) {
        default: {
          output += `"Thank you so much! This will bring much peace to many people,"`;
          break;
        }
        case 'sweet':
        case 'kind': {
          output += `"You are so wonderful! I am so excited to travel with you and help the people of ${story.worldName},"`;
          break;
        }
        case 'mean':
        case 'salty': {
          output += `"Don't you worry, sour puss. This will be a great experience, and we will help many people!"`;
          break;
        }
      }
      output += ` ${story.protagonist.name} ${story.protagonist.personality == 'sweet' ? 'beamed' : 'nodded in appreciation'}.`;
      break;
    }
    case 'mean':
    case 'salty': {
      switch (person.personality) {
        default: {
          output += `"Don't act too excited, eager beaver. We've got a long journey ahead of us,"`;
          break;
        }
        case 'sweet':
        case 'kind': {
          output += `"Maybe so, but it won't be a comfortable journey. Get ready for a hard ride,"`;
          break;
        }
        case 'mean':
        case 'salty': {
          output += `"Yeah me too, but if we don't do something, we'll be in deep trouble!"`;
          break;
        }
      }
      output += ` ${story.protagonist.name} ${story.protagonist.personality == 'mean' ? 'spat' : 'frowned'} in reply.`;
      break;
    }
  }

  output += '\n\n';

  return output;
}