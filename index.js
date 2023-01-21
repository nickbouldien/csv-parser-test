const fs = require('fs');

const csv = require('csv-parser');
const minimist = require('minimist');

const output = [];

function main() {
  const argv = minimist(process.argv.slice(2));
  const { filename, outputFile } = argv;
  if (filename == null) {
    throw new Error("`filename` is required.")
  }

  fs.createReadStream(filename)
    .pipe(csv())
    .on('data', function(row) {
      processRow(row);
  })
  .on('end', function() {
    writeToCSVFile(output, outputFile);
  })
  .on('error', function(err) {
    console.error("err: ", err);
  });
}

function processRow(row) {
  const zip = row.zipcode;
  const rateArea = row.rate_area;
  
  const total = zip * rateArea;
  
  output.push({
    zip,
    total,
  });
}

function writeToCSVFile(data, filename = 'output.csv') {
  fs.writeFile(filename, extractAsCSV(data), err => {
    if (err) {
      console.error('Error writing to csv file ', err);
    } else {
      console.log(`File processed and saved as '${filename}'`);
    }
  });
}

function extractAsCSV(locations) {
  const header = ["zip, total"];
  const rows = locations.map(location => `${location.zip}, ${location.total}`);

  return header.concat(rows).join("\n");
}

main();
