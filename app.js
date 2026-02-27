const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const ageInput = document.getElementById("age");
const addUserBtn = document.getElementById("addUser");
const usersContainer = document.querySelector(".usersContainer");

// --add-editing-feauture------
const formAdd = document.querySelector(".form-add");
const formEdit = document.querySelector(".form-edit");
const firstNameEditInput = document.getElementById("firstNameEdit");
const lastNameEditInput = document.getElementById("lastNameEdit");
const ageEditInput = document.getElementById("ageEdit");
const editUserBtn = document.getElementById("editUser");

let idEdit = null;

let buttonStep = true;

addUserBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(
      "http://my-json-server-production-8dd7.up.railway.app/users",
      {
        method: "POST",
        body: JSON.stringify({
          firstName: firstNameInput.value,
          lastName: lastNameInput.value,
          age: ageInput.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    await getUsers();
    firstNameInput.value = "";
    lastNameInput.value = "";
    ageInput.value = "";

    e.target.parentElement.firstElementChild.select();
  } catch (error) {
    alert("error Server");
  }
});

async function deleteUser(id) {
  try {
    const response = await fetch(
      `http://my-json-server-production-8dd7.up.railway.app/users/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Delete failed");
    }
    setTimeout(getUsers, 500);
    formAdd.classList.remove("hidden");
    formEdit.classList.add("hidden");
  } catch (error) {
    throw error;
  }
}

async function getUsers() {
  try {
    const response = await fetch(
      "http://my-json-server-production-8dd7.up.railway.app/users"
    );
    const users = await response.json();
    usersContainer.textContent = "";
    let html = "";
    users.forEach((user) => {
      html += `
            <div class="usersCard" data-id="${user.id}">
                <p><b>firstName : </b>${user.firstName}</p>
                <p><b>lastName : </b>${user.lastName}</p>
                <p><b>age : </b>${user.age}</p>
                <div class="usersCardBtns">
                  <button class="deleteUserBtn">Delete User</button>
                  <li class="fa fa-edit"></li>
                </div>
            </div>
            `;
    });
    usersContainer.innerHTML = html;
    buttonStep = true;
  } catch (error) {
    alert("error server");
  }
}

window.addEventListener("load", getUsers);

usersContainer.addEventListener("click", async (e) => {
  if (e.target.nodeName === "BUTTON" && buttonStep) {
    buttonStep = false;
    const card = e.target.closest(".usersCard");

    if (!card) return;

    card.style.opacity = 0;
    const id = card.dataset.id;

    try {
      await deleteUser(id);
    } catch (error) {
      card.style.opacity = 1;
      buttonStep = true;
      alert("error to delete User");
    }
  }

  if (e.target.nodeName === "LI") {
    formAdd.classList.add("hidden");
    formEdit.classList.remove("hidden");

    const card = e.target.closest(".usersCard");
    idEdit = card.dataset.id;

    try {
      const response = await fetch(
        `http://my-json-server-production-8dd7.up.railway.app/users/${idEdit}`
      );
      const user = await response.json();

      firstNameEditInput.value = user.firstName;
      lastNameEditInput.value = user.lastName;
      ageEditInput.value = user.age;
    } catch (error) {
      alert("error Server");
    }
  }
});

editUserBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      `http://my-json-server-production-8dd7.up.railway.app/users/${idEdit}`,
      {
        method: "PUT",
        body: JSON.stringify({
          firstName: firstNameEditInput.value,
          lastName: lastNameEditInput.value,
          age: ageEditInput.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("error Server2");
    }

    await getUsers();

    formAdd.classList.remove("hidden");
    formEdit.classList.add("hidden");
  } catch (error) {
    alert(error.message);
  }
});
