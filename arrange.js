const fs = require('fs');
const csv = require('csv-parser');
const { parse } = require('json2csv');

// Function to randomly select 20 rows and update status to 'pending' and save them to a new CSV
function selectAndSaveRandomRows(
  inputCsvFile,
  outputCsvFile,
  columnToUpdate = 'Status',
  newValue = 'Pending'
) {
  const rows = [];

  // Read CSV file
  fs.createReadStream(inputCsvFile)
    .pipe(csv())
    .on('data', (row) => {
      rows.push(row);
    })
    .on('end', () => {
      // Select 20 random unique rows
      const randomIndexes = getRandomIndexes(rows.length, 32);

      // Extract and update the status of the selected rows
      const selectedRows = randomIndexes.map((index) => {
        rows[index][columnToUpdate] = newValue;
        return rows[index];
      });

      // Convert the selected rows back to CSV format
      const csvOutput = parse(selectedRows);

      // Write the selected and updated rows to a new CSV file
      fs.writeFileSync(outputCsvFile, csvOutput);
      console.log(
        `CSV file created with 20 randomly selected rows, with '${newValue}' in the '${columnToUpdate}' column.`
      );
    });
}

// Helper function to get 'n' unique random indexes from the array
function getRandomIndexes(totalRows, count) {
  const indexes = new Set();
  while (indexes.size < count && indexes.size < totalRows) {
    const randomIndex = Math.floor(Math.random() * totalRows);
    indexes.add(randomIndex);
  }
  return Array.from(indexes);
}

// Example usage
const inputCsvFile = 'input.csv'; // Your input CSV file
const outputCsvFile = 'output.csv'; // Output CSV file with 20 rows
selectAndSaveRandomRows(inputCsvFile, outputCsvFile);
