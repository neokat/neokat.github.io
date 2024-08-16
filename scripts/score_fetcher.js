// ==UserScript==
// @name         Altador Cup Score Fetcher
// @version      0.1
// @description  Writes scores to json file for Altater Cup and Ratville Scoreboard
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

        const EXODUS_PLAYERS = [
            "goosesticks",
            "classicmess",
            "ckgknyangel",
            "nella_fantasia",
            "polarnights",
            "tinyroses18",
            "angel709317",
            "beckyx191",
            "howlsilver",
            "kio______lake",
            "macosten",
            "superkathiee",
            "d_a_r_e",
            "elhiwe",
            "lennekegirl123",
            "painted_neo_faerie",
            "puppylover9161",
            "honorrolle",
            "midnightswish",
            "claimedxscribblez",
            "hilary_duff_fan_16",
            "nostalgia",
            "_new_cassalla_",
            "aangchan",
            "hunni_bun_137",
            "orlytheowl",
            "ris1994",
            "catchinglights",
            "juliadoglover11405",
            "nurnurnur199",
            "zilaena",
            "mizsango",
            "justiquen",
            "scizor07",
            "idlegoth",
            "eleganza_lights",
            "sosunub",
            "rhianafaeriedoll",
            "cyancias",
            "yerimiese",
            "mbug1991",
            "moonzywolfgirl",
            "gamemaster32792",
            "callisto2002",
            "atritas",
            "doglover99_8",
            "mahnoosh",
            "merpiie"
        ]

        const RATVILLE_PLAYERS = [
            "superkathiee",
            "kat_bus",
            "rawbeee",
            "blumaroocrazy21",
            "sunbathr",
            "darkroast",
            "d_a_r_e",
            "the_gecko_dude_ii",
            "theguy2020",
            "ssushami",
            "roxi2rox",
            "dolphindancer789",
            "layces"
        ]

        const ALTATER_TEAMS = {
            "roo island": "Lost Roorawkuudor Mountain",
            "krawk island": "Lost Roorawkuudor Mountain",
            "terror mountain": "Lost Roorawkuudor Mountain",
            "shenkuu": "Lost Roorawkuudor Mountain",
            "altador": "Lost Roorawkuudor Mountain",
            "lost desert": "Lost Roorawkuudor Mountain",
            "haunted woods": "Haunted Darfennia Virtumyst",
            "darigan citadel": "Haunted Darfennia Virtumyst",
            "faerieland": "Haunted Darfennia Virtumyst",
            "tyrannia": "Haunted Darfennia Virtumyst",
            "virtupets": "Haunted Darfennia Virtumyst",
            "mystery island": "Haunted Darfennia Virtumyst",
            "kreludor": "Krelutarqua daMerivale",
            "moltara": "Krelutarqua daMerivale",
            "maraqua": "Krelutarqua daMerivale",
            "dacardia": "Krelutarqua daMerivale",
            "meridell": "Krelutarqua daMerivale",
            "brightvale": "Krelutarqua daMerivale",
            "kiko lake": "Traitor Potaters",
            "manually update": "Traitor Potaters"
        }

        const ALTATER_LOGOS = {
            "Lost Roorawkuudor Mountain": "https://imagizer.imageshack.com/img924/8383/k73tN2.png",
            "Haunted Darfennia Virtumyst": "https://imagizer.imageshack.com/img924/456/f7NYld.png",
            "Krelutarqua daMerivale": "https://imagizer.imageshack.com/img922/6522/hoKvtN.png",
            "Traitor Potaters": "https://images.neopets.com/games/betterthanyou/contestant402.gif"
        }

        const CLASSIC_LOGOS = {
            "roo island": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png",
            "krawk island": "https://images.neopets.com/altador/altadorcup/2010/popups/krawkisland/logo.png",
            "terror mountain": "https://images.neopets.com/altador/altadorcup/2010/popups/terrormountain/logo.png",
            "shenkuu": "https://images.neopets.com/altador/altadorcup/2010/popups/shenkuu/logo.png",
            "altador": "https://images.neopets.com/altador/altadorcup/2010/popups/altador/logo.png",
            "lost desert": "https://images.neopets.com/altador/altadorcup/2010/popups/lostdesert/logo.png",
            "haunted woods": "https://images.neopets.com/altador/altadorcup/2010/popups/hauntedwoods/logo.png",
            "darigan citadel": "https://images.neopets.com/altador/altadorcup/2010/popups/darigancitadel/logo.png",
            "faerieland": "https://images.neopets.com/altador/altadorcup/2010/popups/faerieland/logo.png",
            "tyrannia": "https://images.neopets.com/altador/altadorcup/2010/popups/tyrannia/logo.png",
            "virtupets": "https://images.neopets.com/altador/altadorcup/2010/popups/virtupets/logo.png",
            "mystery island": "https://images.neopets.com/altador/altadorcup/2010/popups/mysteryisland/logo.png",
            "kreludor": "https://images.neopets.com/altador/altadorcup/2010/popups/kreludor/logo.png",
            "moltara": "https://images.neopets.com/altador/altadorcup/2010/popups/moltara/logo.png",
            "maraqua": "https://images.neopets.com/altador/altadorcup/2010/popups/maraqua/logo.png",
            "dacardia": "https://images.neopets.com/altador/altadorcup/2010/popups/dacardia/logo.png",
            "meridell": "https://images.neopets.com/altador/altadorcup/2010/popups/meridell/logo.png",
            "brightvale": "https://images.neopets.com/altador/altadorcup/2010/popups/brightvale/logo.png",
            "kiko lake": "https://images.neopets.com/altador/altadorcup/2010/popups/kikolake/logo.png",
            "manually update": "https://images.neopets.com/altador/altadorcup/2010/popups/rooisland/logo.png"
        }

        const data = {};

        // Get level
        const h2Text = document.querySelector('.team-title h2').textContent.trim().toLowerCase();
        if (h2Text === 'your stats') {
            data.username = MY_USERNAME;
        } else {
            data.username = h2Text;
        }

        if (EXODUS_PLAYERS.includes(data.username) || RATVILLE_PLAYERS.includes(data.username)) {
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
            data.slsl_top_score = parseInt(slsSection.querySelector('li:nth-of-type(2) span').textContent.trim().replace(/,/g, ''));

            // Get Make Some Noise stats
            const msnSection = document.querySelector('section.gamestats:nth-of-type(3)');
            data.msn_games_played = parseInt(msnSection.querySelector('li:nth-of-type(1) span').textContent.trim().replace(/,/g, ''));
            data.msn_top_score = parseInt(msnSection.querySelector('li:nth-of-type(2) span').textContent.trim().replace(/,/g, ''));

            // Get Shootout Showdown stats
            const sosdSection = document.querySelector('section.gamestats:nth-of-type(4)');
            data.sosd_games_played = parseInt(sosdSection.querySelector('li:nth-of-type(1) span').textContent.trim().replace(/,/g, ''));
            data.sosd_top_score = parseInt(sosdSection.querySelector('li:nth-of-type(2) span').textContent.trim().replace(/,/g, ''));

            // Get current timestamp
            const timestamp = new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'});

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

            function removeByUsername(scores, username) {
                const index = scores.findIndex(entry => entry.username === username);
                if (index !== -1) {
                    scores.splice(index, 1);
                    console.log(`Removed user ${username}, will append stats`);
                } else {
                    console.log(`User ${username} not found, will add from scratch`);
                }
                return scores;
            }

            function updateScores(fileName, data, logos, teamName) {
                return gmXhrRequest('GET', fileName).then(response => {
                    const responseData = JSON.parse(response.responseText);
                    const gitSha = responseData.sha;
                    const scores = JSON.parse(atob(responseData.content));
                    removeByUsername(scores, data.username);

                    const total_score = (data.yyb_wins * 14) + (data.slsl_games_played * 10) + (data.msn_games_played * 3) + (data.sosd_games_played * 3);

                    scores.push({
                        "team_logo": logos[teamName],
                        "team_name": teamName,
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
                        "rank": data.rank,
                        "last_updated": timestamp
                    });

                    const fileContent = JSON.stringify(scores, null, 2);
                    const base64Content = btoa(unescape(encodeURIComponent(fileContent)));

                    const updateData = {
                        message: `Update scores.json for ${data.username} in ${fileName} at ${timestamp} NST`,
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
                    await updateScores('altater_scores.json', data, ALTATER_LOGOS, ALTATER_TEAMS[data.team_name]);
                }
                if (RATVILLE_PLAYERS.includes(data.username)) {
                    await updateScores('ratville_scores.json', data, CLASSIC_LOGOS, data.team_name);
                }
            };
            updateIfParticipant().catch(error => console.error('Error in updateIfParticipant:', error));

        } else {
            console.log(`User ${data.username} is not a participant in either the 2024 Altater Cup or the 2024 Ratville Scoreboard`)
        }
    }
)
();
