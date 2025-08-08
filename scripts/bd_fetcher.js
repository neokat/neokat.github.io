// ==UserScript==
// @name         Exodus Battledome Score Fetcher
// @version      0.1
// @description  Writes battledome wins and scores to json file for Exodus Battledome Challenge.
// @author       Kat
// @match        *www.neopets.com/dome/record.phtml?username=*
// @grant        GM.xmlHttpRequest
// @grant        GM_addElement
// @connect      api.github.com
// @require      https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js
// ==/UserScript==

(function () {
        'use strict';

        // FIRST TIME USERS MUST FILL IN THESE DETAILS!!!!
        const SECRET_GITHUB_TOKEN = 'abcdefghijklmnopqrstuvwxyz1234567890'

        const EXODUS_PLAYERS = [
            "goosesticks",
            "superkathiee",
            "nostalgia",
            "hunni_bun_137",
            "ferulax",
            "hilary_duff_fan_16",
            "rhianafaeriedoll"
        ]

        const data = {};

        // get username
        const usernameElement = document.querySelector('#bdFR_username a');
        data.username = usernameElement.textContent;


        if (EXODUS_PLAYERS.includes(data.username)) {

            // get battledome stats
            const totalWinsText = document.querySelector('#BDFR_totalWins').textContent;
            const totalScoreText = document.querySelector('#BDFR_totalScore').textContent;

            data.current_wins = parseInt(totalWinsText.replace(/,/g, ''), 10);
            data.current_score = parseInt(totalScoreText.replace(/,/g, ''), 10);

            console.log('Current Wins:', data.current_wins);
            console.log('Current Score:', data.current_score);

            // get current timestamp
            data.timestamp = new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'});

            // Helper function to make HTTP requests with GM.xmlHttpRequest
            function gmXhrRequest(method, fileName, data) {
                let url = `https://api.github.com/repos/neokat/neokat.github.io/contents/${fileName}`
                let headers = {
                    Authorization: `token ${SECRET_GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json'
                }
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

            function getExistingEntry(scores, username) {
                const index = scores.findIndex(entry => entry.username === username);
                if (index !== -1) {
                    const existingEntry = scores[index];
                    console.log(`Found user ${username}, will update stats`);
                    return existingEntry;
                } else {
                    console.log(`User ${username} not found, will add from scratch`);
                    return null;
                }
            }

            function updateScores(fileName, data) {
                return gmXhrRequest('GET', fileName).then(response => {
                    console.log(response);
                    const responseData = JSON.parse(response.responseText);
                    const gitSha = responseData.sha;
                    const scores = JSON.parse(atob(responseData.content.trim()));

                    const existingEntry = getExistingEntry(scores, data.username);


                     if (existingEntry) {
                        existingEntry.current_wins = data.current_wins;
                        existingEntry.current_score = data.current_score;
                        existingEntry.last_updated = data.timestamp;
                        existingEntry.total_wins = data.current_wins - existingEntry.starting_wins;
                        existingEntry.total_score = data.current_score - existingEntry.starting_score;
                    } else {
                        scores.push({
                            "potato_logo": "potatoes/marathon.png",
                            "username": data.username,
                            "starting_wins": data.current_wins,
                            "starting_score": data.current_score,
                            "starting_stats_captured": data.timestamp,
                            "current_wins": data.current_wins,
                            "current_score": data.current_score,
                            "last_updated": data.timestamp,
                            "total_wins": 0,
                            "total_score": 0
                        });
                    }

                    const fileContent = JSON.stringify(scores, null, 2);
                    const base64Content = btoa(unescape(encodeURIComponent(fileContent)));

                    const updateData = {
                        message: `Update bd_scores.json for ${data.username} in ${fileName} at ${data.timestamp} NST`,
                        content: base64Content,
                        branch: `main`,
                        sha: gitSha
                    };
                    return gmXhrRequest('PUT', fileName, JSON.stringify(updateData)).then(response => {
                        console.log(`Updated successfully for ${data.username} in ${fileName}`, JSON.parse(response.responseText));
                    }).catch(error => {
                        console.error('Error updating file:', error.response ? JSON.parse(error.responseText) : error.message);
                    });
                });
            }

            const updateIfParticipant = async () => {
                if (EXODUS_PLAYERS.includes(data.username)) {
                    await updateScores('bd_scores.json', data);
                }
            };
            updateIfParticipant().catch(error => console.error('Error in updateIfParticipant:', error));

        } else {
            console.log(`User ${data.username} is not a participant in 2025 Exodus Battledome Challenge.`);
        }
    }
)
();
