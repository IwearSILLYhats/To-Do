function toggleEvents(){
    const darkModeToggle = document.getElementById('darkMode');
    const page = document.querySelector('html');
    const newBtn = document.querySelector('.new');
    const eventForm = document.querySelector('.newEvent');

    function classToggle(target, tglClass, state){
        target.classList.toggle(tglClass, state);
    }

    darkModeToggle.addEventListener('change', (e) => { 
        classToggle(page, 'dark', darkModeToggle.checked);
    });
    document.addEventListener('click', (e) => {
        if(!e.target.closest('.newEvent') && !e.target.closest('.new')){
            classToggle(eventForm, 'hidden', true);
        };
    });
    newBtn.addEventListener('click', (e) => {
        classToggle(eventForm, 'hidden');
    });
}


class ListItem {
    constructor(name, dates, notes){
        this.name = name;
        this.dates = dates;
        this.notes = notes;
        this.subItem = [];
        this.category = [];
    }
}

function eventLibrary (){
    const formInputs = [...document.querySelectorAll('.newEvent input')].map((input) => {
        return input.value;
    });
    const noteField = document.querySelector('#info').value;
    formInputs.push(document.querySelector('#info').value);
    console.log(formInputs);
}


toggleEvents();
eventLibrary();