const professorsUrl = "http://localhost:8080/professors/";
const departmentsUrl =
    "http://localhost:8080/departments/";

let departments = [];

const table = document.getElementById("table");
const tableBody = document.getElementById("table-body");

const inputName = document.getElementById("input-name");
const inputCpf = document.getElementById("input-cpf");
const inputDepartment = document.getElementById("input-department");

const btnSalvar = document.getElementById("btn-salvar");
const addbtn = document.getElementById("addbtn");

let actualId = 0;

function createOption(department) {
    const option = document.createElement("option");
    option.value = department.id;
    option.textContent = department.name;

    inputDepartment.appendChild(option);
}

async function getDepartments() {
    if (departments?.length === 0) {
        departments = await get(departmentsUrl);

        if (departments?.length > 0) {
            departments.forEach((department) => {
                createOption(department);
            });
        }
    }
}

async function getProfessors() {
    const professors = await get(professorsUrl);

    if (professors?.length > 0) {
        professors.forEach((professor) => {
            createRow(professor);
        });

        showTable();
    }
}

async function salvar() {
    if (actualId) {
        atualizar();
    } else {
        adicionar();
    }
}

function setErrorSelect(isError) {
    if (isError) {
        inputDepartment.classList.add("is-invalid");
    } else {
        inputDepartment.classList.remove("is-invalid");
    }
}

async function remover(id, name, row) {
    const result = confirm("Você deseja remover o professor :" + name);

    if (result) {
        const isSucess = await remove(professorsUrl + id)
        if (isSucess) {
            tableBody.removeChild(row);
        }
    }
}

async function adicionar() {
    const name = inputName.value.trim();
    const cpf = inputCpf.value.trim();
    const departmentId = parseInt(inputDepartment.value.trim());

    if (name && cpf && departmentId) {
        const professor = await post(professorsUrl, {
            cpf,
            departmentId,
            name,
        });

        if (professor) {
            inputName.value = "";
            inputCpf.value = "";
            inputDepartment.value = "0";

            removeModal();
            createRow(professor);
            showTable();
        }
    } else if (!departmentId) {
        setErrorSelect(true);
    }
}

async function atualizar() {
    const name = inputName.value.trim();
    const cpf = inputCpf.value.trim();
    const departmentId = parseInt(inputDepartment.value.trim());

    if (name && cpf && departmentId) {
        const professor = await put(professorsUrl + actualId, {
            cpf,
            departmentId,
            name,
        });

        if (professor) {
            inputName.value = "";
            inputCpf.value = "";
            inputDepartment.value = "0";

            removeModal();
            tableBody.innerHTML = "";
            getProfessors();
        }
    } else if (!departmentId) {
        setErrorSelect(true);
    }
}

function showTable() {
    table.removeAttribute("hidden");
}

async function abrirModalCriar() {
    actualId = 0;
    document.getElementById("formProfessorLabel").textContent =
        "Adicionar professor";
    inputName.value = "";
    inputCpf.value = "";
    inputDepartment.value = "0";
    setErrorSelect(false);
}

async function abrirModalAtualizar(id, name, cpf, department) {
    actualId = id;
    document.getElementById("formProfessorLabel").textContent =
        "Editar professor";
    inputName.value = name;
    inputCpf.value = cpf;
    inputDepartment.value = department.id;
    setErrorSelect(false);
}

function removeModal() {
    const modalElement = document.getElementById("form-professor");
    const modalBootstrap = bootstrap.Modal.getInstance(modalElement);

    modalBootstrap.hide();
}

btnSalvar.addEventListener("click", salvar);
addbtn.addEventListener("click", abrirModalCriar);

function createRow({ id, name, cpf, department }) {
    const row = document.createElement("tr");
    const idCollumn = document.createElement("th");
    const nameCollumn = document.createElement("td");
    const cpfCollumn = document.createElement("td");
    const departmentCollumn = document.createElement("td");
    const acoesCollumn = document.createElement("td");

    const imgDelete = document.createElement("img");
    imgDelete.src = "../assets/delete.svg";

    const imgEdit = document.createElement("img");
    imgEdit.src = "../assets/edit.svg";

    const btnDelete = document.createElement("button");
    btnDelete.addEventListener("click", () => remover(id, name, row));
    btnDelete.classList.add("btn");
    btnDelete.classList.add("button-ghost");
    btnDelete.appendChild(imgDelete);
    btnDelete.title = `Remover ${name}`;

    const btnEdit = document.createElement("button");
    btnEdit.setAttribute("data-bs-toggle", "modal");
    btnEdit.setAttribute("data-bs-target", "#form-professor");
    btnEdit.addEventListener("click", () =>
        abrirModalAtualizar(id, name, cpf, department)
    );
    btnEdit.classList.add("btn");
    btnEdit.classList.add("button-ghost");
    btnEdit.appendChild(imgEdit);
    btnEdit.title = `Editar ${name}`;

    idCollumn.textContent = id;
    idCollumn.setAttribute("scope", "row");

    nameCollumn.textContent = name;
    cpfCollumn.textContent = cpf;
    departmentCollumn.textContent = department.name;

    acoesCollumn.appendChild(btnDelete);
    acoesCollumn.appendChild(btnEdit);

    row.appendChild(idCollumn);
    row.appendChild(nameCollumn);
    row.appendChild(cpfCollumn);
    row.appendChild(departmentCollumn);
    row.appendChild(acoesCollumn);

    tableBody.appendChild(row);

    showTable();
}

getProfessors();
getDepartments();