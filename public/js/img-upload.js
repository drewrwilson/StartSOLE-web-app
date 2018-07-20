// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;


// uploads an image to parse file input
function uploadImage(file) {

  var name         = file.name,
      sessionToken = 'r:'+$("#sesh"),
      soleID       = $('#soleID').val();

  var parseFile = new Parse.File(name, file, 'image/*');

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
  url: "/api/upload-sole-image",//this isn't used
  maxFilesize: 10, // MB
  parallelUploads: 10,
  maxFiles: 10,
  autoProcessQueue: false,
  addRemoveLinks: false,
  dictDefaultMessage: 'Click or drop files here to upload.  No more than 10 photos please!',
  acceptedFiles: 'image/*',
  accept: function(file, done) {
    uploadImage(file);
    console.log(file);
  }
};
