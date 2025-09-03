// ==UserScript==
// @name         Exodus Battledome Score Fetcher
// @version      0.2
// @description  Writes battledome wins and scores to json file for Exodus Battledome Challenge.
// @author       Kat
// @match        *www.neopets.com/guilds/guild_members.phtml?id=4182838*
// @grant        GM.xmlHttpRequest
// @grant        GM_addElement
// @connect      api.github.com
// @require      https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js
// @icon         https://github.com/neokat/neokat.github.io/blob/main/potatoes/drenched_icon.png?raw=true
// ==/UserScript==

(function () {
    'use strict';
    // FIRST TIME USERS FILL THESE TWO VALUES IN!
    const SECRET_GITHUB_TOKEN = 'abcdefghijklmnopqrstuvwxyz1234567890';
    const MY_NAME = "Kat";

    const FILE_NAME = 'members.json';
    const rightNow = new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'});
    const memberRows = document.querySelectorAll("table table tr");

    function getMemberData(memberRows) {
        const members = [];
        memberRows.forEach((row, idx) => {
            if (idx === 0) return; // skip header row
            const cols = row.querySelectorAll("td");
            if (cols.length >= 5) {
                const username = cols[0].innerText.trim().replace(/\s+/g, " ");
                const rank = cols[1].innerText.trim();
                const posts = parseInt(cols[3].innerText.trim(), 10) || 0;
                members.push({username, rank, current_post_count: posts});
            }
        });
        return members;
    }

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

    function updateMembersJson(fileName, memberData) {
        return gmXhrRequest('GET', fileName).then(response => {
            const responseData = JSON.parse(response.responseText);
            const gitSha = responseData.sha;
            const membersJson = JSON.parse(atob(responseData.content.trim()));

            memberData.forEach(member => {
                const existingMember = membersJson.find(m => m.username === member.username);
                if (existingMember) {
                    existingMember.current_post_count = member.current_post_count;
                    existingMember.rank = member.rank;
                    existingMember.last_updated = rightNow;
                } else {
                    membersJson.push({
                        username: member.username,
                        rank: member.rank,
                        starting_post_count: member.current_post_count,
                        current_post_count: member.current_post_count,
                        added_on: rightNow,
                        last_updated: rightNow
                    });
                }
            });

            const updatedContent = JSON.stringify(membersJson, null, 2);
            const base64Content = btoa(unescape(encodeURIComponent(updatedContent)));

            const updateData = {
                message: `Update members.json by ${MY_NAME} at ${rightNow} NST`,
                content: base64Content,
                branch: 'main',
                sha: gitSha
            };

            return gmXhrRequest('PUT', fileName, JSON.stringify(updateData)).then(response => {
                console.log('Successfully updated members.json:', JSON.parse(response.responseText));
            }).catch(error => {
                console.error('Error updating members.json:', error.response ? JSON.parse(error.responseText) : error.message);
            });
        });
    }

    const memberData = getMemberData(memberRows);
    updateMembersJson(FILE_NAME, memberData)
        .then(() => {
            console.log('members file updated successfully.');
        })
        .catch((error) => {
            console.error('failed to update members file:', error);
        });
})();