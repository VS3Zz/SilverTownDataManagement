// Sample Data (Initially empty)
let members = [
  { id: "ADMIN1", name: "Admin", role: "Owner", points: 0, warnings: 0, email: "admin@example.com", password: "admin123" }
];

let currentUser = null;

// Logs Array
let logs = [];

// Show Page Function
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = 'none';
  });
  document.getElementById(pageId).style.display = 'block';
}

// Render Members Table
function renderMembers() {
  const tbody = document.querySelector('#membersTable tbody');
  tbody.innerHTML = members.map(member => `
    <tr>
      <td>${member.id}</td>
      <td>${member.name}</td>
      <td>${member.role}</td>
      <td>${member.points}</td>
      <td>${member.warnings}</td>
    </tr>
  `).join('');
}

// Render Manage Members Table
function renderManageMembers(membersList = members) {
  const tbody = document.querySelector('#manageMembersTable tbody');
  tbody.innerHTML = membersList.map(member => `
    <tr>
      <td>${member.id}</td>
      <td>${member.name}</td>
      <td>${member.role}</td>
      <td>${member.points}</td>
      <td>${member.warnings}</td>
      <td><button class="edit-button" onclick="editMember('${member.id}')"><i class="fas fa-edit"></i> Edit</button></td>
      <td><button class="delete-button" onclick="deleteMember('${member.id}')"><i class="fas fa-trash"></i> Delete</button></td>
    </tr>
  `).join('');
}

// Render Logs Table
function renderLogs(logsList = logs) {
  const tbody = document.querySelector('#logsTable tbody');
  tbody.innerHTML = logsList.map(log => `
    <tr>
      <td>${log.date}</td>
      <td>${log.user}</td>
      <td>${log.action}</td>
      <td>${log.details}</td>
    </tr>
  `).join('');
}

// Log Actions
function logAction(user, action, details) {
  const log = {
    date: new Date().toLocaleString(),
    user: user.name,
    action: action,
    details: details,
  };
  logs.push(log);
  renderLogs();
}

// Search Members
function filterMembers() {
  const searchTerm = document.getElementById('searchMember').value.toLowerCase();
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm) || member.id.toLowerCase().includes(searchTerm)
  );
  renderManageMembers(filteredMembers);
}

// Search Logs
function filterLogs() {
  const searchTerm = document.getElementById('searchLogs').value.toLowerCase();
  const filteredLogs = logs.filter(log =>
    log.user.toLowerCase().includes(searchTerm) ||
    log.action.toLowerCase().includes(searchTerm) ||
    log.details.toLowerCase().includes(searchTerm)
  );
  renderLogs(filteredLogs);
}

// Edit Member
function editMember(id) {
  const member = members.find(m => m.id === id);
  if (member) {
    const newName = prompt("Enter new name:", member.name);
    const newRole = prompt("Enter new role:", member.role);
    const newPoints = prompt("Enter new points:", member.points);
    const newWarnings = prompt("Enter new warnings:", member.warnings);

    if (newName) member.name = newName;
    if (newRole) member.role = newRole;
    if (newPoints) member.points = parseInt(newPoints);
    if (newWarnings) member.warnings = parseInt(newWarnings);

    renderMembers();
    renderManageMembers();
    logAction(currentUser, "Edit Member", `Edited ${member.name} (ID: ${member.id})`);
  }
}

// Delete Member
function deleteMember(id) {
  const member = members.find(m => m.id === id);
  if (confirm(`Are you sure you want to delete ${member.name}?`)) {
    members = members.filter(m => m.id !== id);
    renderMembers();
    renderManageMembers();
    logAction(currentUser, "Delete Member", `Deleted ${member.name} (ID: ${member.id})`);
  }
}

// Add Management Member
document.getElementById('addManagementForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const psnId = document.getElementById('psnId').value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  // Add new member
  members.push({ id: psnId, name, email, password, role, points: 0, warnings: 0 });
  renderMembers();
  renderManageMembers();
  logAction(currentUser, "Add Member", `Added ${name} (${role})`);
  e.target.reset();
  showPage('dashboard');
});

// Activate Customer
document.getElementById('activationForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const customerName = document.getElementById('activateName').value;
  const photo = document.getElementById('photoUpload').files[0];

  if (!photo) {
    alert("Please upload a photo or capture one using your camera.");
    return;
  }

  if (currentUser) {
    currentUser.points += 7; // Award 7 points to the logged-in user
    renderMembers();
    logAction(currentUser, "Activate Customer", `Activated ${customerName} and awarded 7 points`);
    document.getElementById('activationMessage').textContent = `You activated ${customerName}! 7 points added to your account.`;
  } else {
    document.getElementById('activationMessage').textContent = "You must be logged in to activate.";
  }
  e.target.reset();
});

// Login Functionality
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const user = members.find(m => m.email === email && m.password === password);
  if (user) {
    currentUser = user;
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('dashboardPage').style.display = 'flex';

    // Show/Hide Add Management, Manage Members, and Logs links based on role
    const allowedRoles = ["Founder", "Ceo", "Co-Owner", "Owner"];
    if (allowedRoles.includes(currentUser.role)) {
      document.getElementById('addManagementLink').style.display = 'block';
      document.getElementById('manageMembersLink').style.display = 'block';
      document.getElementById('logPageLink').style.display = 'block';
    } else {
      document.getElementById('addManagementLink').style.display = 'none';
      document.getElementById('manageMembersLink').style.display = 'none';
      document.getElementById('logPageLink').style.display = 'none';
    }

    showPage('dashboard');
  } else {
    document.getElementById('loginMessage').textContent = "Invalid email or password.";
  }
  e.target.reset();
});

// Logout Functionality
function logout() {
  currentUser = null;
  document.getElementById('dashboardPage').style.display = 'none';
  document.getElementById('loginPage').style.display = 'block';
  showPage('loginPage');
}

// Theme Toggle Functionality
document.getElementById('themeToggle').addEventListener('change', (e) => {
  const theme = e.target.value;
  document.body.classList.toggle('light-theme', theme === 'light');
  localStorage.setItem('theme', theme); // Save theme preference
});

// Load Saved Theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.getElementById('themeToggle').value = savedTheme;
document.body.classList.toggle('light-theme', savedTheme === 'light');

// Toggle Sidebar
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('active');
  const mainContent = document.querySelector('.main-content');
  mainContent.classList.toggle('sidebar-active');
}

// Initial Render
renderMembers();
renderManageMembers();
renderLogs();
showPage('loginPage');
