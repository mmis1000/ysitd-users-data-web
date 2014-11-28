const fs = require('fs'),
  path = require('path');

function getFile(path) {
  return fs.readFileSync(path, {"encoding" : "utf8"} )
}

function writeFile(path, data) {
  return fs.writeFileSync(path, data)
}
function isEmpty(val){
  return val == null || val === "" || (Array.isArray(val) && val.length === 0)
}

var userDataPaths;
var fullUserDataPaths;
var userFolder;

var field = JSON.parse(getFile(path.resolve(__dirname, "../field.json")));

userFolder = path.resolve(__dirname , "../data");

userDataPaths = fs.readdirSync(userFolder)

userDataPaths = userDataPaths.sort(function(a, b){
  return a.toLowerCase() > b.toLowerCase();
})

fullUserDataPaths = userDataPaths.map(function(userPath){
  return path.resolve(userFolder, userPath);
})
console.log(fullUserDataPaths);

var userMin = [];
var file, json, newJson, item, jsonCompress = [];

for (var i = 0; i < fullUserDataPaths.length; i++) {
  file = getFile(fullUserDataPaths[i]);
  try {
    json = JSON.parse(file);
    newJson = {};
    
    field.forEach(function(item){
      if (!isEmpty(json[item.key])) {
        newJson[item.key] = json[item.key];
      }
      return true;
    });
    if ("object" === typeof json) {
      item = {
        path : userDataPaths[i],
        nickname : json.nickname,
        id : json.id
      };
      if (json.image) {
        item.image = json.image
      }
      userMin.push(item);
      
      jsonCompress.push({
        path : userDataPaths[i],
        data : newJson
      })
      
      writeFile(path.resolve(__dirname, "../pub/", userDataPaths[i]), JSON.stringify(newJson));
      
    }
  } catch (e) {
    console.log(e)
  }
}
writeFile(path.resolve(__dirname, "../pub/userdatafull.json"), JSON.stringify(jsonCompress));
writeFile(path.resolve(__dirname, "../pub/userdatafull.jsonp.js"), "loadFile( 'userdatafull.jsonp.js' ,"  + JSON.stringify(jsonCompress) + "); ");

writeFile(path.resolve(__dirname, "../pub/userdatamin.json"), JSON.stringify(userMin))
writeFile(path.resolve(__dirname, "../pub/userdatamin.jsonp.js"), "loadFile( 'userdatamin.jsonp.js' ,"  + JSON.stringify(userMin) + "); ")

writeFile(path.resolve(__dirname, "../pub/field.jsonp.js"), "loadFile( 'field.jsonp.js' ,"  + JSON.stringify(field) + "); ")

console.log(userMin);

