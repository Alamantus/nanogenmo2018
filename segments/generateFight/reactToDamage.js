module.exports = (damageRatio, target) => {
  let output = '';

  if (damageRatio <= 0.2) {
    output += `, but it didn't hurt very much; ${target.name} `;
    switch (target.personality) {
      default: {
        output += 'brushed off the attack like a pro.';
        break;
      }
      case 'sweet': {
        output += 'let out a sigh of relief.';
        break;
      }
      case 'kind': {
        output += 'smiled, laughing it off.';
        break;
      }
      case 'mean': {
        output += 'barked a laugh and flashed a rude gesture.';
        break;
      }
      case 'salty': {
        output += 'let out a bawdy laugh in response.';
        break;
      }
    }
  } else if (damageRatio > 0.2 && damageRatio <= 0.5) {
    output += `, doing a fair amount of damage; ${target.name} `;
    switch (target.personality) {
      default: {
        output += `tried to brush off the attack, but it was clear that ${target.pronoun.subject} felt the pain.`;
        break;
      }
      case 'sweet': {
        output += 'cried out in pain!';
        break;
      }
      case 'kind': {
        output += 'yelled in pain.';
        break;
      }
      case 'mean': {
        output += 'swore loudly.';
        break;
      }
      case 'salty': {
        output += 'grunted loudly through gritted teeth.';
        break;
      }
    }
  } else {
    output += `, and dealt some serious damage! ${target.name} `;
    switch (target.personality) {
      default: {
        output += `could not hide ${target.pronoun.possessive} intense pain.`;
        break;
      }
      case 'sweet': {
        output += 'began crying from the pain.';
        break;
      }
      case 'kind': {
        output += 'hunched over, panting to try to endure the pain.';
        break;
      }
      case 'mean': {
        output += 'swore angrily in pain.';
        break;
      }
      case 'salty': {
        output += 'yelled out in pain, angry at the enemy\'s luck.';
        break;
      }
    }
  }
  
  return output;
}