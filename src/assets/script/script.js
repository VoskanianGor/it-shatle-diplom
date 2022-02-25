const menu = document.querySelector('.menu');
const hiddenMenu = document.querySelector('.nav')


const accordTitle = document.querySelectorAll('.uptitle-accord')
const accordText = document.querySelectorAll('.description-accord')

menu.addEventListener('click', () => {
    menu.classList.toggle('open');
    hiddenMenu.classList.toggle('open');
    
});


accordTitle.forEach(element => {
    element.addEventListener('click', (e) => {
        e.target.classList.toggle('accord-is-open');
        e.target.nextElementSibling.classList.toggle('accord-is-open')
    })
});



