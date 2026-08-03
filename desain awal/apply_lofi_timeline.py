import os
import glob
from bs4 import BeautifulSoup
import re

directory = r'c:\wamp64\www\FinalProject\desain awal'

html_files = glob.glob(os.path.join(directory, '*.html'))

for file_path in html_files:
    if "00-hierarki" in file_path:
        continue

    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # Timeline
    for item in soup.find_all('div', class_='wf-timeline-item'):
        time_div = item.find('div', class_='time')
        if time_div:
            time_div.string = '[Waktu]'
        desc_div = item.find('div', class_='desc')
        if desc_div:
            desc_div.string = '[Deskripsi Aktivitas]'

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(str(soup))
        
    print(f"Processed {file_path}")

print("Done timeline processing.")
