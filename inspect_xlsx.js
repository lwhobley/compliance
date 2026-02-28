import * as xlsx from 'xlsx';
import fs from 'fs';

const files = [
    'C:\\Users\\Wayne\\Downloads\\50 States Alcohol Compliance Audit.xlsx',
    'C:\\Users\\Wayne\\Downloads\\50 States Health Code Audit Checklists.xlsx',
    'C:\\Users\\Wayne\\Downloads\\50 States Restaurant Checklist.xlsx'
];

let output = '';

files.forEach(file => {
    output += '\n\n========================================\n';
    output += 'FILE: ' + file + '\n';
    try {
        const workbook = xlsx.readFile(file);
        workbook.SheetNames.forEach(sheetName => {
            output += '--- SHEET: ' + sheetName + '\n';
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
            output += JSON.stringify(data.slice(0, 5), null, 2) + '\n';
        });
    } catch (e) {
        output += 'Error reading file ' + file + ' ' + e.message + '\n';
    }
});

fs.writeFileSync('inspect_out.log', output, 'utf-8');
console.log('done!');
