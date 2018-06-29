// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

//trigger image upload on change
// $('#photoUpload').change(function(e) {
//   uploadImage();
// })

// uploads an image to parse file input
function uploadImage(file) {
  console.log('uploadImages() ran');
  var name = "photo.jpg";
  var sessionToken = 'r:'+$("#sesh");
  var soleID = 'MgNHVDLpJ3';//hardcoded now, update with soleID

    name =file.name;
    console.log('name: ' +name);
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

Dropzone.options.myAwesomeDropzone = {
  url: "/api/upload-sole-image",
  // paramName: "image", // The name that will be used to transfer the file
  maxFilesize: 10, // MB
  parallelUploads: 10,
  maxFiles: 10,
  autoProcessQueue: false,
  addRemoveLinks: false,
  // hiddenInputContainer: '#dropzone-'+$scope.suffix,
  dictDefaultMessage: 'Click or drop files here to upload.  No more than 10 photos please!',
  acceptedFiles: 'image/*',
  accept: function(file, done) {
    uploadImage(file);
    console.log(file);
  }
};
