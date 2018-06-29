// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

//trigger image upload on change
// $('#photoUpload').change(function(e) {
//   uploadImage();
// })

// uploads images in materials file input
function uploadImages () {
  console.log('uploadImages() ran');
  var name = "photo.jpg";
  var sessionToken = 'r:'+$("#sesh");
  var soleID = 'MgNHVDLpJ3';//hardcoded now, update with soleID

  var fileUploadControl = $("#photoUpload")[0];
  for (var i = 0; i < fileUploadControl.files.length; i++) {

    var file = fileUploadControl.files[i]
    name = fileUploadControl.files[i].name;
    console.log('file found. name:' + name);
    var parseFile = new Parse.File(name, file);

    parseFile.save().then(function(file) {
      //maybe disable submit button until finished uploading
      console.log('saved file, now uploading to parse');

      //send image to parse server
      Parse.Cloud.run('webapp.saveImage', {
        id: soleID,
        imageFile: file,
        sessionToken: sessionToken
      }).then(response=>{
        console.log('image uploaded', response);
        //maybe reenable submit button now since it's finished uploading
      }).catch(error=>{
        console.log('oops error calling cloud code! error: ', error);
      })
    }, function(error) {
      // The file either could not be read, or could not be saved to Parse.
      console.log('error uploading image', error);
    });
  }
}


//
// function sendImgToParse (id, image, sessionToken) {
//   return Parse.Cloud.run('webapp.saveImage', {
//     id: id,
//     imageFile: image,
//     sessionToken: sessionToken
//   })
// }
