const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Predefined lists of first and last names
// Predefined lists of Igbo first and last names
const firstNames = [
  'Chinedu',
  'Ngozi',
  'Ifeanyi',
  'Nkechi',
  'Chika',
  'Amaka',
  'Uchenna',
  'Obinna',
  'Chioma',
  'Kelechi',
  'Chinonso',
  'Ifunanya',
  'Obinna',
  'Ngozi',
  'Chukwuemeka',
  'Amarachi',
  'Kelechi',
  'Ifeanyi',
  'Ugochukwu',
  'Adaobi',
];
const lastNames = [
  'Okoro',
  'Nwosu',
  'Eze',
  'Onyejekwe',
  'Anyanwu',
  'Obi',
  'Ibe',
  'Okechukwu',
  'Nwachukwu',
  'Nnaji',
  'Okeke',
  'Nwosu',
  'Eze',
  'Okoro',
  'Anyanwu',
  'Iheanacho',
  'Nnamani',
  'Onyejekwe',
  'Madu',
  'Ibe',
];

// Function to generate random email
function generateRandomEmail() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  const domains = ['gmail.com', 'yahoo.com', 'outlook.com'];
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  return `${firstName.toLowerCase()}${lastName.toLowerCase()}@${randomDomain}`;
}

// Function to generate a random date between December 2023 and October 2024
function generateRandomDate() {
  const startDate = new Date('2023-11-21T00:00:00');
  const endDate = new Date('2024-10-31T23:59:59');

  const randomTimestamp =
    startDate.getTime() +
    Math.random() * (endDate.getTime() - startDate.getTime());
  const randomDate = new Date(randomTimestamp);

  const month = randomDate.getMonth() + 1; // JavaScript months are 0-based
  const day = randomDate.getDate();
  const year = randomDate.getFullYear();

  const hours = String(randomDate.getHours()).padStart(2, '0');
  const minutes = String(randomDate.getMinutes()).padStart(2, '0');
  const seconds = String(randomDate.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Function to generate random float numbers that sum to a specific total
function generateRandomFloats(total, count) {
  let randomValues = Array.from({ length: count }, () => Math.random());

  // Normalize and scale the values
  const sumOfRandomValues = randomValues.reduce((sum, value) => sum + value, 0);
  const scaledValues = randomValues.map(
    (value) => (value / sumOfRandomValues) * total
  );

  return scaledValues;
}

// Step 1: Define total sum and transaction count
const totalSum = 591200;
const transactionCount = 1943;

// Step 2: Generate random float values that sum to 5910200
const randomFloats = generateRandomFloats(totalSum, transactionCount);

function generateRandomSegment(length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateReference() {
  const fixedPart = 'KDX';
  const segment1 = generateRandomSegment(8); // Generates a random string like 'lzk19s22'
  const segment2 = generateRandomSegment(5); // Generates a random string like 'nap7q'
  const segment3 = generateRandomSegment(3); // Generates a random string like 'AIN'

  return `${fixedPart}|${segment1}|${segment2}|${segment3}`;
}

// Step 3: Read CSV, assign random float values to the "amount" column, and write to a new CSV
const results = [];
let floatIndex = 0;

fs.createReadStream('input.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Assign random float values to the 'amount' column
    row['Reference'] = generateReference();
    floatIndex += 1;
    results.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');

    // Write the updated data back to a new CSV file
    const csvWriter = createCsvWriter({
      path: 'output.csv',
      header: Object.keys(results[0]).map((key) => ({ id: key, title: key })),
    });

    csvWriter.writeRecords(results).then(() => {
      console.log('The CSV file was written successfully');
    });
  });
