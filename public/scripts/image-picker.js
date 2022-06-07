const fileInputPlaceholder = document.querySelector('.file-select-container');

if (fileInputPlaceholder) {
    prepareFilePicker();
}

function prepareFilePicker() {
    const input = document.querySelector('.file-select-input');

    fileInputPlaceholder.addEventListener('click', () => {    
        input.click();
    });

    input.addEventListener('change', () => {
        const file = input.files[0];
        showSelectedFiles(file);
    });
}


function showSelectedFiles(file) {
    const fileReader = new FileReader();
    const image = new Image();
    const previewList = document.querySelector('.selected-files-preview');
    const imagePreviewCol = document.createElement('div');
    const imagePreview = document.createElement('div');
    
    imagePreviewCol.classList.add('file-preview-col');
    imagePreview.classList.add('file-preview-container');
    imagePreviewCol.appendChild(imagePreview);
    previewList.appendChild(imagePreviewCol);
    
    fileReader.readAsDataURL(file);

    fileReader.addEventListener('load', () => {
        image.src = fileReader.result;
        imagePreview.appendChild(image)
        setTimeout(() => {
            imagePreview.classList.remove('spinner-grow');
            image.classList.add('anim-show')
        }, 750)
    })

    fileReader.addEventListener('loadstart', () => {
        imagePreview.classList.add('spinner-grow');
    })
}