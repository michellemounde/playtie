const { countries, zones } = require('moment-timezone/data/meta/latest.json');

const timezoneCityCountry = {};

Object.keys(zones).forEach(zone => {
  // timezone format is 'Continent/City'
  const region = zone.split('/')
  const city = region[region.length - 1];

  timezoneCityCountry[city] = countries[zones[zone].countries[0]].name;
})

timezoneCityCountry['Calcutta'] = 'India';

console.log(timezoneCityCountry);

module.exports = {
  timezoneCityCountry
}
