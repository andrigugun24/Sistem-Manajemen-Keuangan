import os
import glob
from bs4 import BeautifulSoup
import re

directory = r'c:\wamp64\www\FinalProject\desain awal'

# 1. Update wireframe-style.css to be pure low-fidelity
css_path = os.path.join(directory, 'wireframe-style.css')
css_content = """@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

/* Base styles and reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --wf-bg: #ffffff;
    --wf-surface: #ffffff;
    --wf-text-primary: #000000;
    --wf-text-secondary: #000000;
    --wf-text-muted: #333333;
    --wf-border: #000000;
    --wf-border-light: #000000;
    --wf-primary: #ffffff;
    --wf-primary-light: #ffffff;
    --wf-danger: #ffffff;
    --wf-radius: 4px;
    --wf-radius-lg: 4px;
    --wf-shadow: none;
    --wf-shadow-sm: none;
}

body {
    background-color: var(--wf-bg);
    color: var(--wf-text-primary);
    font-family: 'Inter', sans-serif;
    line-height: 1.5;
}

/* Layout */
.wf-layout { display: flex; min-height: 100vh; }

/* Sidebar */
.wf-sidebar {
    width: 260px;
    background-color: var(--wf-surface);
    border-right: 1px solid var(--wf-border);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}

.wf-sidebar-brand {
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid var(--wf-border);
}

.wf-sidebar-logo {
    width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--wf-border);
    border-radius: var(--wf-radius);
    background-color: #ffffff; color: #000000;
}

.wf-sidebar-brand-text h2 { font-size: 16px; font-weight: 700; color: #000; margin: 0; }
.wf-sidebar-brand-text span { font-size: 12px; color: #000; }

.wf-sidebar-nav {
    padding: 20px 16px; flex: 1; overflow-y: auto;
    display: flex; flex-direction: column; gap: 24px;
}

.wf-nav-section { display: flex; flex-direction: column; gap: 8px; }
.wf-nav-section-title { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #000; padding: 0 12px; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 4px; }

.wf-nav-item {
    display: flex; align-items: center; gap: 12px; padding: 10px 12px;
    border-radius: var(--wf-radius); color: #000; text-decoration: none; font-size: 14px; font-weight: 500;
}
.wf-nav-item:hover, .wf-nav-item.active { border: 1px solid #000; }

.wf-sidebar-footer { padding: 20px; border-top: 1px solid var(--wf-border); display: flex; align-items: center; gap: 12px; }
.wf-sidebar-avatar { width: 36px; height: 36px; border: 1px solid #000; background: #fff; color: transparent; border-radius: 50%; }
.wf-sidebar-user-info .name, .wf-sidebar-user-info .role { color: #000; }

/* Main Content */
.wf-main { flex: 1; display: flex; flex-direction: column; overflow-x: hidden; background-color: #fff; }

.wf-header {
    height: 72px; padding: 0 32px; display: flex; align-items: center; justify-content: space-between;
    background-color: #fff; border-bottom: 1px solid #000;
}

.wf-breadcrumb { color: #000; font-size: 14px; }
.wf-breadcrumb .current { font-weight: 600; }
.wf-year-tag { border: 1px solid #000; padding: 6px 12px; border-radius: var(--wf-radius); font-size: 13px; color: #000; }
.wf-header-btn { width: 40px; height: 40px; border: 1px solid #000; border-radius: var(--wf-radius); background: #fff; color: #000; display: flex; align-items: center; justify-content: center; }

.wf-content { padding: 32px; flex: 1; display: flex; flex-direction: column; gap: 24px; max-width: 1200px; margin: 0 auto; width: 100%; }

.wf-page-header h2 { font-size: 24px; color: #000; margin-bottom: 4px; }
.wf-page-header p { font-size: 14px; color: #000; }

.wf-welcome-card { border: 1px solid #000; border-radius: var(--wf-radius); padding: 24px; display: flex; gap: 24px; }
.wf-welcome-avatar { width: 64px; height: 64px; border: 1px solid #000; border-radius: var(--wf-radius); }
.wf-welcome-text h3, .wf-welcome-text p { color: #000; }

.wf-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }
.wf-stat-card { border: 1px solid #000; border-radius: var(--wf-radius); padding: 24px; display: flex; align-items: flex-start; gap: 16px; background: #fff; }
.wf-stat-icon { width: 48px; height: 48px; border: 1px solid #000; display: flex; align-items: center; justify-content: center; background: #fff !important; color: #000 !important; border-radius: var(--wf-radius); }
.wf-stat-info h4 { font-size: 13px; color: #000; }
.wf-stat-info .value { font-size: 24px; font-weight: 700; color: #000; min-height: 36px; border-bottom: 1px dashed #000; width: 100px; display: inline-block; margin-top: 8px;}
.wf-stat-info .sub { font-size: 12px; color: #000; margin-top: 4px; }

.wf-card { border: 1px solid #000; border-radius: var(--wf-radius); background: #fff; }
.wf-card-header { padding: 20px 24px; border-bottom: 1px solid #000; }
.wf-card-header h3 { font-size: 16px; color: #000; margin: 0; }
.wf-card-body { padding: 24px; }

/* Forms & Tables */
.wf-btn { border: 1px solid #000; background: #fff; color: #000; padding: 10px 16px; border-radius: var(--wf-radius); cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; }
.wf-btn:hover { background: #eee; }
.wf-filter-bar { display: flex; gap: 16px; padding: 16px 24px; border-bottom: 1px solid #000; }
.wf-form-input, .wf-form-select { border: 1px solid #000; padding: 10px 12px; border-radius: var(--wf-radius); background: #fff; color: #000; }

.wf-table-wrapper { width: 100%; overflow-x: auto; }
.wf-table { width: 100%; border-collapse: collapse; text-align: left; }
.wf-table th, .wf-table td { padding: 16px 24px; border: 1px solid #000; font-size: 14px; color: #000; }
.wf-table th { background-color: #fff; font-weight: 600; border-bottom: 2px solid #000; }
.wf-table td.empty-cell { height: 48px; }

.wf-badge { border: 1px solid #000; padding: 4px 10px; border-radius: var(--wf-radius); font-size: 12px; display: inline-block; min-width: 60px; min-height: 24px; background: transparent; color: #000;}
.wf-action-btn { width: 32px; height: 32px; border: 1px solid #000; background: #fff; display: inline-flex; align-items: center; justify-content: center; border-radius: var(--wf-radius); color: #000; }

.wf-pagination { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-top: 1px solid #000; color: #000; }
.wf-pagination-buttons button { border: 1px solid #000; width: 32px; height: 32px; background: #fff; color: #000; border-radius: var(--wf-radius); }
.wf-pagination-buttons button.active { background: #000; color: #fff; }

.wireframe-title { padding: 16px 32px; border-bottom: 2px dashed #000; background: #fff; }
.wireframe-title h1 { font-size: 20px; font-weight: 800; color: #000; }
.wireframe-title p { font-size: 14px; color: #000; }

.material-symbols-outlined { color: #000 !important; }

.wf-tabs { border-bottom: 1px solid #000; display: flex; gap: 24px; }
.wf-tab { padding: 12px 0; color: #000; border-bottom: 2px solid transparent; }
.wf-tab.active { border-bottom-color: #000; font-weight: bold; }

.wf-balance-card { border: 1px solid #000; padding: 32px; border-radius: var(--wf-radius); color: #000; background: #fff; }
.wf-balance-card .amount { font-size: 40px; font-weight: bold; min-height: 60px; border-bottom: 1px dashed #000; display: inline-block; width: 200px; }
.wf-balance-action-btn { border: 1px solid #000; padding: 10px 20px; background: #fff; color: #000; border-radius: var(--wf-radius); }

.tabungan-quick-stat { border: 1px solid #000; padding: 24px; border-radius: var(--wf-radius); }
.tabungan-quick-stat .stat-value { min-height: 36px; border-bottom: 1px dashed #000; width: 100px; display: inline-block; margin-top: 8px;}

/* Specific Login changes */
.wf-login-left { background: #fff; border-right: 1px solid #000; color: #000; }
.wf-login-logo { border: 1px solid #000; background: #fff; color: #000; }
.wf-login-left h1, .wf-login-left p { color: #000; }
.wf-login-feature .material-symbols-outlined { background: transparent; border: 1px solid #000; }
.wf-login-right { background: #fff; }
.wf-login-form { border: 1px solid #000; box-shadow: none; border-radius: var(--wf-radius); }
.wf-login-form h2, .wf-login-form p { color: #000; }
.wf-login-submit { background: #fff; border: 1px solid #000; color: #000; }
.wf-login-submit:hover { background: #eee; }
.wf-login-remember a { color: #000; text-decoration: underline; }
"""

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css_content)

