(function toggleEvents(){
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
})();


class ListItem {
    constructor(name, dates, time, notes){
        this.name = name;
        this.date = dates;
        this.time = time;
        this.notes = notes;
        this.subItem = [];
        this.category = [];
    }
}

(function eventLibrary (){
    let library = [{
        name: 'TestName',
        date: '3/19/1991'
    }];
    const submitBtn = document.querySelector('#submitBtn');
    const eventForm = document.querySelector('.newEvent');

    submitBtn.addEventListener('click', (e) => {
        addToLibrary();
    });

    function addToLibrary (){
        const formInputs = [...document.querySelectorAll('.newEvent input, .newEvent textarea')].map((input) => { return input.value });
        const newItem = new ListItem(formInputs[0], formInputs[1], formInputs[2], formInputs[3])
        library.push(newItem);
        buildNav(library);
        eventForm.reset();
    }
})();

function buildNav (library){
    const categories = [...document.querySelectorAll('ul')];
    categories.forEach( element => removeChildren(element));
    function removeChildren(parent){
        while (parent.firstChild){
            parent.removeChild(parent.firstChild);
        }
    }
    function addChild (parent, eventItem){
        const child = document.createElement('li');
        child.textContent = `${eventItem.name} - ${eventItem.date}`;
        parent.appendChild(child);
    }
        library.forEach((newItem) => { 
            addChild(categories[0], newItem);
        });
}