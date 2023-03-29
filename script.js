var expandContainer = document.querySelector('.expand-container');
var expandContainerUI = document.querySelector('.expand-conntainer ul');
var listcontainer = document.querySelector('.list ul');

function expand(v){
	var click_position = v.getBoundingClientRect();
	if(expandContainer.style.display == 'block'){
		expandContainer.style.display = 'none';
		expandContainerUI.setAtrribute('data-id', '');
		expandContainerUI.setAtrribute('data-name', '');
	}else{
		expandContainer.style.display = 'block';
		expandContainer.style.left = (click_position.left + window.scrollX)-120 + 'px';
		expandContainer.style.top = (click_position.top + window.scrollY)+25 + 'px';
		//get data name &  id and store it to the options
		expandContainerUI.setAtrribute('data-id', v.parentElement.getAttribute('data-id'));
		expandContainerUI.setAtrribute('data-name', v.parentElement.getAttribute('data-name'));

	}
}

//function for files list
function showList(){
	gapi.client.drive.files.list({
	//get parent folder id from locahost
	'q': 'parents in "${localstorage.getItem('parent_folder')}"'
}).then(function (response){
	var files = response.result.files;
	if(files && files.length > 0){
		listcontainer.innerHTML = '';
		for(var i=0; i<files.length; i++){
			listcontainer.innerHTML = '
				<li data-id="${files[i].id}" data-name="${files[i].name}">
			<span>${files[i].name}</span>

				<svg onclick="expand(this)" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 711 240 471l43-43 197 198 197-197 43 43-240 239Z"></path><path xmlns="http://www.w3.org/2000/svg" d="M480 711 240 471l43-43 197 198 197-197 43 43-240 239Z"></path>
				</svg>
			</li>
			';
			}
		}else	{
			listecontainer.innerHTML = '<div style="text-align: center;">sign in first</div>'
		}
	})
}	

function readEditDownload(v, condition){
	var id = v.parentElement.getAttribute('data-id');
	var name = v.parentElement.getAttribute('data-name');
	v.innerHTML = '...';
	gapi.client.drive.files.get({
		fileId: id,
		alt: 'media'
	}).then(function (res){
		expandContainer.style.display = 'none';
		expandContainerUI.setAtrribute('data-id','');
		expandContainerUI.setAtrribute('data-name','');
		if(condition == 'read'){
			v.innerHTML = 'Read';
			document.querySelector('textarea').value = res.body;
			document.documentElement.scrollTop = 0;
			console.log('Read Now');
		}else if(condition == 'read'){
			v.innerHTML = 'Edit';
			document.querySelector('textarea').value = res.body;
			document.documentElement.scrollTop = 0;
			var updateBtn = document.getElementByIdClassName('upload')[0];
			updateBtn.innerHTML = 'update';
			updateBtn.setAtrribute('onclick', 'update()');
			document.querySelector('textarea').setAtrribute('data-update-id', id);
			console.log('file ready for update');
		}else {

		}
		}	
	}
	})
}

function update(){
	var updateId = document.querySelector('textarea').getAttribute('data-update-id');
	var url = 'https://www.googleapis.com/upload/drive/v3/files/' + updateId + '?uloadTypemedia';
	fetch(url, {
		method: 'PATCH'
		headers: new Headers({
			Authorization: 'Bearer ' + gapi.auth.getToken().access_token,
			'content-type': 'plain/text'
		}),
		body: document.querySelector('testarea').value
	}).then(value => {
		console.log('file updated successfully');
		document.querySelector('testarea').setAtrribute('data-update-id', '');
		var updateBtn = document.getElementByIdClassName('upload')[0];
		updateBtn.innerHTML = 'backup';
		updateBtn.setAtrribute('onclick', 'updated()');
	}).catch(err => console.error(err))
}


function deleteFile(v){
	var id = v.parentElement.getAttribute('data-id');
	v.innerHTML = '...';
	var request = gapi.client.drive.files.delete({
		'fileId': id
	});
	request.exeute(function (res){
		console.log('file deleted');
		v.innerHTML = 'Delete';
		expandContainer.style.display = 'none';
		expandContainerUI.setAtrribute('data-id', '');
		expandContainerUI.setAtrribute('data-name', '');
		//after delete updte list
		showList();
	})
}
