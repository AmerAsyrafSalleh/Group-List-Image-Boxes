// Selecting DOM elements
const userCards = document.querySelector(".user-cards");
const pagination = document.querySelector(".pagination");

// API URL for fetching user data
const apiUrl = "https://reqres.in/api/users";
let currentPage = 1;
let totalPages = 1;

// Fetch user data from the API
async function fetchUsers(page) {
  try {
    const response = await fetch(`${apiUrl}?page=${page}`);
    const data = await response.json();
    totalPages = data.total_pages;
    return data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Fetch all users from all pages
async function fetchAllUsers() {
  let allUsers = [];
  for (let page = 1; page <= totalPages; page++) {
    const users = await fetchUsers(page);
    allUsers = allUsers.concat(users);
  }
  return allUsers;
}

// Generate a random border color for user cards
function getRandomBorderColor() {
  const colors = ["cyan", "orange"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Display user cards
function displayUsers(users) {
  userCards.innerHTML = "";
  users.forEach((user) => {
    const card = document.createElement("div");
    card.className = "user-card";
    card.style.backgroundImage = `url(${user.avatar})`;
    card.style.borderColor = getRandomBorderColor();

    const header = document.createElement("h3");
    header.className = "user-header";
    header.textContent = `${user.first_name} ${user.last_name}`;

    const userData = document.createElement("div");
    userData.className = "user-data";
    userData.innerHTML = `
        <h3>${user.first_name} ${user.last_name}</h3>
        <p>ID: ${user.id}</p>
        <p>Email: ${user.email}</p>
    `;

    card.appendChild(header);
    card.appendChild(userData);
    userCards.appendChild(card);
  });
}

// Update the page with new user data
async function updatePage(page) {
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    const users = await fetchUsers(currentPage);
    displayUsers(users);
  }
}

// Populate the dropdown menu with unique first names
async function populateFirstNameDropdown() {
  const firstNameSelect = document.getElementById("first-name-select");
  const allUsers = await fetchAllUsers();
  const firstNames = Array.from(
    new Set(allUsers.map((user) => user.first_name))
  );

  firstNames.forEach((firstName) => {
    const option = document.createElement("option");
    option.value = firstName;
    option.textContent = firstName;
    firstNameSelect.appendChild(option);
  });

  // Add event listener to the dropdown for filtering
  firstNameSelect.addEventListener("change", () => {
    const selectedFirstName = firstNameSelect.value;
    if (selectedFirstName === "All") {
      displayUsers(allUsers);
    } else {
      const filteredUsers = allUsers.filter(
        (user) => user.first_name === selectedFirstName
      );
      displayUsers(filteredUsers);
    }
  });
}

// Initialize the page
async function init() {
  const initialUsers = await fetchUsers(currentPage);
  displayUsers(initialUsers);
  populateFirstNameDropdown();

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("div");
    button.className = "page-button";
    button.textContent = i;
    button.addEventListener("click", () => updatePage(i));
    pagination.appendChild(button);
  }
}

init(); // Call the initialization function
