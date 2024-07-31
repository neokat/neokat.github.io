// ==UserScript==
// @name         Ratville AC Score Fetcher
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

        // FIRST TIME USERS MUST FILL IN THESE DETAILS!!!!
        const SECRET_GITHUB_TOKEN = 'abcdefghijklmnopqrstuvwxyz1234567890'
        const MY_USERNAME = 'superkathiee'

        const PARTICIPANTS = [
            "superkathiee",
            "kat_bus",
            "rawbeee",
            "blumaroocrazy21",
            "sunbathr"
        ]

        const data = {};

        // Get level
        const h2Text = document.querySelector('.team-title h2').textContent.trim().toLowerCase();
        if (h2Text === 'your stats') {
            data.username = MY_USERNAME;
        } else {
            data.username = h2Text;
        }

        if (PARTICIPANTS.includes(data.username)) {
            data.rank = document.querySelector('.team-title p').textContent.trim();

            const team_title_html = document.querySelector('.team-title').innerHTML;
            const teamNameMatch = team_title_html.match(/<!--<div class="team-name">([^<]+)<\/div>-->/);
            if (teamNameMatch) {
                data.team_name = teamNameMatch[1].trim().toLowerCase();
            } else {
                data.team_name = "manually update"
            }

            // Get Yooyuball stats
            const yybSection = document.querySelector('section.gamestats:nth-of-type(1)');
            data.yyb_goals_scored = parseInt(yybSection.querySelector('li:nth-of-type(1) span').textContent.trim().replace(/,/g, ''));
            data.yyb_wins = parseInt(yybSection.querySelector('li:nth-of-type(7) span').textContent.trim().replace(/,/g, ''));
            data.yyb_draws = parseInt(yybSection.querySelector('li:nth-of-type(8) span').textContent.trim().replace(/,/g, ''));

            // Get Slushie Slinger stats
            const slsSection = document.querySelector('section.gamestats:nth-of-type(2)');
            data.slsl_games_played = parseInt(slsSection.querySelector('li:nth-of-type(1) span').textContent.trim().replace(/,/g, ''));

            // Get Make Some Noise stats
            const msnSection = document.querySelector('section.gamestats:nth-of-type(3)');
            data.msn_games_played = parseInt(msnSection.querySelector('li:nth-of-type(1) span').textContent.trim().replace(/,/g, ''));

            // Get Shootout Showdown stats
            const sosdSection = document.querySelector('section.gamestats:nth-of-type(4)');
            data.sosd_games_played = parseInt(sosdSection.querySelector('li:nth-of-type(1) span').textContent.trim().replace(/,/g, ''));

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
            gmXhrRequest('GET', `https://api.github.com/repos/neokat/neokat.github.io/contents/ratville_scores.json`, {
                Authorization: `token ${SECRET_GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            })
                .then(response => {
                        const responseData = JSON.parse(response.responseText);
                        const git_sha = responseData.sha;
                        const scores = JSON.parse(atob(responseData.content));

                        const total_score = (data.yyb_wins * 14) + (data.slsl_games_played * 10) + (data.msn_games_played * 3) + (data.sosd_games_played * 3);

                        let userFound = false;
                        for (let i = 0; i < scores.length; i++) {
                            if (scores[i].username === data.username) {
                                scores[i].rank = data.rank;
                                scores[i].yyb_wins = data.yyb_wins;
                                scores[i].yyb_draws = data.yyb_draws;
                                scores[i].slsl_wins = data.slsl_games_played;
                                scores[i].msn_plays = data.msn_games_played;
                                scores[i].sosd_plays = data.sosd_games_played;
                                scores[i].total_score = total_score;
                                scores[i].last_updated = timestamp;
                                userFound = true;
                                break;
                            }
                        }

                        const team_logo = {
                            "roo island": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "krawk island": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "terror mountain": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "shenkuu": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "altador": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "lost desert": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "haunted woods": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "darigan citadel": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "faerieland": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "tyrannia": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "virtupets": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "mystery island": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "kreludor": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "moltara": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "maraqua": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "dacardia": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "meridell": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "brightvale": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "kiko lake": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
                            "manually update": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png"
                        }

                        if (!userFound) {
                            scores.push({
                                "team_logo": team_logo[data.team_name],
                                "username": data.username,
                                "yyb_wins": data.yyb_wins,
                                "yyb_draws": data.yyb_draws,
                                "slsl_wins": data.slsl_games_played,
                                "msn_plays": data.msn_games_played,
                                "sosd_plays": data.sosd_games_played,
                                "total_score": total_score,
                                "rank": data.rank,
                                "last_updated": timestamp
                            });
                        }

                        const fileContent = JSON.stringify(scores, null, 2);
                        const base64Content = btoa(unescape(encodeURIComponent(fileContent)));


                        // Prepare the data to update the JSON file
                        const updateData = {
                            message: `Update scores.json for ${data.username} at ${timestamp} NST`,
                            content: base64Content,
                            branch: `main`
                        };

                        // Get the SHA of the file to be updated
                        gmXhrRequest('GET', `https://api.github.com/repos/neokat/neokat.github.io/contents/ratville_scores.json`, {
                            Authorization: `token ${SECRET_GITHUB_TOKEN}`,
                            Accept: 'application/vnd.github.v3+json'
                        })
                            .then(response => {
                                const responseData = JSON.parse(response.responseText);
                                updateData.sha = git_sha;

                                // Update the file in the repository
                                return gmXhrRequest('PUT', `https://api.github.com/repos/neokat/neokat.github.io/contents/ratville_scores.json`, {
                                    Authorization: `token ${SECRET_GITHUB_TOKEN}`,
                                    Accept: 'application/vnd.github.v3+json'
                                }, JSON.stringify(updateData));
                            })
                            .then(response => {
                                console.log(`File updated successfully for ${data.username}`, JSON.parse(response.responseText));
                            })
                            .catch(error => {
                                console.error('Error updating file:', error.response ? JSON.parse(error.responseText) : error.message);
                            });
                    }
                )
        } else {
            console.log(`User ${data.username} is not a participant in Ratville's 2024 Altador Cup`)
        }
    }
)
();
