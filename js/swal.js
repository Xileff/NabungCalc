function alertError(title, text, confirmButtonText){
    Swal.fire({
        title: title.toString(),
        text: text.toString(),
        icon: 'error',
        confirmButtonText: confirmButtonText.toString()
    })
}

function alertSuccess(title, text, confirmButtonText){
    Swal.fire({
        title: title.toString(),
        text : text.toString(),
        icon : 'success',
        confirmButtonText : confirmButtonText.toString()
    })
}

function alertRedirect(title, text, link, confirmButtonText){
    Swal.fire({
        icon: 'Success',
        title: title.toString(),
        text: text.toString(),
        confirmButtonText : confirmButtonText.toString()
      }).then(function() {
        window.location = link.toString();
      })
}