// utils/transformRwandaLocations.js
import rawData from './rwandaLocation.json';

export const rwandaLocations = {};

// Iterate over provinces
rawData.provinces.forEach((prov) => {
  rwandaLocations[prov.name] = {};
  
  prov.districts.forEach((dist) => {
    rwandaLocations[prov.name][dist.name] = {};
    
    dist.sectors.forEach((sec) => {
      rwandaLocations[prov.name][dist.name][sec.name] = {};
      
      sec.cells.forEach((cell) => {
        rwandaLocations[prov.name][dist.name][sec.name][cell.name] = cell.villages.map(v => v.name);
      });
    });
  });
});

export default rwandaLocations;