print(f"Updated {css_path}")

# 2. Parse HTML files and empty the data
html_files = glob.glob(os.path.join(directory, '*.html'))

for file_path in html_files:
    if "00-hierarki" in file_path:
        continue # Skip the hierarchy file if any

    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # Empty tbody rows
    tbodies = soup.find_all('tbody')
    for tbody in tbodies:
        # get number of columns from the thead if available
        table = tbody.find_parent('table')
        thead = table.find('thead')
        col_count = 1
        if thead:
            tr = thead.find('tr')
            if tr:
                col_count = len(tr.find_all(['th', 'td']))
        
        tbody.clear()
        
        # Add 3 empty placeholder rows
        for _ in range(3):
            tr = soup.new_tag('tr')
            for _ in range(col_count):
                td = soup.new_tag('td')
                td['class'] = 'empty-cell'
                # Just empty cell
                tr.append(td)
            tbody.append(tr)

    # Empty stat values
    for val_div in soup.find_all('div', class_='value'):
        val_div.string = ''
    
    for val_div in soup.find_all('div', class_='stat-value'):
        val_div.string = ''

    for amount_div in soup.find_all('div', class_='amount'):
        amount_div.string = ''

    # Remove user details text
    for name_div in soup.find_all('div', class_='name'):
        if name_div.parent and 'wf-sidebar-user-info' in name_div.parent.get('class', []):
            name_div.string = '[Nama User]'
    
    for role_div in soup.find_all('div', class_='role'):
        if role_div.parent and 'wf-sidebar-user-info' in role_div.parent.get('class', []):
            role_div.string = '[Role]'

    # Clear avatars
    for avatar in soup.find_all('div', class_='wf-sidebar-avatar'):
        avatar.string = ''
    
    for avatar in soup.find_all('div', class_='wf-welcome-avatar'):
        avatar.string = ''

    # Pagination info
    for pag in soup.find_all('div', class_='wf-pagination'):
        span = pag.find('span')
        if span:
            span.string = '[Info Pagination]'

    # Status labels in wf-welcome-meta
    for status_div in soup.find_all('div', class_='status'):
        status_div.string = '[Status]'

    # Sub-info in stat cards
    for sub in soup.find_all('div', class_='sub'):
        sub.string = '[Deskripsi Data]'
        
    for sub in soup.find_all('div', class_='subinfo'):
        sub.string = '[Deskripsi Tambahan]'
        
    for sub in soup.find_all('div', class_='stat-sub'):
        sub.string = '[Deskripsi]'

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(str(soup))
        
    print(f"Processed {file_path}")

print("Done all processing.")
