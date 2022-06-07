const passwordPreviewIcons = document.querySelectorAll('.show-password');

for (const btn of passwordPreviewIcons) {
    btn.addEventListener('mousedown', function(e) {
        togglePassword(e, 'text')
    });

    btn.addEventListener('mouseup', function(e) {
        togglePassword(e, 'password')
    });

    btn.addEventListener('mouseout', function(e) {
        togglePassword(e, 'password')
    });
}

function togglePassword(event, inputType) {
    const formGroup = event.currentTarget.parentNode.parentNode;
    const input = formGroup.querySelector('input');

    if (input) {
        input.setAttribute('type', inputType);
    }
}