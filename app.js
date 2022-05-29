// class Contact
class Contact{
    constructor(name, number){
        this.name = name;
        this.number = number;
    }
}

// This Will Generate All the letters form A to Z
// Generate an array of integers
const alpha = Array.from(Array(26)).map((e, i) => i += 65)
// console.log(alpha);
const alphabets = alpha.map((ele, index)=> String.fromCharCode(ele));
// console.log(alphabets);

// Modifies UI
class UI{
    static addAlphabets(alphabets){
        // console.log(alphabets);
        const ul = document.querySelector('#names');
        alphabets.forEach((char)=>{
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-start';
            const div = document.createElement('div');
            div.className = `ms-2 me-auto alpha-${char}`;
            const innerdiv = document.createElement('div');
            innerdiv.className = 'fw-bold';
            innerdiv.innerText=`${char}`;
            div.appendChild(innerdiv);
            li.appendChild(div);
            ul.appendChild(li);
        })
    }

    static displayContacts(){

        var contacts = Store.getContacts();

        contacts.forEach((contact)=> UI.addContact(contact));
    }

    static addContact(contact){
        let first_letter = contact.name[0].toUpperCase();
        console.log(first_letter);

        const addtoLetter = document.querySelector(`.alpha-${first_letter}`);

        const outerdiv = document.createElement('div');
        outerdiv.className = 'row mt-3';
        outerdiv.style.width = '200%';

        const name_div = document.createElement('div');
        name_div.className = 'm-1 name col';
        name_div.style.fontSize = '1rem';
        name_div.innerHTML = `${contact.name}`;

        const number_div = document.createElement('div');
        number_div.className = 'm-1 name col';
        number_div.style.fontSize = '1rem';
        number_div.innerHTML = `${contact.number}`;

        const delete_div = document.createElement('div');
        delete_div.className = 'col m-1'
        delete_div.innerHTML = '<a class="btn btn-danger btn-sm delete" href="#">X</a>';

        outerdiv.appendChild(name_div);
        outerdiv.appendChild(number_div);
        outerdiv.appendChild(delete_div);

        addtoLetter.appendChild(outerdiv);
    }

    static removeContact(contact){
        if(contact.classList.contains('delete')){
            contact.parentElement.parentElement.remove();
        }
    }

    static clearField(){
        document.querySelector('#contact_name').value = '';
        document.querySelector('#contact_number').value = '';

    }

    static ShowAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        
        const container = document.querySelector('.container');
        const form = document.querySelector('.form-group');

        container.insertBefore(div, form);

        setTimeout(()=> document.querySelector('.alert').remove(), 3000);
    }
}

// Save to local Storage
class Store{
    static getContacts(){
        let contacts;
        if(localStorage.getItem('contacts') === null){
            contacts = []
        }
        else{
            contacts = JSON.parse(localStorage.getItem('contacts'));
        }
        return contacts;
    }

    static addContact(contact){
        const contacts = Store.getContacts();
        contacts.push(contact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    static removeContact(number){
        const contacts = Store.getContacts();

        contacts.forEach((contact, index)=>{
            if(contact.number == number){
                contacts.splice(index, 1);
            } 
        });

        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
}

// Filtering The Search
let filterInput = document.querySelector('#filter_input');
filterInput.addEventListener('keyup', filterNames)

function filterNames(e){
    var text = e.target.value.toLowerCase();
    // Get all contacts
    let names = document.getElementsByClassName('name');
    // Converting to an array
    Array.from(names).forEach((name)=>{
        var personName = name.textContent;
        if(personName.toLowerCase().indexOf(text) != -1){
            name.style.display = 'block';
        }
        else{
            name.style.display = 'none';
        }
    })
}

// Event: On HTML Load
document.addEventListener('DOMContentLoaded', ()=>{
    UI.addAlphabets(alphabets);
    UI.displayContacts();
})

// Event On Submit
document.querySelector('.form-group').addEventListener('submit', (e)=>{
    // To remove default one
    e.preventDefault();

    const name = document.querySelector('#contact_name').value;
    const number = document.querySelector('#contact_number').value;

    if(name === '' || number === ''){
        UI.ShowAlert('Please Fill The Details', 'danger');
        UI.clearField();
    }else{

        const contact = new Contact(name, number);

        UI.addContact(contact);

        Store.addContact(contact)

        UI.ShowAlert('Contact Added To your List', 'success');

        //Clear Fields
        UI.clearField();
    }
})

// Remove a Contact
document.querySelector('#names').addEventListener('click', (e)=>{
    UI.removeContact(e.target);

    Store.removeContact(e.target.parentElement.previousSibling.textContent);

    UI.ShowAlert('Contact Removed', 'success');

})