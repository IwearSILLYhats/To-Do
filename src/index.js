import { formatDistanceToNow, format, add, getMonth, getDate, getYear } from "date-fns";
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
        this.date = add(new Date (dates), {days: 1});
        this.time = time;
        this.notes = notes;
        this.subItem = [];
        this.category = [];
    }
}

(function eventLibrary (){
    let library = [{
        name: 'TestName',
        date: new Date(1969, 7, 9)
    },
    {
        name: 'OtherTestName',
        date: new Date(2002, 11, 12)
    }    
];
    const submitBtn = document.querySelector('#submitBtn');
    const eventForm = document.querySelector('.newEvent');

    submitBtn.addEventListener('click', (e) => {
        addToLibrary();
    });

    function addToLibrary (){
        const formInputs = [...document.querySelectorAll('.newEvent input, .newEvent textarea')].map((input) => { return input.value });
        const newItem = new ListItem(formInputs[0], formInputs[1], formInputs[2], formInputs[3])
        library.push(newItem);
        console.log(library);
        eventForm.reset();
        buildNav(library);
    }
    buildNav(library);
})();

function buildNav (library){
    console.log(library);
    const categories = [...document.querySelectorAll('ul')];
    categories.forEach( element => removeChildren(element));
    function removeChildren(parent){
        while (parent.firstChild){
            parent.removeChild(parent.firstChild);
        }
    }
    function addChild (parent, eventItem){
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const child = document.createElement('li');
        const nameField = document.createElement('p');
        nameField.textContent = eventItem.name;
        child.appendChild(nameField);
        const dateField = document.createElement('p');
        dateField.textContent = `${months[getMonth(eventItem.date)]} ${getDate(eventItem.date)}, ${getYear(eventItem.date)}`;
        child.appendChild(dateField);
        parent.appendChild(child);
    }
        library.forEach((newItem) => { 
            addChild(categories[0], newItem);
        });
}