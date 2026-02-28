const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePaths = {
    alcohol: 'C:\\Users\\Wayne\\Downloads\\50 States Alcohol Compliance Audit.xlsx',
    health: 'C:\\Users\\Wayne\\Downloads\\50 States Health Code Audit Checklists.xlsx',
    preopening: 'C:\\Users\\Wayne\\Downloads\\50 States Restaurant Checklist.xlsx'
};

const result = {};

for (const [type, filepath] of Object.entries(filePaths)) {
    console.log(`Processing ${type} ...`);
    try {
        const wb = xlsx.readFile(filepath);
        wb.SheetNames.forEach(state => {
            if (!result[state]) result[state] = {};
            const sheet = wb.Sheets[state];
            const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

            const items = [];
            let currentCategory = 'General';

            data.forEach(row => {
                if (!row || row.length === 0) return;

                // If it's a single column and looks like a category
                if (row.length === 1 && typeof row[0] === 'string') {
                    const val = row[0].trim();
                    if (val.toUpperCase() === val && !val.includes('CHECKLIST') && !val.includes('REGULATORY')) {
                        currentCategory = val;
                    }
                    return;
                }

                // If it's at least 2 columns
                if (row.length >= 2) {
                    const col0 = row[0] ? row[0].toString().trim() : '';
                    const col1 = row[1] ? row[1].toString().trim() : '';

                    if (!col0 && !col1) return;
                    if (col0.toLowerCase().includes('critical violation') ||
                        col0.toLowerCase().includes('requirement') ||
                        col0.toLowerCase().includes('task')) {
                        return; // Header row
                    }

                    items.push({
                        category: currentCategory,
                        task: col0,
                        requirement: col1
                    });
                }
            });

            result[state][type] = items;
        });
    } catch (e) {
        console.error(`Error processing ${type}:`, e.message);
    }
}

const outputPath = path.join(__dirname, 'src', 'data', 'audits.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log('Generated successfully at', outputPath);
