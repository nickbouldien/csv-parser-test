const fs = require("fs");
const csv = require('csv-parser');

const output = [];

function main(filename = 'zips.csv') {
  fs.createReadStream(filename)
    .pipe(csv())
    .on('data', function(row) {
      const zip = row.zipcode;
      const rateArea = row.rate_area;
      
      const total = zip * rateArea;
      
      output.push({
        zip,
        total,
      });
  })
  .on('end', function() {
    writeToCSVFile(output);
  })
  .on('error', function(err) {
    console.error("err: ", err);
  });
}

function writeToCSVFile(data, filename = 'output.csv') {
  fs.writeFile(filename, extractAsCSV(data), err => {
    if (err) {
      console.error('Error writing to csv file ', err);
    } else {
      console.log(`saved as ${filename}`);
    }
  });
}

function extractAsCSV(locations) {
  const header = ["zip, total"];
  const rows = locations.map(location => `${location.zip}, ${location.total}`);

  return header.concat(rows).join("\n");
}

main();
