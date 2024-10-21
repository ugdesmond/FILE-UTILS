const fs = require('fs');
const csv = require('csv-parser');
const { parse } = require('json2csv');

// Function to delete specified columns from a CSV
function deleteColumnsFromCsv(inputCsvFile, outputCsvFile, columnsToDelete) {
  const rows = [];

  // Read CSV file
  fs.createReadStream(inputCsvFile)
    .pipe(csv())
    .on('data', (row) => {
      // Remove the specified columns from each row
      columnsToDelete.forEach((column) => {
        delete row[column];
      });
      rows.push(row);
    })
    .on('end', () => {
      // Convert the updated rows back to CSV format
      const csvOutput = parse(rows);

      // Write the updated CSV file
      fs.writeFileSync(outputCsvFile, csvOutput);
      console.log(
        `CSV file updated without the specified columns and saved as ${outputCsvFile}`
      );
    });
}

// Example usage
const inputCsvFile = 'input.csv'; // Your input CSV file
const outputCsvFile = 'output.csv'; // The output CSV file after deleting columns
const columnsToDelete = ['items', 'tags']; // Columns to be deleted

deleteColumnsFromCsv(inputCsvFile, outputCsvFile, columnsToDelete);
