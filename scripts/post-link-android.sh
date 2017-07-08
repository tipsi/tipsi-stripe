#!/usr/bin/env node

// This code is taken from
// https://github.com/maxs15/react-native-spinkit

var fs = require('fs');
var path = require('path');
var GRADLE_SCRIPT_PATH = path.join(process.cwd(), 'android', 'build.gradle');

// load build.gradle content
try {
  var cfg = fs.readFileSync(GRADLE_SCRIPT_PATH);
} catch(err) {
  console.log(err.stack);
  console.log('Failed to load `android/build.gradle` when linking tipsi-stripe');
}

var depStr = String(cfg).match(/allprojects(.|[\r\n])+/);

if(depStr === null) {
  console.log('Could not find `allprojects { }` block in build.gradle');
}

// search fro allprojects {...} block
var bracketCount = 0;
var str = depStr[0];
var replacePos = 0;
for(var i in str) {
  if(str[i] === '{')
    bracketCount ++;
  else if(str[i] === '}'){
    bracketCount --;
    // block found
    if(bracketCount === 0) {
      replacePos = i;
      break;
    }
  }
}

// add jitpack repo to `repositories` block
var dep = str.substr(0, replacePos);

// Chech if the repository already exists
if (String(dep).match(/url[^h]*https\:\/\/jitpack\.io/) === null) {

  dep = String(dep).replace(/repositories[^\{]*\{/, 'repositories {\r\n        // Add jitpack repository (added by tipsi-stripe)\r\n        maven { url "https://jitpack.io" }');
  str = dep + str.substr(replacePos, str.length - replacePos);

  // replace original build script
  depStr = String(cfg).replace(/allprojects(.|[\r\n])+/, str);
  fs.writeFileSync(GRADLE_SCRIPT_PATH, depStr);
}
