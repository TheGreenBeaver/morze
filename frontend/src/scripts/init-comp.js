const fs = require('fs');
const path = require('path');

const srcDirname = __dirname.replace(`${path.sep}scripts`, '');

const args = process.argv;
const root = args[2];
const compName = args[3];
const compDir = path.join(srcDirname, root, compName);
const withStyles = path.join(compDir, 'styles');
const camelCased = compName.split(/[ _-]/).map(part => `${part[0].toUpperCase()}${part.substring(1)}`).join('');

fs.mkdir(
  withStyles,
  { recursive: true },
  dirErr => {
    if (dirErr) {
      console.error(dirErr);
    } else {
      fs.writeFile(
        path.join(compDir, `${compName}.js`),
        `
        import React from 'react';
import { string } from 'prop-types';


function ${camelCased}({  }) {
  return (
    <div></div>
  );
}

${camelCased}.propTypes = {
  
};

export default ${camelCased};
        `,
        'utf8',
        fileErr => {
          if (fileErr) {
            console.error(fileErr);
          } else {
            fs.writeFile(
              path.join(compDir, `index.js`),
              `import ${camelCased} from './${compName}';
              
export default ${camelCased};
              `,
              'utf8',
              indexErr => {
                if (indexErr) {
                  console.error(indexErr)
                } else {
                  fs.writeFile(
                    path.join(withStyles, `${compName}.styles.js`),
                    'import { makeStyles } from \'@material-ui/core\';\n\n\n' +
                    'const useStyles = makeStyles(theme => ({\n\n}));\n\n' +
                    'export default useStyles;',
                    'utf8',
                    stylesErr => {
                      if (stylesErr) {
                        console.error(stylesErr);
                      } else {
                        console.log('Done!');
                      }
                    }
                  )
                }
              }
            );
          }
        }
      );
    }
  }
);
