const fs = require('fs');
const csv = require('csv-parser');
const { parse } = require('json2csv');

// Function to generate a date in ascending order
function generateSequentialDates(totalRows) {
  const startDate = new Date('2023-11-21T00:00:00');
  const endDate = new Date('2024-10-13T23:59:59');

  const dateArray = [];
  const timeDiff = endDate.getTime() - startDate.getTime();
  const increment = timeDiff / totalRows; // Time increment per row

  for (let i = 0; i < totalRows; i++) {
    const newTimestamp = startDate.getTime() + i * increment;
    const newDate = new Date(newTimestamp);

    const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(newDate.getDate()).padStart(2, '0');
    const year = newDate.getFullYear();

    const hours = String(newDate.getHours()).padStart(2, '0');
    const minutes = String(newDate.getMinutes()).padStart(2, '0');
    const seconds = String(newDate.getSeconds()).padStart(2, '0');

    dateArray.push(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
  }

  return dateArray.reverse(); // Reverse to get dates in descending order
}

// Function to read CSV and update the "Date" column with sequential dates
function updateCsvWithSequentialDates(inputCsvFile, outputCsvFile) {
  const rows = [];

  // Read CSV file and collect rows
  fs.createReadStream(inputCsvFile)
    .pipe(csv())
    .on('data', (row) => {
      rows.push(row);
    })
    .on('end', () => {
      // Generate sequential dates based on the number of rows
      const dates = generateSequentialDates(rows.length);

      // Add dates to each row
      rows.forEach((row, index) => {
        row['createdAt'] = dates[index]; // Assign the date to the "Date" column
      });

      // Convert the updated rows back to CSV format
      const csvOutput = parse(rows);

      // Write the updated CSV file
      fs.writeFileSync(outputCsvFile, csvOutput);
      console.log(
        `CSV file updated with sequential dates and saved as ${outputCsvFile}`
      );
    });
}

// Example usage
const inputCsvFile = 'input.csv'; // Your input CSV file
const outputCsvFile = 'output.csv'; // The output CSV file with dates
updateCsvWithSequentialDates(inputCsvFile, outputCsvFile);
