const url = "http://localhost/110121REST_CRUD_Symfony/Server/public/index.php"
//el orden es importante
const getSchoolById = async (id) => {
    return await $.ajax({
        type: 'GET',
        url: url + "/school/" + id
    }).done(res => res);
}

const getInfo = async id =>{//details
    let school = await getSchoolById(id);
    document.getElementById('name_info').value = school.school[0].name;
    document.getElementById('street_info').value = school.school[0].street;
    document.getElementById('created_info').value = school.school[0].created.date;
    document.getElementById('updated_info').value = school.school[0].updated.date;
    document.getElementById('status_info').value = school.school[0].status ? "Activo":"Inactivo";
}

const getInfoUpdate = async id =>{
    let school = await getSchoolById(id);
    document.getElementById("id_update").value = id;
    document.getElementById('name_update').value = school.school[0].name;
    document.getElementById('street_update').value = school.school[0].street;
}

const getIdDelete = async id =>{
    let school = await getSchoolById(id);
    document.getElementById("id_delete").value = id;
}

const getSchools = async () => {
    await $.ajax({
        type: 'GET',
        url: url + '/schools'
    }).done(function (res) {
        let schools = res.listSchool;
        let content = "";
        $('#table > tbody').empty();
        if(res.listSchool.length>0){
            for (let i = 0; i < schools.length; i++) {
                content += `
                <tr>
                <th scope='row'>${i + 1}</th>
                <td>${schools[i].name}</td>
                <td>${schools[i].street}</td>
                <td>${schools[i].status ? "Activo":"Inactivo"}</td>
                <td>
                <button type='button' onclick="getInfo(${schools[i].id});" class='btn btn-outline-info' data-bs-toggle='modal' data-bs-target='#details' title="Detalles"><i class="fas fa-search"></i></button>
                <button type='button' onclick="getInfoUpdate(${schools[i].id});" class='btn btn-outline-primary' data-bs-toggle='modal' data-bs-target='#update' title="Editar"><i class="far fa-edit"></i></button>
                <button type='button' onclick="getIdDelete(${schools[i].id});" class='btn btn-outline-danger' data-bs-toggle='modal' data-bs-target='#delete' title="Deshabilitar"><i class="far fa-trash-alt"></i></button>
                </td>
                </tr>
                `;
            }
        }else{
            content += `
            <tr>
            <td colspan=5>No se encontraron valores</td>
            </td>`
        }
        $("#table > tbody").html(content);
    });
}

const createSchool = () => {
    let name = document.getElementById('name_register').value;
    let street = document.getElementById('street_register').value;

    $.ajax({
        type: 'POST',
        url: url + '/school/create',
        data: {name, street}
    }).done(function (res) {
        let content = "";
        content += `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>${res.message}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `
        $("#msgRegister").html(content);
    })
}

const updateSchool = async ()=>{
    let id = document.getElementById("id_update").value;
    let name = document.getElementById('name_update').value;
    let street = document.getElementById("street_update").value;

    $.ajax({
        type:"POST",
        url: url + "/school/update/" + id,
        data: {name, street}
    }).done(function(res){
        let content = "";
        content += `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>${res.message}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `
        $("#msgUpdate").html(content);
    })
}

const deleteSchool = async () => {
    let id = document.getElementById("id_delete").value;
    await $.ajax({
        type: 'GET',
        url: url + '/school/delete/' + id
    }).done(res =>{
        let content = "";
        content += `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>${res.message}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `
        $("#msgDelete").html(content);
    })
      
}
