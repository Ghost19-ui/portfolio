const fs = require('fs');
const path = require('path');

// Define the root directory to scan. 
// '..' moves up from 'Backend' to the 'portfolio' root.
const rootDir = path.resolve(__dirname, '..'); 

// Folders and files to ignore during the scan
const ignored = new Set(['node_modules', '.git', '.env', '.DS_Store', 'dist', 'build', 'coverage']);

function scanDirectory(directory, prefix = '') {
    try {
        const entries = fs.readdirSync(directory, { withFileTypes: true });

        // Sort: Directories first, then files, alphabetically
        entries.sort((a, b) => {
            if (a.isDirectory() && !b.isDirectory()) return -1;
            if (!a.isDirectory() && b.isDirectory()) return 1;
            return a.name.localeCompare(b.name);
        });

        entries.forEach((entry, index) => {
            if (ignored.has(entry.name)) return;

            const isLast = index === entries.length - 1;
            const connector = isLast ? '└── ' : '├── ';
            const nextPrefix = prefix + (isLast ? '    ' : '│   ');

            if (entry.isDirectory()) {
                console.log(`${prefix}${connector}📁 ${entry.name}`);
                // Recursively scan subdirectories
                scanDirectory(path.join(directory, entry.name), nextPrefix);
            } else {
                console.log(`${prefix}${connector}📄 ${entry.name}`);
            }
        });
    } catch (err) {
        console.log(`${prefix}└── ⛔ Access Denied: ${err.message}`);
    }
}

console.log(`\n🚀 Scanning Project Root: ${rootDir}\n`);
scanDirectory(rootDir);
