const fs = require('fs');
const path = require('path');

const dir = 'c:/wamp64/www/FinalProject/desain awal';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Remove inline styles
    content = content.replace(/<style>[\s\S]*?<\/style>/i, '');
    
    // Remove existing switcher HTML (both common patterns)
    content = content.replace(/<!-- Style Switcher Panel -->[\s\S]*?<\/div>\s*/i, '');
    content = content.replace(/<div class="wf-style-switcher">[\s\S]*?<\/div>\s*/i, '');
    
    // Remove existing inline scripts
    content = content.replace(/<!-- Theme Logic Script -->[\s\S]*?<\/script>\s*/i, '');
    content = content.replace(/<script>[\s\S]*?applyStyle[\s\S]*?<\/script>\s*/i, '');
    
    // Add wireframe-switcher.js before </body>
    if (!content.includes('<script src="wireframe-switcher.js"></script>')) {
        content = content.replace(/<\/body>/i, '    <script src="wireframe-switcher.js"></script>\n</body>');
    }
    
    fs.writeFileSync(path.join(dir, file), content);
});
console.log('HTML files updated successfully.');
