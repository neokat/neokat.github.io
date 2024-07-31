// ==UserScript==
// @name         Altater Cup Score Fetcher
// @version      0.1
// @description  Writes scores to json file
// @author       Kat
// @match        *www.neopets.com/altador/colosseum/userstats.phtml?username=*
// @grant        GM.xmlHttpRequest
// @grant        GM_addElement
// @connect      api.github.com
// @require      https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js
// ==/UserScript==

(function () {
    'use strict';

    const data = {};
    const SECRET_GITHUB_TOKEN = 'abcdefghijklmnopqrstuvwxyz1234567890'

    // Get level
    const h2Text = document.querySelector('.team-title h2').textContent.trim().toLowerCase();
    if (h2Text === 'your stats') {
        data.username = 'superkathiee';
    } else {
        data.username = h2Text;
    }

    data.level = document.querySelector('.team-title p').textContent.trim().split(' ')[1];

    // Get Yooyuball stats
    const yybSection = document.querySelector('section.gamestats:nth-of-type(1)');
    data.yyb_goals_scored = parseInt(yybSection.querySelector('li:nth-of-type(1) span').textContent.trim());
    data.yyb_wins = parseInt(yybSection.querySelector('li:nth-of-type(7) span').textContent.trim());
    data.yyb_draws = parseInt(yybSection.querySelector('li:nth-of-type(8) span').textContent.trim());

    // Get Slushie Slinger stats
    const slsSection = document.querySelector('section.gamestats:nth-of-type(2)');
    data.slsl_games_played = parseInt(slsSection.querySelector('li:nth-of-type(1) span').textContent.trim());
    data.slsl_top_score = parseInt(slsSection.querySelector('li:nth-of-type(2) span').textContent.trim());

    // Get Make Some Noise stats
    const msnSection = document.querySelector('section.gamestats:nth-of-type(3)');
    data.msn_games_played = parseInt(msnSection.querySelector('li:nth-of-type(1) span').textContent.trim());
    data.msn_top_score = parseInt(msnSection.querySelector('li:nth-of-type(2) span').textContent.trim());

    // Get Shootout Showdown stats
    const sosdSection = document.querySelector('section.gamestats:nth-of-type(4)');
    data.sosd_games_played = parseInt(sosdSection.querySelector('li:nth-of-type(1) span').textContent.trim());
    data.sosd_top_score = parseInt(sosdSection.querySelector('li:nth-of-type(2) span').textContent.trim());

    // Get current timestamp
    const timestamp = new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'});

    // Helper function to make HTTP requests with GM.xmlHttpRequest
    function gmXhrRequest(method, url, headers, data) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: method,
                url: url,
                headers: headers,
                data: data,
                onload: (response) => resolve(response),
                onerror: (error) => reject(error)
            });
        });
    }

    // Get the SHA and content of the existing file
    gmXhrRequest('GET', `https://api.github.com/repos/neokat/neokat.github.io/contents/scores.json`, {
        Authorization: `token ${SECRET_GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
    })
        .then(response => {
            const responseData = JSON.parse(response.responseText);
            const git_sha = responseData.sha;
            const scoresData = JSON.parse(atob(responseData.content));

            const total_score = (data.yyb_wins * 14) + (data.slsl_games_played * 10) + (data.msn_games_played * 3) + (data.sosd_games_played * 3);

            let userFound = false;
            for (let i = 0; i < scoresData.scores.length; i++) {
                if (scoresData.scores[i].username === data.username) {
                    scoresData.scores[i].rank = `Level ${data.level}`;
                    scoresData.scores[i].yyb_wins = data.yyb_wins;
                    scoresData.scores[i].yyb_draws = data.yyb_draws;
                    scoresData.scores[i].yyb_high_score = data.yyb_goals_scored;
                    scoresData.scores[i].slsl_wins = data.slsl_games_played;
                    scoresData.scores[i].slsl_high_score = data.slsl_top_score;
                    scoresData.scores[i].msn_plays = data.msn_games_played;
                    scoresData.scores[i].msn_high_score = data.msn_top_score;
                    scoresData.scores[i].sosd_plays = data.sosd_games_played;
                    scoresData.scores[i].sosd_high_score = data.sosd_top_score;
                    scoresData.scores[i].total_score = total_score;
                    scoresData.scores[i].last_updated = timestamp;
                    userFound = true;
                    break;
                }
            }

            if (!userFound) {
                scoresData.scores.push({
                    "team_logo": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                    "username": data.username,
                    "yyb_wins": data.yyb_wins,
                    "yyb_draws": data.yyb_draws,
                    "yyb_high_score": data.yyb_goals_scored,
                    "slsl_wins": data.slsl_games_played,
                    "slsl_high_score": data.slsl_top_score,
                    "msn_plays": data.msn_games_played,
                    "msn_high_score": data.msn_top_score,
                    "sosd_plays": data.sosd_games_played,
                    "sosd_high_score": data.sosd_top_score,
                    "total_score": total_score,
                    "rank": `Level ${data.level}`,
                    "last_updated": timestamp
                });
            }

            scoresData.last_updated = timestamp;


            const fileContent = JSON.stringify(scoresData, null, 2);
            const base64Content = btoa(unescape(encodeURIComponent(fileContent)));


            // Prepare the data to update the JSON file
            const updateData = {
                message: `Update scores.json for ${data.username} at ${timestamp} NST`,
                content: base64Content,
                branch: `main`
            };

            // Get the SHA of the file to be updated
            gmXhrRequest('GET', `https://api.github.com/repos/neokat/neokat.github.io/contents/scores.json`, {
                Authorization: `token ${SECRET_GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            })
                .then(response => {
                    const responseData = JSON.parse(response.responseText);
                    updateData.sha = git_sha;

                    // Update the file in the repository
                    return gmXhrRequest('PUT', `https://api.github.com/repos/neokat/neokat.github.io/contents/scores.json`, {
                        Authorization: `token ${SECRET_GITHUB_TOKEN}`,
                        Accept: 'application/vnd.github.v3+json'
                    }, JSON.stringify(updateData));
                })
                .then(response => {
                    console.log('File updated successfully:', JSON.parse(response.responseText));
                })
                .catch(error => {
                    console.error('Error updating file:', error.response ? JSON.parse(error.responseText) : error.message);
                });
        })
})();
