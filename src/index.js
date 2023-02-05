import { formatDistanceToNow, format, add, getMonth, getDate, getYear } from "date-fns";

// manages any events on the page that requires a class to be toggled
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

// constructor for event list items, days need to have one added due to how they are indexed when converting from date input to Date objects
class ListItem {
    constructor(name, dates, time, notes){
        this.name = name;
        console.log(dates);
        this.date = dates ? new Date (dates) : 'Anytime';
        this.notes = notes;
        this.subItem = [];
        this.category = [];
    }
    get getMDY() {
            let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `${months[getMonth(this.date)]} ${getDate(this.date)}, ${getYear(this.date)}`; }
}

// houses the event library object and any functions manipulating it.
(function eventLibrary (){
    let library = [new ListItem ('TestName', new Date(1969, 7, 9), 'No notes'),
     new ListItem ('OtherTestName', new Date(2002, 11, 12), 'No Notes')];
    
    const submitBtn = document.querySelector('#submitBtn');
    const eventForm = document.querySelector('.newEvent');

    submitBtn.addEventListener('click', (e) => {
        addToLibrary();
    });

    function addToLibrary (){
        const formInputs = [...document.querySelectorAll('.newEvent input, .newEvent textarea')].map((input) => { return input.value });
        const newItem = new ListItem(formInputs[0], formInputs[1], formInputs[2])
        library.push(newItem);
        eventForm.reset();
        buildNav(library);
    }
    buildNav(library);
})();

// Clears existing li dom elements then generates new ones that correspond to library items, categorized by time between current date and event date
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
        const child = document.createElement('li');
        const nameField = document.createElement('p');
        nameField.textContent = eventItem.name;
        child.appendChild(nameField);
        if (eventItem.date !== 'Anytime'){
            const dateField = document.createElement('p');
            dateField.textContent = eventItem.getMDY;
            child.appendChild(dateField);
        }
        parent.appendChild(child);
    }
        library.forEach((newItem) => {
            const msToDays = 1000*60*60*24;
            let dayDifference = (new Date(newItem.date) - Date.now())/msToDays;
            let category = newItem.date === 'Anytime' ? 4
                        : dayDifference < 0 ? 5
                        : dayDifference <= 1 ? 0
                        : dayDifference <= 7 ? 1
                        : dayDifference <= 30 ? 2
                        : 3;
            console.log(dayDifference);
            addChild(categories[category], newItem);
        });
}