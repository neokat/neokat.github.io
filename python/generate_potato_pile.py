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

        for _ in range(int(row['rank'])):
            pile.append({'username': username, 'team': team, 'type': 'rank'})
        for _ in range(int(row['pledge'])):
            pile.append({'username': username, 'team': team, 'type': 'pledge'})
        for _ in range(int(row['activities'])):
            pile.append({'username': username, 'team': team, 'type': 'activities'})
        for _ in range(int(row['chatting'])):
            pile.append({'username': username, 'team': team, 'type': 'chatting'})
        for _ in range(int(row['marathon'])):
            pile.append({'username': username, 'team': team, 'type': 'marathon'})
        for _ in range(int(row['mvp'])):
            pile.append({'username': username, 'team': team, 'type': 'mvp'})
        for _ in range(int(row['busybee'])):
            pile.append({'username': username, 'team': team, 'type': 'busybee'})

random.shuffle(pile)
print(f"There are {len(pile)} potatoes in the pile")

with open('../data/potato_pile.json', 'w') as pile_file:
    json.dump(pile, pile_file, indent=4)

print("potato pile written")
