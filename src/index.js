import { formatDistanceToNow, format, add, getMonth, getDate, getYear, getHours, getMinutes, parseJSON } from "date-fns";
import { it } from "date-fns/locale";

// manages any events on the page that requires a class to be toggled
(function toggleEvents(){
    const darkModeToggle = document.getElementById('darkMode');
    const page = document.querySelector('html');
    const newBtn = document.querySelector('.new');
    const eventForm = document.querySelector('.newEvent');
    const options = document.querySelector('.options');
    const optionBtn = document.querySelector('.optionBtn');
    function classToggle(target, tglClass, state){
        target.classList.toggle(tglClass, state);
    }


    if (localStorage.getItem('darkMode') == 'true'){
        page.classList.add('dark');
        darkModeToggle.checked = true;
    }
    darkModeToggle.addEventListener('change', (e) => {
        classToggle(page, 'dark', darkModeToggle.checked);
        localStorage.setItem('darkMode', darkModeToggle.checked);
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
    document.addEventListener('click', (e) => {
        if(!e.target.closest('.options') && !e.target.closest('.optionBtn')){
            classToggle(options, 'hidden', true);
        };
    });
    optionBtn.addEventListener('click', (e) => {
        classToggle(options, 'hidden');
    });
})();

const searchBar = document.querySelector('.search')
searchBar.addEventListener('input', (query) => {
    filterList(query);
});
function filterList (query){
    const queryTerm = query.target.value;
    const itemList = [...document.querySelectorAll('.list li')];
    itemList.forEach((e) => {
        const nameText = e.querySelector('p');
        if (!nameText.textContent.toLowerCase().includes(queryTerm.toLowerCase())){
            e.classList.add('hidden');
        }
        else{
            e.classList.remove('hidden');
        }
    });
}

const eventLibrary = (function(){
        // constructor for event list items, days need to have one added due to how they are indexed when converting from date input to Date objects
        class ListItem {
            constructor(name, dates, notes, subItem, category, done){
                this.name = name;
                this.date = dates ? new Date (dates): 'Anytime';
                this.notes = notes;
                this.subItem = subItem ?? [];
                this.category = category ?? [];
                this.done = done ?? false;
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
            updateData (input, field, index){ 
                if (field === 'subItem') {this[field][index].val = input;}
                else{this[field] = input;}
                if (field === 'name' || field === 'date'){
                    buildNav(library);
                }}
            remove (){
                const index = library.indexOf(this);
                if (index !== -1){
                    library.splice(index, 1);
                    buildNav(library);
                    buildContent();
                    updateStorage();
                }
            }
            toggleDone (){
                this.done = (this.done === false) ? true : false;
                buildNav(library);
                updateStorage();
            }
        }

    //Data object that holds event data, feeds to and from localstorage

     let library = [];
        if(localStorage.getItem('library')){
            let temp = JSON.parse(localStorage.getItem('library'));
            library = temp.map((e) => {
            return new ListItem(e.name, Date.parse(e.date), e.notes, e.subItem, e.category, e.done);
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

    const sortBtns = [...document.querySelectorAll('input[type="radio"]')];
    sortBtns.forEach( (btn) => {
        btn.addEventListener('change', (e) =>{
            sortLibrary(e.target);
        });
    });

    function sortLibrary (target) {
        if (target.id === 'alphabetical'){
            console.log('namesort');
            library = library.sort(function abcSort(a,b) {
                let aname = a.name.toLowerCase();
                let bname = b.name.toLowerCase();
                if (aname > bname) {
                    return 1;
                }
                if (bname > aname) {
                    return -1;
                }
                return 0;
            })
        }
        else if (target.id === 'chronological'){
            console.log('datesort');
            library = library.sort(function dateSort(a,b) {
                if (a.date > b.date) {
                    return 1;
                }
                if (b.date > a.date) {
                    return -1;
                }
                return 0;
            })
        }
        buildNav(library);
        updateStorage();
    }
    buildNav(library);

    return {
        updateLocal: function () {
            updateStorage();
            }
        };
})();

// Clears existing li dom elements then generates new ones that correspond to library items, categorized by time between current date and event date
function buildNav (library){
    const categories = [...document.querySelectorAll('.nav ul')];
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
        if(eventItem.done === true){
            nameField.classList.add('done');
        };
        child.addEventListener('click', (e) => {
            buildContent(eventItem);
        })
        child.appendChild(nameField);
        if (eventItem.date !== 'Anytime'){
            const dateField = document.createElement('p');
            if (eventItem.done === true){
                dateField.classList.add('done');
            };
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
            let category = (dayDifference < 0 || newItem.done === true) ? 5
                        : newItem.date === 'Anytime' ? 4
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
    while (main.firstChild){
        main.removeChild(main.firstChild);
    }
    if(eventItem){
    const components = [
        [main, eventItem.name, 'name'], 
        [main, eventItem.date === 'Anytime' ? eventItem.date : eventItem.formatDate, 'date'], 
        [main, eventItem.notes, 'notes'], 
        [main, eventItem.subItem, 'subItem']];
    function elementBuilder(parent, data, types, index){
        // Checks if data is an array, if so runs itself recursively on array indexes, if not adds event listener so that changes to input change the value in library
        if(Array.isArray(data)){
            const child = document.createElement('ul');
            data.forEach((lineItem, indx) => {
                elementBuilder(child, lineItem, 'subItem', indx);
            });
            parent.appendChild(child);
        }
        else{
            const container = document.createElement('div');
            let editField;
            if (types === 'notes'){
                editField = document.createElement('textarea');
                editField.setAttribute('maxlength', '140');
                editField.value = data === '' ? 'New Item' : data.val ?? data;
            }
            else{
                editField = document.createElement('input');
                if (types === 'date'){
                    editField.setAttribute('type', 'datetime-local');
                    if (eventItem.date !== 'Anytime'){
                        const localTime = new Date(eventItem.date.getTime() + eventItem.date.getTimezoneOffset() * -60 * 1000).toISOString().slice(0, 19);
                        editField.value = localTime;
                    }
                }
                else{
                    editField.setAttribute('type', 'text');
                    editField.setAttribute('maxlength', '50')
                    editField.value = data.val === '' ? 'New Item' : data.val ?? data;
                    if (data.done === true){editField.classList.add('done')};
                }
            }
            editField.addEventListener('change', (e) => {
                if(types === 'date'){
                    eventItem.updateData((e.target.value ? new Date (e.target.value) : 'Anytime'), types);
                }
                else if(types === 'subItem') {
                    eventItem.updateData(e.target.value, types, index);
                }
                else{
                    eventItem.updateData(e.target.value, types)
                }
                eventLibrary.updateLocal();
            });
            container.addEventListener('click', (e) => {
                if (e.target.matches('.main ul div::before')){

                };
                if (e.target.matches('.main ul div::after')){
                }
            })
            if(types === 'subItem'){
                const before = document.createElement('button');
                before.type = 'button';
                before.textContent = '✔';
                before.classList.add('before');
                before.setAttribute('title', 'Complete');
                before.addEventListener('click', (e) => {
                    editField.classList.toggle('done');
                    data.done = (data.done === true) ? false : true;
                });
                container.appendChild(before);
            }
            container.appendChild(editField);
            if(types === 'subItem'){
                const after = document.createElement('button');
                after.type = 'button';
                after.textContent = '✕';
                after.classList.add('after');
                after.setAttribute('title', 'Remove');
                after.addEventListener('click', (e) => {
                    eventItem.subItem.splice(index, 1);
                    buildContent(eventItem);
                });
                container.appendChild(after);
            }
            parent.appendChild(container);
        }
    }

 components.forEach((item) => {
    elementBuilder(...item);
 });

 const addBtn = document.createElement('button');
 addBtn.type = 'button';
 addBtn.classList.add('addBtn');
 addBtn.textContent = '+';
 addBtn.setAttribute('title', 'New Item');
 addBtn.addEventListener('click', (e) => {
     eventItem.subItem.push({val: '', done: false});
     const subItemList = document.querySelector('.main ul');
     elementBuilder(subItemList, eventItem.subItem[eventItem.subItem.length-1], `subItem`, eventItem.subItem.length-1);
 });
 main.appendChild(addBtn);

  const doneBtn = document.createElement('button');
  doneBtn.type = 'button';
  doneBtn.classList.add('doneBtn');
  doneBtn.textContent = '✔';
  doneBtn.setAttribute('title', 'Complete');
  doneBtn.addEventListener('click', (e) => {
    eventItem.toggleDone();
  });
  main.appendChild(doneBtn);

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.classList.add('removeBtn');
  removeBtn.textContent = '✕';
  removeBtn.setAttribute('title', 'Remove');
  removeBtn.addEventListener('click', (e) => {
    eventItem.remove();
  });
  main.appendChild(removeBtn);
};
};