const fs = require('fs'),
  path = require('path');

function getFile(path) {
  return fs.readFileSync(path, {"encoding" : "utf8"} )
}

function writeFile(path, data) {
  return fs.writeFileSync(path, data)
}


var userDataPaths;
var fullUserDataPaths;
var userFolder;

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
var file, json, item, jsonCompress = [];

for (var i = 0; i < fullUserDataPaths.length; i++) {
  file = getFile(fullUserDataPaths[i]);
  try {
    json = JSON.parse(file);
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
        data : json
      })
      
      writeFile(path.resolve(__dirname, "../pub/", userDataPaths[i]), JSON.stringify(json));
      
    }
  } catch (e) {
    console.log(e)
  }
}
writeFile(path.resolve(__dirname, "../pub/userdatafull.json"), JSON.stringify(jsonCompress));

writeFile(path.resolve(__dirname, "../pub/userdatamin.json"), JSON.stringify(userMin))

console.log(userMin);

