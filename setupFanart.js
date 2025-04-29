const fs = require('fs');
const path = require('path');

// Create fanart directory if it doesn't exist
const fanartDir = path.join(__dirname, 'public', 'fanart');
if (!fs.existsSync(fanartDir)) {
  fs.mkdirSync(fanartDir, { recursive: true });
}

// Source profile picture
const sourcePath = path.join(__dirname, 'public', 'slashestpfp.jpg');

// Create multiple copies as fanart examples
for (let i = 1; i <= 5; i++) {
  const destPath = path.join(fanartDir, `fanart${i}.jpg`);
  fs.copyFileSync(sourcePath, destPath);
  console.log(`Created ${destPath}`);
}

console.log('Fanart setup complete!'); 