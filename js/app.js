const container = document.querySelector(".container")
const contacts = [
  //{ name: "afonso", date: "202004011650",duration:"20" },
]

const showContacts = () => {
	//lists the contacts
	loadContacts();
  let output = "<button class='add-button' id='addButton' onclick='showAddForm()'>+</button>"
	
	function date2int(date){
		return date.replace(/-/g,'')	
	}

	let days = []
	contacts.forEach(
		(el)=>{ days.push(el.date) })
	
	let unique_days = days.filter((v, i, a) => a.indexOf(v) === i); 
	unique_days=unique_days.sort( (a,b) => ( parseInt(date2int( b ))-parseInt(date2int( a))
	))

	unique_days.forEach(
		(date)=>{output+=`
			<div class='date-separator'>${date}</div>
			`
			//add events from the day
			//output+="<ul>"
			contacts.forEach(
				(el) => { 
					if(el.date==date) { 
						output+=`<p class="left">${el.name} </p><p class="right">(${el.duration} min)</p><br/>` 
					}
				})
			//output+="</ul>"
		})

  container.innerHTML = output
}

const addContact = () => {
	//reads the form and adds a new element to the contacts array.
	let form = document.getElementById("add_form")

	let name = form.name.value
	//let year = form.year.value
	//let month = ( "0" + ( form.month.value ) ).slice(-2)
	//let day = ( "0" + ( form.day.value ) ).slice(-2)
	//let date = year+'-'+month+'-'+day
	let date = form.date.value
	let duration = form.duration.value
	contacts.push({"name":name,"date":date,"duration":duration})
	saveContacts()

	showContacts()
}

const saveContacts = () => {
 // saves the contact array to localstorage
	window.localStorage.setItem('contacts', JSON.stringify(contacts));
}

const loadContacts = () => {
 // loads the contact array to localstorage
	let store =  window.localStorage.getItem('contacts')
	let saved_contacts=[]
	if (store){
	saved_contacts=JSON.parse(store)
	}
	//clear the array
	contacts.length=0
	saved_contacts.forEach(
		(el) => {contacts.push(el)}
	)
}

const clearAll= () => {
	let clear = confirm("This will clear all your data.\nAre you sure?")
	if (clear){
		contacts.length = 0
		saveContacts()
	}
	showContacts()
}


const showAddForm = () => {
	//shows add form 
	let date = new Date()
	let year = date.getFullYear()
	let month = date.getMonth()+1
	let day = date.getDate()
	//for safari
	let datevalue = year.toString() + '-' + ("0"+( month.toString())).slice(-2) + '-' + ( "0"+day.toString() ).slice(-2) 
	let output = `
	<form id="add_form" onsubmit="addContact()" >
		<label for="name">Name*</label>
		<input name="name" type="text" placeholder="name" required>
		<label for="date">Date*</label>
		<input name="date" type="date" value=${datevalue} required>
		<label for="duration">Duration</label>
		<input name="duration" type="number" min="0" step=1 placeholder="duration (min)" >
		<a href="javascript:showContacts()" class="cancel-button" >Cancel</a>
		<button type="submit" class="add-button">Add</button>
	</form>
	`
  container.innerHTML = output
}



document.addEventListener("DOMContentLoaded", showContacts)

//add serviceworker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}

//unregister serviceWorker - for update
//navigator.serviceWorker.getRegistration().then(function(reg) {
  //if (reg) {
    //reg.unregister().then(function() { window.location.reload(true); });
  //} 
	//else {
     //window.location.reload(true);
  //}
//});

const download_data=()=>{
	download(JSON.stringify(contacts),"contacts.json","text/json")
}


const email_data=()=>{
	function date2int(date){
		return date.replace(/-/g,'')	
	}

	let days = []
	contacts.forEach(
		(el)=>{ days.push(el.date) })
	
	let unique_days = days.filter((v, i, a) => a.indexOf(v) === i); 
	unique_days=unique_days.sort( (a,b) => ( parseInt(date2int( b ))-parseInt(date2int( a))
	));
    output=''
	unique_days.forEach(
		(date)=>{	
			//add events from the day
			//output+="<ul>"
			contacts.forEach(
				(el) => { 
					if(el.date==date) { 
						output+=`${el.name},${el.date},${el.duration}\n` 
					}
				})
			//output+="</ul>"
		})
	window.location.href="mailto:?subject=ContactLog&body="+encodeURI(output)
	//window.location.href="mailto:?subject=ContactLog&body="+encodeURI( json_to_csv(contacts) )+";"
}

const display_info = () => {
	let output='';

	output+=`
	<h2>info</h2>
	<p style="{text-align:left;}">
	A basic app to keep an offline log of the people you interact with.
	If you have any problems or comments, <a href="mailto:tpaixao@igc.gulbenkian.pt">send me an email</a><br/>. 
	</p>
	<h3>Changelog</h3>
	<ol reversed>
	<li class="left">24.05.2020 - added service worker for offline functionality.</li></br>
	<li class="left">15.05.2020 - made the email export prettier.</li></br>
	<li class="left">10.05.2020 - Initial release</li></br>
	</ol>
	<button onclick="showContacts()" class="add-button">OK</button>
	`

	container.innerHTML=output;
}