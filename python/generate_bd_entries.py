import csv
import json
import random

tickets = []

top_5 = ["zanzibar37","nostalgia","moonzywolfgirl","rhianafaeriedoll","superkathiee"]
random_potatoes = ["marathon.png", "activities.png", "pea.png", "wand.png"]

def pick_img(user):
    if user in top_5:
        rank = top_5.index(user) + 1
        return f"potatoes/marathon_{rank}.png"
    else:
        return random.choice(random_potatoes)


with open('../data/battle_entries.csv', mode='r') as counts_file:
    csv_reader = csv.DictReader(counts_file)
    for row in csv_reader:
        username = row['username']
        total_tix = int(row['total_tix'])
        tier = row['tier']

        for _ in range(total_tix):
            tickets.append({'username': username, 'tier': tier, 'img': pick_img(username)})

random.shuffle(tickets)
print(f"There are {len(tickets)} potatoes in the pile")

with open('../data/battle_tickets.json', 'w') as ticket_file:
    json.dump(tickets, ticket_file, indent=4)

print("potato pile written")




