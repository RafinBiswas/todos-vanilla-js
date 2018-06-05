// Pagination
// Double click Inline Edit


// Define Variables
var todoListArray = [];
var updateIndex = 0;
var addButton  = document.querySelector('#addButton');
var taskInfo = document.querySelector('#taskInfo');
var orderByDescID = document.querySelector('#orderByDescID');
var orderByAscID = document.querySelector('#orderByAscID');
var orderByAscTask = document.querySelector('#orderByAscTask');
var orderByDescTask = document.querySelector('#orderByDescTask');
var allRadio = document.querySelector('#all');
var activeRadio = document.querySelector('#active');
var completedRadio = document.querySelector('#completed');
var storage = localStorage.getItem('Todos');
var inlineTasks = document.querySelectorAll('.inlineTask');

if( storage !== null ){
	todoListArray = JSON.parse(storage);
}

renderList();



// Eventlistener for filter
allRadio.addEventListener('click',renderList);
activeRadio.addEventListener('click',renderList);
completed.addEventListener('click',renderList);

// Eventlistener for taskInfo in "keyup" event
taskInfo.addEventListener('keyup',function(event){
	event.preventDefault();
	if (event.keyCode === 13) {
		console.log(event);
		return saveTodos();
	}
});

// Eventlistener for orderByDescTask in "click" event
orderByDescTask.addEventListener('click',function(){
	todoListArray.sort(orderByDescByTask);
	renderList();
});

// Eventlistener for orderByAscTask in "click" event
orderByAscTask.addEventListener('click',function(){
	todoListArray.sort(orderByAscByTask);
	renderList();
});

// Eventlistener for orderByDescID in "click" event
orderByDescID.addEventListener('click',function(){
	todoListArray.sort(orderByDescByID);
	renderList();
});

// Eventlistener for orderByAscID in "click" event
orderByAscID.addEventListener('click',function(){
	todoListArray.sort(orderByAscByID);
	renderList();
});

// Descending order 
function orderByDescByTask(objOne, objTwo) {
	if (objOne.task > objTwo.task) return -1;
	else if (objOne.task < objTwo.task) return 1;
	return 0;
}

// Ascending order
function orderByAscByTask(objOne, objTwo) {
	if (objOne.task < objTwo.task) return -1;
	else if (objOne.task > objTwo.task) return 1;
	return 0;
}

// Descending order 
function orderByDescByID(objOne, objTwo) {
	return objTwo.ID - objOne.ID;
}

// Ascending order
function orderByAscByID(objOne, objTwo) {
	return objOne.ID - objTwo.ID;
}

// Save todos 
function saveTodos(){
	let buttonState = addButton.innerHTML;
	
	if(strTrim(taskInfo.value).length == 0){
		showError('Please Enter A Valid Task!');
		return false;
	}

	if(buttonState === 'Add'){
		task = {
			ID   : generateID(),
			task : taskInfo.value,
			flag : 0
		};
		todoListArray.push(task);

		taskInfo.value = '';
		taskInfo.focus();
		
	}else if(buttonState === 'Update'){
		let obj = todoListArray[updateIndex];
		obj.task = taskInfo.value;
		todoListArray[updateIndex] = obj;

		taskInfo.value = '';
		taskInfo.focus();
		addButton.innerHTML = 'Add';
	}

	storeTodoList();
	renderList();
}

// EventListener for addButton in "click" event
addButton.addEventListener('click',saveTodos);

// Switch Flag
function switchFlag(index){
	let obj = todoListArray[index];
	if(obj.flag > 0){
		obj.flag = 0;
		todoListArray[index] = obj;	
	}else{
		obj.flag = 1;
		todoListArray[index] = obj;	

		taskInfo.value = '';
		taskInfo.focus();
		addButton.innerHTML = 'Add';
	}
	
	storeTodoList();
	renderList();
}

// Edit Task 
function editTask(index){
	let obj = todoListArray[index];
	if(obj.flag > 0){
		showError('You can not update completed task!');
		return false;	
	}
	updateIndex = index;
	addButton.innerHTML = 'Update';
	taskInfo.value = obj.task;
	taskInfo.focus();
}

// Delete Task 
function deleteTask(index){
	todoListArray.splice(index,1);
	storeTodoList();
	renderList();
}

// Store in localstorage
function storeTodoList(){
	localStorage.setItem('Todos',JSON.stringify(todoListArray));
}

// Render List
function renderList(){
	let table = document.querySelector('#populateTableRow');
	let content = '';
	let filterFlag = 'all';
	
	// Filtering
  	if(activeRadio.checked){
  		filterFlag = 'active';	
  	}
  	
  	if(completedRadio.checked){
  		filterFlag = 'completed';
  	}
  	

	todoListArray.forEach(function(item, index, array) {
	  	let flag = '<i class="far fa-check-circle"></i>';
	  	let date = new Date(item.ID).toDateString();
	  	if(item.flag > 0){
	  		flag = '<i class="fas fa-check-circle"></i>';
	  	}

	  	if(filterFlag == 'active' && item.flag == 1){
	  		return;
	  	}

	  	if(filterFlag == 'completed' && item.flag == 0){
	  		return;
	  	}

	  	content += '<tr><td>'+date+'</td><td class="inlineTask">'+item.task+'</td><td><button onClick="switchFlag('+index+')" class="btn btn-default btn-sm">'+flag+'</button> <button onClick="editTask('+index+')" class="btn btn-info btn-sm"><i class="far fa-edit"></i></button> <button onClick="deleteTask('+index+')" class="btn btn-danger btn-sm"><i class="far fa-trash-alt"></i></button></td></tr>';

	});

	table.innerHTML = content;
}

// Generate ID
function generateID(){
	return new Date().getTime();
}

// Show Error Msg
function showError(str){
	let errorWrapper = document.querySelector('#errorMsg');
	let content = errorWrapper.querySelector('b');
	
	if(!errorWrapper.classList.contains('show')){
		content.innerHTML = str;
		errorWrapper.classList.add('show');

		setTimeout(function(){ 
			errorWrapper.classList.remove('show');			
		}, 3000);
	}
}

// Remove white space from String
function strTrim(str){
	return str.replace(/\s/g, '');
}