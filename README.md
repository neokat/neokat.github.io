# neokat.github.io
Contains scripts to generate automatic scoreboards for the Neopets Altador Cup and display on GitHub Pages, as well as python scripts to help with the Altater Cup.

-----

## Automatic Scoreboards
Two automatic Altador Cup scoreboards are configured for Exodus and Ratville respectively.
* `altater.html` is populated with AC score data from `altater_scores.json`
* `ratville.html` is populated with AC score data from `ratville_scores.json`

Due to Neopets limitations on bot activity and the AC userstats page being behind the login page, the score data needs to be scraped semi-manually. This is done with the `scripts/score_fetcher.js` Tampermonkey script.

### Installing Tampermonkey Script
1. Copy contents of `scripts/score_fetcher.js` and paste into a new Tampermonkey script
2. Create a new GitHub personal access token on your account. [Instructions can be found here.](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) You will need to grant it write access to this repository.
3. Upon first use, fill in the constant values:
```javascript
// FIRST TIME USERS MUST FILL IN THESE DETAILS!!!!
const SECRET_GITHUB_TOKEN = '<your_secret_github_token>'
const MY_USERNAME = '<your_neopets_username>'
```

### Updating the Scoreboard
The script works by updating the respective `_scores.json` file every time you visit the userstats page of a player. The userstats page of each player is hyperlinked in the `USERNAME` column of the scoreboard. Typical update process is as follows:
1. Navigate to the [Altater Cup](https://neokat.github.io/altater.html) or [Ratville](https://neokat.github.io/ratville.html) scoreboard
2. Make your way down the username column, clicking on each name (**cmd+click** to open in a new tab). Wait about 5 seconds between each click so that the stats page will load and it will successfully write the update to GitHub. (**FUTURE ENHANCEMENT TODO:** add retry logic in the case of the race condition when multiple userstats pages are opened at the same time)
3. After all userstats pages have been visited, wait about 3-5 minutes for the `pages-build-deployment` GitHub action to complete running. You can view status [here](https://github.com/neokat/neokat.github.io/actions). (**NOTE:** each userstats update creates a new commit in the repo, which triggers a new GitHub action run, and cancels the previous pending GHA run. Sometimes GHA takes a minute to fully catch up. For page updates to take effect, you need to wait for the **most recent** GHA run to succeed.)
4. Once the deploy is complete, hard refresh the scoreboard page (**cmd+shift+R**)
5. Scan the `LAST UPDATED (NST)` column to make sure each player's stats wer updated successfully, i.e. the update time is within the last ~10 minutes. If it's out of date, click on their usrname again to force the update.

### Adding New Players to Scoreboard
* To add a new player, add them to the respective list as defined by the constants `EXODUS_PLAYERS` and `RATVILLE_PLAYERS` in the script.
* When someone new is first added to the players list, they will not appear on the HTML scoreboard page. To make them appear, visit their userstats page:
```https://www.neopets.com/altador/colosseum/userstats.phtml?username=<USERNAME>```
* **FUTURE ENHANCEMENT TODO:** update script to read list of players for each scoreboard from a GitHub file. Currently, the tampermonkey script(s) and `scripts/score_fetcher.js` files must BOTH be updated when new players are added.

-----

## The Altater Cup
Exodus companion event for the Altador Cup.

Python scripts require **python 3.9**. Recommend using `pyenv` and `pipenv` for Python version/virtual env management.

### Generate CSV for Participant Tracking
```zsh
cd python
pipenv shell
python generate_csv.py
```
These commands will generate a file that reads in `altater_scores.json`, turns it into a csv for easy copy/pasting, and then publishes to a file named `publish/mm-dd-yyy.csv`. This file can then be copy/pasted into the **Auto Scores** tab of the master Participant Tracking google sheet.

### The Potato Pile
> Your name will be written on every potato you earn during the Altater Cup. These potatoes will then be placed in a giant pile, mixed around, and names/potatoes will be drawn. The order in which the potatoes are drawn will determine the ORDER in which Altater Cup participants will choose their prizes (one at a time) from the Gift Shoppe!

In order to generate the `pile.html` webpage:
1. Download the **Potato Pile** tab as a csv from the master Participant Tracking google sheet
2. Copy/paste contents into `data/potato_counts.csv`
3. Run `generate_potato_pile.py` script, which will generate `data/potato_pile.json` which populates the `pile.html` page:
```zsh
cd python
pipenv shell
python generate_potato_pile.py
```
4. Commit and push changes
5. Wait for the GitHub pages build deployment action to finish running, and then hard refresh the page

-----

## Archive Directory
Contains record of historic pages. Current contents of the archive directory include:
* Final Altater Cup scoreboard from 2021
* Old potato pile page that will grey out all potatoes of selected user on click