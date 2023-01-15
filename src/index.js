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
    constructor(name, dates, time, notes){
        this.name = name;
        this.dates = dates;
        this.time = time;
        this.notes = notes;
        this.subItem = [];
        this.category = [];
    }
}

function eventLibrary (){
    let library = [];
    const submitBtn = document.querySelector('#submitBtn');
    const eventForm = document.querySelector('.newEvent');

    submitBtn.addEventListener('click', (e) => {
        addToLibrary();
    });

    function addToLibrary (){
        const formInputs = [...document.querySelectorAll('.newEvent input, .newEvent textarea')].map((input) => { return input.value });
        library.push(new ListItem(formInputs[0], formInputs[1], formInputs[2], formInputs[3]));
        eventForm.reset();
        console.log(library);
    }
}


toggleEvents();
eventLibrary();