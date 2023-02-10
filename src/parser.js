const csv = require('csv-parser');
const fs = require('fs');
const result = [];

fs.createReadStream('data/teams_29.csv')
  .pipe(csv({ headers: false }))
  .on('data', (data) => result.push(data))
  .on('end', () => {
    processData(result);
  });

function processData(result) {
  let stations = [];
  let teams = [];
  let friends = [];

  // process stations while ignoring first line (headers)
  for (let i = 0; i < result.length; i++) {
    stations[i] = Object.keys(result[i]).map(key => result[i][key].replace(/,/g, '').trim().split(' ').map(x => Number(x) - 1));
  }

  // process teams and friends
  stations.forEach((station, stix) =>
    station.forEach((round, rix) =>
      round.forEach(team => {
        teams[team] = (teams[team] || []);
        teams[team][rix] = stix;

        friends[team] = friends[team] || [];
        round.filter(t => team != t).forEach(t => friends[team].push(t));
      })));

  // print output
  console.log(`Stations:\n${JSON.stringify(stations)}\n`);
  console.log(`Teams:\n${JSON.stringify(teams)}\n`);
  console.log(`Friends:\n${JSON.stringify(friends)}\n`);
}