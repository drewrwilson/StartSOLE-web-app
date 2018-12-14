// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;
var imageSuffix = 0;
var fileCount = 0;
var doneButton = $("#save_my_sole");

// uploads an image to parse file input
function uploadImage(file) {
  imageSuffix++;
  var name = "coolimage-" + imageSuffix, //TODO: Why are the first 4 characters of image name chopped off?
    sessionToken = 'r:' + $("#sesh"),
    soleID = $('#soleID').val();

  var parseFile = new Parse.File(name, file);

  parseFile.save().then(function (file) {
    //maybe disable submit button until finished uploading
    console.log('saved file, now uploading to parse');


    doneButton.html("uploading photos");
    doneButton.addClass("disabled");

    //send image to parse server
    Parse.Cloud.run('webapp.saveImage', {
      id: soleID,
      imageFile: file,
      sessionToken: sessionToken
    }).then(response => {
      console.log('image uploaded', response);

      if(fileCount>1 && fileCount === imageSuffix){
        doneButton.html("Save");
        doneButton.removeClass("disabled");
      }

    }).catch(error => {
      console.log('oops error calling cloud code! error: ', error);
    })
  }, function (error) {
    // The file either could not be read, or could not be saved to Parse.
    console.log('error uploading image', error);
  });

}

Dropzone.options.myAwesomeDropzone = {
  // paramName: "image",
  maxFilesize: 10, // MB
  parallelUploads: 10,
  maxFiles: 10,
  autoProcessQueue: false,
  addRemoveLinks: false,
  dictDefaultMessage: 'Click or drop files here to upload.  No more than 10 photos please!',
  acceptedFiles: 'image/*',
  accept: function (file) {
    uploadImage(file);
    console.log(file);
    $("#upload_photos_reminder").hide();
    doneButton.show();
  },
  init: function() {
    this.on("addedfile", function() {fileCount++;});
  }
};
