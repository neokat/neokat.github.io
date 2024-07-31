import pandas as pd
import json
from datetime import datetime

input_file = 'scores.json'

# Generate filename with today's date
today_date = datetime.now().strftime('%m-%d-%Y')
output_file = f'publish/{today_date}.csv'

# Read the JSON file
with open(input_file, 'r') as f:
    data = json.load(f)

# Convert JSON to DataFrame
df = pd.json_normalize(data)

# Save DataFrame to CSV
df.to_csv(output_file, index=False)

print(f'CSV file successfully created: {output_file}')
