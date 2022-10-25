const allocationsUrl = 'http://localhost:8080/allocations/';
const professorsUrl = 'http://localhost:8080/professors/';
const coursesUrl = 'http://localhost:8080/courses/';

let professors = [];
let courses = [];

const table = document.getElementById('table');
const tableBody = document.getElementById('table-body');

const inputName = document.getElementById("input-name");
const inputCourse = document.getElementById("input-course");

const btnSalvar = document.getElementById("btn-salvar");
const addbtn = document.getElementById("addbtn");

let actualId = 0;

function createOption(professor) {
    const option = document.createElement("option");
    option.value = professor.id;
    option.textContent = professor.name;

    inputDepartment.appendChild(option);
}

async function getProfessors() {
    if (professors?.length === 0) {
        professors = await get(professorsUrl);

        if (professors?.length > 0) {
            professors.forEach((professor) => {
                createOption(professor);
            });
        }
    }
}

function createOption(course) {
    const option = document.createElement("option");
    option.value = course.id;
    option.textContent = course.name;

    inputDepartment.appendChild(option);
}

async function getCourse() {
    if (courses?.length === 0) {
        courses = await get(coursesUrl);

        if (courses?.length > 0) {
            courses.forEach((course) => {
                createOption(course);
            });
        }
    }
}

async function getAllocations() {
    const allocations = await get(allocationsUrl);

    if (allocations?.length > 0) {
        allocations.forEach((allocation) => {
            createRow(allocation);
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
        inputName.classList.add("is-invalid");
        inputCourse.classList.add("is-invalid");
    } else {
        inputName.classList.remove("is-invalid");
        inputCourse.classList.remove("is-invalid");
    }
}

async function remover(id, row) {
    const result = confirm("Você deseja remover a alocação?");

    if (result) {
        const isSucess = await remove(allocationsUrl + id)
        if (isSucess) {
            tableBody.removeChild(row);
        }
    }
}

async function adicionar() {
    const nameId = parseInt(inputName.value.trim());
    const courseId = parseInt(inputCourse.value.trim());

    if (nameId && courseId) {
        const allocation = await post(allocationsUrl, {
            nameId,
            courseId,
        });

        if (allocation) {
            inputName.value = "0";
            inputCourse.value = "0";

            removeModal();
            createRow(allocation);
            showTable();
        }
    } else if (!nameId || !courseId) {
        setErrorSelect(true);
    }
}

async function atualizar() {
    const nameId = parseInt(inputName.value.trim());
    const courseId = parseInt(inputCourse.value.trim());

    if (nameId && courseId) {
        const allocation = await put(allocationsUrl + actualId, {
            nameId,
            courseId,
        });

        if (allocation) {
            inputName.value = "0";
            inputCourse.value = "0";

            removeModal();
            tableBody.innerHTML = "";
            getAllocations();
        }
    } else if (!nameId || !courseId) {
        setErrorSelect(true);
    }
}

function showTable() {
    table.removeAttribute("hidden");
}

async function abrirModalCriar() {
    actualId = 0;
    document.getElementById("formAllocationLabel").textContent =
        "Adicionar Alocação";
    inputName.value = "0";
    inputCourse.value = "0";
    setErrorSelect(false);
}

async function abrirModalAtualizar(id, nameId, courseId) {
    actualId = id;
    document.getElementById("formAllocationLabel").textContent =
        "Editar Alocação";
    inputName.value = nameId.id;
    inputCourse.value = courseId.id;
    setErrorSelect(false);
}

function removeModal() {
    const modalElement = document.getElementById("form-allocation");
    const modalBootstrap = bootstrap.Modal.getInstance(modalElement);

    modalBootstrap.hide();
}

btnSalvar.addEventListener("click", salvar);
addbtn.addEventListener("click", abrirModalCriar);

function createRow({id, name, course}) {
    const row = document.createElement('tr');
    const idCollumn = document.createElement('th');
    const professorCollumn = document.createElement('td');
    const cursoCollumn = document.createElement('td');
    const diaCollumn = document.createElement('td');
    const horarioCollumn = document.createElement('td');

    const imgDelete = document.createElement("img");
    imgDelete.src = "../assets/delete.svg";

    const imgEdit = document.createElement("img");
    imgEdit.src = "../assets/edit.svg";

    const btnDelete = document.createElement("button");
    btnDelete.addEventListener("click", () => remover(id, row));
    btnDelete.classList.add("btn");
    btnDelete.classList.add("button-ghost");
    btnDelete.appendChild(imgDelete);
    btnDelete.title = `Remover ${id}`;

    const btnEdit = document.createElement("button");
    btnEdit.setAttribute("data-bs-toggle", "modal");
    btnEdit.setAttribute("data-bs-target", "#form-allocation");
    btnEdit.addEventListener("click", () =>
        abrirModalAtualizar(id, name, course)
    );
    btnEdit.classList.add("btn");
    btnEdit.classList.add("button-ghost");
    btnEdit.appendChild(imgEdit);
    btnEdit.title = `Editar ${id}`;

    idCollumn.textContent = id;
    idCollumn.setAttribute("scope", "row");

    professorCollumn.textContent = allocation.professor.name;
    cursoCollumn.textContent = allocation.course.name;
    diaCollumn.textContent = allocation.day;

    const horario = `${allocation.start} - ${allocation.end}`;

    horarioCollumn.textContent = horario;

    acoesCollumn.appendChild(btnDelete);
    acoesCollumn.appendChild(btnEdit);

    row.appendChild(idCollumn);
    row.appendChild(professorCollumn);
    row.appendChild(cursoCollumn);
    row.appendChild(diaCollumn);
    row.appendChild(horarioCollumn);

    tableBody.appendChild(row);

    showTable();
}


getAllocations();
getProfessors();
getCourse();
