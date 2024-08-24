
document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript is working!');

    // Create a button to switch themes
    const button = document.createElement('button');
    button.textContent = 'Switch Theme';
    document.body.appendChild(button);

    // Set initial theme to dark
    document.body.classList.add('dark-theme');

    button.addEventListener('click', function() {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
        }
    });
});
