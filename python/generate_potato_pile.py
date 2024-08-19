import csv
import json
import random

pile = []
with open('../data/potato_counts.csv', mode='r') as counts_file:
    csv_reader = csv.DictReader(counts_file)
    for row in csv_reader:
        username = row['username']
        potatoes = int(row['potatoes'])
        team = row['team']

        for _ in range(potatoes):
            pile.append({'username': username, 'team': team, 'potatoes': potatoes})

random.shuffle(pile)

with open('../data/potato_pile.json', 'w') as pile_file:
    json.dump(pile, pile_file, indent=4)

print("potato pile written")
