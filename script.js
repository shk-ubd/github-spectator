var baseUrl = "https://api.github.com/users/"
let userName
function checkEnterKey(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        userName = document.getElementById('search').value
        console.log("You have entered: ", userName)
        getUserData(userName)
    }
}

async function getUserData(userName) {
    try {
        let data = await fetch(baseUrl + userName)
        if (data.status === 404) {
            console.log("user not found")
            document.querySelector('main').innerHTML = `<img class="image-er" src="assets/download.png" > 
        <h1 class="heading-er">Oops! User not found</h1>
        <p class="para-er">Please enter a valid GitHub username :)</p> `
            return
        }
        data = await data.json()

        let repoData = await getRepos(userName)



        console.log(data)
        console.log("in the getUserData Function", repoData)
        displayDetails(data, repoData)
    }
    catch (err) {
        console.log(err)
    }
}

async function getRepos(userName) {
    try {
        let repoData = await fetch(baseUrl + userName + "/repos?sort=created")
        repoData = await repoData.json()
        console.log("in the getRepos function", repoData)
        return repoData

    }
    catch (err) {
        console.error(err);
    }

}


async function displayDetails(data, repos) {

    data.name = data.name === null ? userName : data.name;
    data.bio = data.bio === null ? "---" : data.bio;



    let card = `<div class="user-card flex">

    <div class="profile-picture"><img class="pf-img" src="${data.avatar_url}" alt=""></div>

    <div class="profile-info">
        <h1>${data.name}</h1>
        <p class="user-bio">${data.bio}</p>
        <ul>
            <li>${data.following} <strong>Following</strong> </li>
            <li>${data.followers} <strong>Followers</strong> </li>
            <li>${repos.length} <strong>Repositories</strong> </li>
        </ul>
        <div class="user-repos" id="user-repos">
        </div>
    </div>

    </div>`


    document.querySelector('main').innerHTML = card
    let reposContainer = document.getElementById("user-repos")
    repos.slice(0, 7).forEach(element => {

        let tag = document.createElement('a')
        tag.innerHTML = element.name
        tag.href = `https://github.com/${userName}/${element.name}`

        reposContainer.appendChild(tag)
    });
    if (repos.length > 7) {
        let seeAllButton = document.createElement('a')
        // https://github.com/shk-ubd?tab=repositories
        seeAllButton.innerHTML = "see all repos..."
        seeAllButton.classList.add("active")
        seeAllButton.href = `https://github.com/${userName}?tab=repositories`
        reposContainer.append(seeAllButton)
    }
}


