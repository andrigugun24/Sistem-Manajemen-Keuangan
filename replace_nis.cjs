const fs = require('fs');
const path = require('path');

const directoriesToScan = [
    path.join(__dirname, 'database')
];

function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.php')) {
            processFile(fullPath);
        }
    });
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace case-sensitive exact variable bounds, skipping the migration file name and contents just in case
    if (!filePath.includes('rename_nis_to_nisn')) {
        content = content.replace(/\bnis\b/g, 'nisn');
        content = content.replace(/\bNIS\b/g, 'NISN');
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
}

directoriesToScan.forEach(processDirectory);
console.log('Done.');
