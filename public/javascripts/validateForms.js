(function () {
    'use strict'

    bsCustomFileInput.init()

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form');

    const image = document.getElementById("image");

    image.onchange = function(e) {
        let ext = this.value.match(/\.([^\.]+)$/)[1];
        switch(ext) {
            case 'jpg':
            case 'bmp':
            case 'png':
            case 'jpeg':
                break; 
            default:
                alert("Incorrect Format, file must be an image!");
                this.value = "";
        }
    };

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()