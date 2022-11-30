function toggleEdit(id){
    form = document.getElementById(id)
    if(form !== null)
        form.style.display = (form.style.display == 'none') ? 'block' : 'none'
}
