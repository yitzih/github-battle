const id = '5da4ef2285f827310d80'
const sec = "7581a0b66a440c297f6eebf3e2b89c06f4e8ba0a"
const params = `?client_id=${id}&client_secret=${sec}`

function getErrorMessage(msg, username) {
    if (message === 'Not Found') {
        return `${username} does not exist`
    }

    return message
}

function getProfile(username) {
    return fetch(`https://api.github.com/users/${username}${params}`)
        .then((res) => res.json())
        .then((profile) => {
            if (profile.message) {
                throw new Error(getErrorMessage(profile.message, username))
            }

            return profile
        })
}

function getRepos(username) {
    return fetch(`https://api.github.com/users/${username}/repos?${params}per_page=100`)
        .then((res) => res.json())
        .then((repos) => {
            if (repos.message) {
                throw new Error(getErrorMessage(profile.message, username))
            }

            return repos
        })
}

function getStarCount(repos) {
    return repos
        .reduce((total, {stargazers_count}) => total + stargazers_count, 0)
}

function calculateScore(followers, repos) {
    return (followers * 3) + getStarCount(repos)
}

function sortPlayers(players){
    return players.sort((a, b) => b.score - a.score)
}

function getUserData(player) {
    return Promise.all([
        getProfile(player),
        getRepos(player)
    ]).then(([profile, repos]) => ({
        profile,
        score: calculateScore(profile.followers, repos)
    })
)}

export function battle(players) {
    return Promise.all([
        getUserData(players[0]),
        getUserData(players[1])
    ]).then((results) => sortPlayers(results))
}

export function fetchPopularRepos(language) {
    const endpoint = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=starts&order=desc&type=Repositories`)

    return fetch(endpoint)
        .then((res) => res.json())
        .then((data) => {
            if (!data.items) {
                throw new Error(data.message)
            }

            return data.items
        })
}