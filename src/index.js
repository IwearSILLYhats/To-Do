import { formatDistanceToNow, format, add, getMonth, getDate, getYear, getHours, getMinutes, parseJSON } from "date-fns";

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
        eventForm.querySelector("#name").focus();
    });
})();

(function eventLibrary (){
        // constructor for event list items, days need to have one added due to how they are indexed when converting from date input to Date objects
        class ListItem {
            constructor(name, dates, notes, subItem, category){
                this.name = name;
                this.date = dates ? new Date (dates): 'Anytime';
                this.notes = notes;
                this.subItem = subItem ?? [];
                this.category = category ?? [];
            }
            get testShit() {
                return this.name;
            }
            get formatDate (){
                return `${this.getMDY} ${this.getHoursMins}`;
            }
            get getMDY() {
                    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                    return `${months[getMonth(this.date)]} ${getDate(this.date)}, ${getYear(this.date)}`; }
            get getHoursMins () {
                let hours = getHours(this.date);
                let minutes = getMinutes(this.date);
                let ampm = 'am';
                if(hours > 12){
                    hours -= 12;
                    ampm = 'pm';
                }
                if(String(hours).length == 1) {hours = `0${hours}`};
                if(String(minutes).length == 1) {minutes =`0${minutes}`};
                return hours +":" + minutes + ampm;
            }
            updateData (input, field){ this[field] = input;
                                buildNav(library);}
        }

    //Data object that holds event data, feeds to and from localstorage

     let library = [];
        if(localStorage.getItem('library')){
            let temp = JSON.parse(localStorage.getItem('library'));
            library = temp.map((e) => {
            return new ListItem(e.name, Date.parse(e.date), e.notes, e.subItem, e.category);
        });
        };

     function updateStorage (){
        localStorage.setItem('library', JSON.stringify(library));
        console.log(JSON.parse(localStorage.getItem('library')));
     }
    
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
        updateStorage();
        buildNav(library);
    }

    buildNav(library);
})();

// Clears existing li dom elements then generates new ones that correspond to library items, categorized by time between current date and event date
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
        const nameField = document.createElement('p');
        nameField.textContent = eventItem.name;
        child.addEventListener('click', (e) => {
            buildContent(eventItem);
        })
        child.appendChild(nameField);
        if (eventItem.date !== 'Anytime'){
            const dateField = document.createElement('p');
            if(parent === categories[0]){
                dateField.textContent = formatDistanceToNow(eventItem.date);
            }
            else{
                dateField.textContent = eventItem.getMDY;
            }
            child.appendChild(dateField);
        }
        parent.appendChild(child);
    }

    // Checks event date vs todays date to determine which navbar category it should go into.
        library.forEach((newItem) => {
            const msToDays = 1000*60*60*24;
            let dayDifference = (new Date(newItem.date) - Date.now())/msToDays;
            let category = newItem.date === 'Anytime' ? 4
                        : dayDifference < 0 ? 5
                        : dayDifference <= 1 ? 0
                        : dayDifference <= 7 ? 1
                        : dayDifference <= 30 ? 2
                        : 3;
            addChild(categories[category], newItem);
        });
}
// Clears main content element, then dynamically generates new elements based on the content of eventItem that was clicked
function buildContent (eventItem){
    const main = document.querySelector('.main');
    const components = [
        [main, eventItem.name, 'h1'], 
        [main, eventItem.date === 'Anytime' ? eventItem.date : eventItem.formatDate, 'h3'], 
        [main, eventItem.notes, 'p'], 
        [main, eventItem.subItem, 'ul']];

    while (main.firstChild){
        main.removeChild(main.firstChild);
    }
    function elementBuilder(parent, data, element){
        const label = document.createElement('label');
        const child = document.createElement(element);
        const fieldType = (data === 
            eventItem.date || data === eventItem.formatDate) ? ['input', 'datetime-local'] :
            data === eventItem.notes ? ['textarea'] :
            ['input', 'text'];
        const editField = document.createElement(fieldType[0]);
        if(fieldType[1]){
            editField.setAttribute('type', fieldType[1])
        };

        if(Array.isArray(data)){
            data.forEach((point) => {
                elementBuilder(child, point, 'li');
            })
        }
        else{
            editField.value = data;
            child.textContent = data;
        }
        label.appendChild(child);
        label.appendChild(editField);
        parent.appendChild(label);
    }

 components.forEach((item) => {
    elementBuilder(...item);
 });

}