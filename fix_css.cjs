const fs = require('fs');
let c = fs.readFileSync('src/index.css', 'utf-8');
c = c.replace(/@theme\s*\{([\s\S]*?)\}/, (match, p1) => {
  let keyframes = [];
  let rootVars = [];
  let animClasses = [];

  let lines = p1.split('\n');
  let inKeyframes = false;
  let currentKeyframe = [];

  for (let line of lines) {
    if (line.trim().startsWith('@keyframes')) {
      inKeyframes = true;
      currentKeyframe.push(line);
    } else if (inKeyframes) {
      currentKeyframe.push(line);
      if (line.trim() === '}') {
        inKeyframes = false;
        keyframes.push(currentKeyframe.join('\n'));
        currentKeyframe = [];
      }
    } else {
      if (line.includes('--animate-')) {
        let match = line.match(/(--animate-[a-zA-Z0-9-]+):\s*(.*?);/);
        if (match) {
           animClasses.push(`.${match[1].replace('--animate-', 'animate-')} { animation: ${match[2]}; }`);
        }
      }
      rootVars.push(line);
    }
  }

  return `:root {
${rootVars.join('\n')}
}
${keyframes.join('\n')}
${animClasses.join('\n')}
`;
});

fs.writeFileSync('src/index.css', c);
