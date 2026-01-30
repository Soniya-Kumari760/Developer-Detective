const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const profileCard = document.getElementById("profileCard");
const reposContainer = document.getElementById("reposContainer");
const errorMsg = document.getElementById("errorMsg");
const themeToggle = document.getElementById("themeToggle");

searchBtn.addEventListener("click", fetchUser);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") fetchUser();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

async function fetchUser() {
  const username = searchInput.value.trim();
  if (!username) {
    errorMsg.textContent = "Please enter a username!";
    return;
  }

  errorMsg.textContent = "";
  profileCard.style.display = "none";
  reposContainer.innerHTML = "";

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) throw new Error("User not found");

    const userData = await userRes.json();
    showProfile(userData);

    const repoRes = await fetch(userData.repos_url);
    const reposData = await repoRes.json();
    showRepos(reposData.slice(0, 5));
  } catch (error) {
    errorMsg.textContent = error.message;
  }
}

function showProfile(user) {
  profileCard.innerHTML = `
    <img src="${user.avatar_url}" />
    <h2>${user.name || "No Name"}</h2>
    <p>@${user.login}</p>
    <p>${user.bio || "No bio available"}</p>

    <div class="stats">
      <p>Repos: ${user.public_repos}</p>
      <p>Followers: ${user.followers}</p>
      <p>Following: ${user.following}</p>
    </div>
  `;
  profileCard.style.display = "block";
}

function showRepos(repos) {
  reposContainer.innerHTML = "<h3>Top Repositories</h3>";
  repos.forEach(repo => {
    const div = document.createElement("div");
    div.className = "repo";
    div.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      <p>⭐ ${repo.stargazers_count}</p>
    `;
    reposContainer.appendChild(div);
  });
}
