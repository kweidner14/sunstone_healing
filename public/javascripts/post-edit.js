// find post edit form
let postEditForm = document.getElementById('postEditForm');
// add submit listener to post edit form
postEditForm.addEventListener('submit', function(event) {
  // find length of uploaded images
  let imageUploads = document.getElementById('imageUpload').files.length;
  // find total number of existing images
  let existingImgs = document.querySelectorAll('.imageDeleteCheckbox').length;
  // find total number of potential deletions
  let imgDeletions = document.querySelectorAll('.imageDeleteCheckbox:checked').length;
  // calculate total after removal of deletions and addition of new uploads
  let newTotal = existingImgs - imgDeletions + imageUploads;
  // if newTotal is greater than four
  console.log(
      "imageUploads: " + imageUploads +
      "existingImgs: " + existingImgs +
      "imgDeletions: " + imgDeletions +
      "newTotal: " + newTotal +
      ".");
  if(newTotal !== 1) {
    // prevent form from submitting
    event.preventDefault();
    // calculate removal amount
    // alert user of their error
    alert('You need to upload an image if you are going to delete one!');
  }
});