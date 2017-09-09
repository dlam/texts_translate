#!/usr/bin/env node

var sketchFileName = process.argv[2];

if (sketchFileName == null) {
  console.error('Missing argument: sketchFileName, did you forget to run this script with the name of the sketch file?');
  process.exit(1);
}

const fs = require('fs');
const keyMapping = JSON.parse(fs.readFileSync('./' + sketchFileName + '_translations/key_mapping.json', 'utf8'));

fs.readdir('Plaza', function(err, files) {
  if (err) {
    console.error("Could not list the translations directory. Did you forget to add the folder 'Plaza' with the translations from OneSky?", err);
    process.exit(1);
  }

  files.forEach(function(file, index) {
    const newTranslation = {};
    const translations = JSON.parse(fs.readFileSync('./Plaza/' + file, 'utf8'));
    for (const key in keyMapping) {
      const value = keyMapping[key];
      if (value.toLowerCase() == value && value.indexOf(' ') < 0 && translations.hasOwnProperty(value)) {
        newTranslation[key] = translations[value];
      } else {
        newTranslation[key] = value;
      }

      fs.writeFile('./' + sketchFileName + '_translations/' + file, JSON.stringify(newTranslation, null, 2), 'utf-8', (error) => {
        console.error("Error writing file.", error);
        process.exit(1);
      });
    }
  });
});
