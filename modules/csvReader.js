// modules/csvReader.js
const fs = require('fs');

function readCSV(filePath) {
  const csvData = fs.readFileSync(filePath, 'utf8');
  const rows = csvData.split('\n');
  const headers = rows[0].split(',');
  const postsData = [];

  for (let i = 1; i < rows.length; i++) {
    const values = rows[i].split(',');
    const post = {};

    for (let j = 0; j < headers.length; j++) {
      post[headers[j].trim()] = values[j].trim();
    }

    // Calculate the time difference between now and the posted date
    const postedDate = new Date(post.timeAgo);
    const currentDate = new Date();
    const timeDifference = currentDate - postedDate;

    // Convert milliseconds to days and hours
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    // Add the calculated time difference to the post object
    post.timeAgo = `${days} days and ${hours} hours ago`;
    postsData.push(post);
  }

  return postsData;
}

module.exports = readCSV;
