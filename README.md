# neokat.github.io
Contains scripts to generate automatic scoreboards for the Neopets Altador Cup and display on Github Pages, as well as python scripts to help with the Altater Cup.

## Automatic Scoreboards
TODO

## The Altater Cup
Exodus companion event for the Altador Cup.

Python scripts require python 3.9. Recommend using `pyenv` and `pipenv` for Python version/virtual env management.

### Generate CSV for Participant Tracking
```
cd python
pipenv shell
python generate_csv.py
```
These commands will generate a file that reads in `altater_scores.json`, turns it into a csv for easy copy/pasting, and then publishes to a file named `publish/mm-dd-yyy.csv`. This file can then be copy/pasted into the Auto Scores tab of the master Participant Tracking google sheet.

### The Potato Pile
> Your name will be written on every potato you earn during the Altater Cup. These potatoes will then be placed in a giant pile, mixed around, and names/potatoes will be drawn. The order in which the potatoes are drawn will determine the ORDER in which Altater Cup participants will choose their prizes (one at a time) from the Gift Shoppe!

In order to generate the `potatoes.html` webpage, do the following...
1. Download the **Potato Pile** tab as a csv from the master Participant Tracking google sheet
2. Copy/paste contents into `potato_counts.csv`
3. Run the generate potato pile Python script, which will generate `data/potato_pile.json` which populates the `potatoes.html` page:
```
cd python
pipenv shell
python generate_potato_pile.py
```
4. Commit and push changes
5. Wait for the Github pages build deployment action to finish running, and then hard refresh the page