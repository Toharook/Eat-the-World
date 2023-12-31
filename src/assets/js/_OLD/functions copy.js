import { gameData, tabMapping } from '@/assets/js/gameData.js'
import { researchInfo } from '@/assets/js/research.js';
import { foodValues } from "@/assets/js/resources.js";
import { COMMON_NAMES } from '@/assets/js/definitions';
import { initHiveForest } from '@/assets/js/hives';

// function to unlock research
export function unlockResearch(researchKey) {
  // Check if the research exists in researchData
  if (gameData.value.research.tierBiome[researchKey]) {
    const researchCost = researchInfo.tierBiome[researchKey].cost;
    // check if there is enough genes in gameData.genes to unlock research

    // Check genes cost
    for (const geneKey in researchCost.genes) {
      const requiredGeneAmount = researchCost.genes[geneKey];
      if (gameData.value.genes[geneKey] < requiredGeneAmount) {
        return; // Exit the function if there's not enough genes
      }
    }

    // Check resources cost
    for (const resourceKey in researchCost.resources) {
      const requiredResourceAmount = researchCost.resources[resourceKey];
      if (gameData.value.resources[resourceKey].amount < requiredResourceAmount) {
        return; // Exit the function if there's not enough resources
      }
    }
    
    // Unlock the research
    gameData.value.research.tierBiome[researchKey].unlocked = true;
    // deducate the cost of genes 
    for (const geneKey in researchCost.genes) {
      const requiredGeneAmount = researchCost.genes[geneKey];
      gameData.value.genes[geneKey] -= requiredGeneAmount;
    }
    for (const resourceKey in researchCost.resources) {
      const requiredGeneAmount = researchCost.resources[resourceKey];
      console.log(resourceKey + ": " + requiredGeneAmount);
      gameData.value.hive[0].resources[resourceKey].amount -= requiredGeneAmount;
    }
    // makes available any research than can be unlocked by this research
    for (const key in gameData.value.research.tierBiome) {
      let research = gameData.value.research.tierBiome[key];
      if (researchInfo.tierBiome[key].unlockedBy === researchInfo.tierBiome[researchKey]) {
        research.available = true;
      }
    }
  } else {
    console.error(`Research '${researchKey}' not found in researchData.`);
  }
}

// Function to calculate the area of something
export function calculateArea(radius) 
  {
    return Math.PI * radius * radius;
  }
// Function to access to swarm numberformat from inside vue templates
export function formatNumber(number, unit) {
  if (unit === "cm") {
    if (number >= 1000000) {
      number /= 1000000;
      unit = "km";
    } else if (number >= 1000) {
      number /= 1000;
      unit = "m";
    } 
  } else if (unit === "mg") {
    if (number >= 1000000) {
      number /= 1000000;
      unit = "kg";
    } else if (number >= 1000) {

      number /= 1000;
      unit = "g";
    }    
  }  // if unit = cm2 then convert to m2 or km2 if above threadhold
  else if (unit === "cm2") { 
    unit === "cm²";
    if (number >= 1e+10) {
      number /= 1e+10;
      unit = "km²";
    } else if (number >= 10000) {
      number /= 10000;
      unit = "m²";
    }
  }
  console.log(number, unit);
  return unit ? numberformat.formatShort(number, {suffixes: ['mg', 'g', 'kg']}) + unit : numberformat.formatShort(number);
}

// // function to check if a variable is undefined  Returns default value if true
// function checkDefault(value, defaultValue) {
//   return value === undefined ? defaultValue : value;
// }

// add resource function
// export const hiveManager = {
//   addResource(hive, category, resource, amount) {
//     // console.log(hive, category, resource, amount);
//     // Check if the resource exists in the hive
//     if (hive[COMMON_NAMES.RESOURCES][resource]) {
//       // Add the resource to the hive
//         hive[COMMON_NAMES.RESOURCES][resource].amount += amount;
//       // set the resource to show if it is greater than 0
//       if(hive[COMMON_NAMES.RESOURCES][resource].amount > 0 && hive[COMMON_NAMES.RESOURCES][resource].show == false) {
//         hive[COMMON_NAMES.RESOURCES][resourceKey].show = true;
//       }
//     } else {
//       console.error(`Resource '${resource}' not found in hive resources.`);
//     }
//   },

//   addGenes(hive, category, gene, amount) {
//     if (gameData.value[COMMON_NAMES.GENES].hasOwnProperty(gene)) {
//       // Add the gene to the hive
//       gameData.value[COMMON_NAMES.GENES][gene] += amount;
//     } else {
//       console.error(`Gene '${gene}' not found in hive genes.`);
//     }
//   },

//   _addFoodResources(hive, category, food, multiplyer) {
//     console.log(foodValues[COMMON_NAMES.FOOD][category][food]);
//     for (const resourceKey in foodValues[COMMON_NAMES.FOOD][category][food][COMMON_NAMES.RESOURCES]) {
//       let totalResources = foodValues[COMMON_NAMES.FOOD][category][food][COMMON_NAMES.RESOURCES][resourceKey] * multiplyer;
//       console.log(resourceKey);
//       this.addResource(hive, category, resourceKey, totalResources);
//     }
//   },

//   _addFoodGenes(hive, category, food, multiplyer) {
//     for (const geneKey in foodValues[COMMON_NAMES.FOOD][category][food].genes) {
//       this.addGenes(hive, category, geneKey, foodValues[COMMON_NAMES.FOOD][category][food][COMMON_NAMES.GENES][geneKey] * multiplyer);
//     }
//   },

//   _eat(hive, category, food, amount) {
//     let amountEaten = Math.min(amount, hive[COMMON_NAMES.FOOD][category][food].amount);
//     hive[COMMON_NAMES.FOOD][category][food].amount -= amountEaten;
//     // set foodUnlocked to true for current food
//     gameData.value.foodUnlocked[food] = true;
//   },

//   eatFood(hive, category, food, amount) {
//     let amountEaten = checkDefault(amount, foodValues[COMMON_NAMES.FOOD][category][food].amountToEat);

//     //check if there is enough food to devour
//     if (hive[COMMON_NAMES.FOOD][category][food].amount > 0) {
//       this._eat(hive, category, food, amountEaten);

//       // Check if the food exists in foodValues
//       if (foodValues[COMMON_NAMES.FOOD][category][food]) {
//         this._addFoodResources(hive, category, food, amountEaten);
//         this._addFoodGenes(hive, category, food, amountEaten);
//       } else {
//         console.error(`Food type '${food}' not found in foodValues.`);
//       }
//     }
//   },
// }

// Define the eatFood function
// export function eatFood(category, hive, food, amount) {
//   let amounttoeat;
//   if (amount === undefined) {
//   // get the amount from the foodValues amounttoeat
//     amounttoeat = foodValues[COMMON_NAMES.FOOD][category][food].amountToEat;
//   } else {
//     amounttoeat = amount;
//   }
//   //check if there is enough food to devour
//   if (hive[COMMON_NAMES.FOOD][category][food].amount > 0) {
//     let howMuch = Math.min(amounttoeat, hive[COMMON_NAMES.FOOD][category][food].amount);
//     hive[COMMON_NAMES.FOOD][category][food].amount -= howMuch;
//     // set foodUnlocked to true for current food
//     gameData.value.foodUnlocked[food] = true;
    
//     // Check if the food exists in foodValues
//     if (foodValues[COMMON_NAMES.FOOD][category][food]) {
//       for (const resourceKey in foodValues[COMMON_NAMES.FOOD][category][food][COMMON_NAMES.RESOURCES]) {
//         // Check if the resource exists in the hive
//         if (hive[COMMON_NAMES.RESOURCES][resourceKey]) {
//           console.log(resourceKey);
//           // Add the resource to the hive
//             hive[COMMON_NAMES.RESOURCES][resourceKey].amount += foodValues[COMMON_NAMES.FOOD][category][food][COMMON_NAMES.RESOURCES][resourceKey] * howMuch;
//           // set the resource to show if it is greater than 0
//           if(hive[COMMON_NAMES.RESOURCES][resourceKey].amount > 0 && hive[COMMON_NAMES.RESOURCES][resourceKey].show == false) {
//             hive[COMMON_NAMES.RESOURCES][resourceKey].show = true;
//           }
//         } else {
//           console.error(`Resource '${resourceKey}' not found in hive resources.`);
//         }
//       }
//       // for each gene in foodValues add the gene to the hive
//       for (const geneKey in foodValues[COMMON_NAMES.FOOD][category][food].genes) {
//         // Check if the gene exists in the hive
//         if (gameData.value[COMMON_NAMES.GENES].hasOwnProperty(geneKey)) {
//           // Add the gene to the hive
//           // gameData.value.genes[geneKey] += foodValues.food[food].genes[geneKey] * amounttoeat * (howMuch/amounttoeat);
//           gameData.value[COMMON_NAMES.GENES][geneKey] += foodValues[COMMON_NAMES.FOOD][category][food][COMMON_NAMES.GENES][geneKey] * howMuch;
//         } else {
//           console.error(`Gene '${geneKey}' not found in hive genes.`);
//         }
//       }
//     } else {
//       console.error(`Food type '${food}' not found in foodValues.`);
//     }
//   }
// }
// function to grow each food based on the number of growths built
// export function growFood() {

// }
// export function heartBeat(delta) {
//   // console.log(delta, "|||", gameData.value.heart.pertick * delta)
//   let hasEnoughBiomass = false;
//   // Check if heart amount is less than heart max
//   if (gameData.value.heart.amount < gameData.value.heart.max) { 
//     // Check each hive if they have enough biomass then tick down.
//     gameData.value.hive.forEach(hive => {
//       if (hive[COMMON_NAMES.RESOURCES][COMMON_NAMES.BIOMASS].amount >= gameData.value.heart.pertick) {
//         hasEnoughBiomass = true
//         // decreate biomass pertick using pertick
//         hive[COMMON_NAMES.RESOURCES][COMMON_NAMES.BIOMASS].amount -= delta;
//         hive.heart.dyingState = false          
//       } else {
//         // what happens if there isn't
//         hive.heart.dyingState = true;
//       }
//     });
//     if ( hasEnoughBiomass ) {
//       gameData.value.heart.amount += delta;
//     } else {
//       gameData.value.heart.dyingState = true;
//     }
//     // checks if heart is greater or equal to max then reset if it is.
//   } 
//   if (gameData.value.heart.amount >= gameData.value.heart.max) {
//     gameData.value.heart.amount = 0;
//   }
// }


// export function main_loop() {
//   let prevTime = gameData.value.date.timestamp;
//   let currentTime = performance.now();
//   let delta = (currentTime - prevTime);
//   gameData.value.date.timestamp = currentTime;
//   // do stuff
//   // check if biomass is greater than pertick
//   if (gameData.value.hive[0][COMMON_NAMES.RESOURCES][COMMON_NAMES.BIOMASS].amount >= gameData.value.heart.pertick) {
//     for ( hive in gameData.hive) {
//       hive[COMMON_NAMES.RESOURCES][COMMON_NAMES.BIOMASS].amount -= gameData.value.heart.pertick;
//     }


    

  
// }

export function mainLoop(forced) {
  if (gameData.value.paused === false || forced === true) { 
    // let prevTime = gameData.value.date.timestamp;
    // let currentTime = performance.now();
    // let delta = (currentTime - prevTime);

    // // console.log(delta, "|||", Math.round(delta*10));
    // // let biomassAreaMultiplyer = 500;
    // // let fibreAreaMultiplyer = 1.5;
    // if (gameData.value.heart.amount <= gameData.value.date.timer) {
    //   heartBeat(delta);
    // }
    // // heartBeat();
    // if (gameData.value.date.timer < 1000) {
    //   gameData.value.date.timer += delta;
    // } 
    // if (gameData.value.date.timer >= 1000) {
    //   let prevTick = gameData.value.date.tickstamp;
    //   let currentTick = performance.now();
    //   console.log("currentTick: ",currentTick);
    //   let deltaTick = currentTick - prevTick;
    //   console.log("one second: ", deltaTick);
    //   gameData.value.date.timer = 0;// reset counter
    //   //add to hour every time then add to day when hour is 24 and year when day is 365
    //   tickHour();
    //   // add to each food based on harvest multiplyer and current area
    //   gameData.value.hive.forEach(hive => {
    //     for (const resourceKey in hive[COMMON_NAMES.FOOD]) {
    //       // add the harvest if there is less of the harvest than the total area times multiplyer
    //       if (hive[COMMON_NAMES.FOOD][resourceKey].amount < hive[COMMON_NAMES.FOOD][resourceKey].max) {
    //         hive[COMMON_NAMES.FOOD][resourceKey].amount += Math.round(foodValues[resourceKey] * hive.area/1000000);
    //       }
    //     }
    //   });


    //   if (gameData.value.heart.dyingState == true) {
    //     gameData.value.hive.forEach(hive => {
    //       hive.heart.healthMultiplyer = Math.max(hive.heart.healthMultiplyer - 0.001, -1)
    //     });  
    //   }

    //   gameData.value.date.tickstamp = currentTick
    //   console.log("prevTick: ",prevTick);
    //   // do stuff every second
    // }
    // gameData.value.date.timestamp = currentTime;
  }
}
// export function heartBeat() {
//   console.log("heatbeat");
//   // checks if there is enough biomass each tick
//   const hasEnoughBiomass = gameData.value.hive.some(hive => {
//     return hive[COMMON_NAMES.RESOURCES][COMMON_NAMES.BIOMASS].amount >= gameData.value.heart.pertick;
//   });

//   // things that happen if there is enough biomass
//   if (hasEnoughBiomass) {
    
//     // Check if heart amount is less than heart max
//     if (gameData.value.heart.amount < gameData.value.heart.max) { 
//       gameData.value.heart.amount += gameData.value.heart.pertick; // Subtract pertick from each hive if it has enough biomass

//       // Check each hive if they have enough biomass then tick down.
//       gameData.value.hive.forEach(hive => {
//         if (hive[COMMON_NAMES.RESOURCES][COMMON_NAMES.BIOMASS].amount >= gameData.value.heart.pertick) {
//           // what happens if there is enough
//           //increase radius using pertick
//           hive[COMMON_NAMES.RESOURCES][COMMON_NAMES.BIOMASS].amount -= gameData.value.heart.pertick;
//           hive.heart.dyingState = false          
//         } else {
//           // what happens if there isn't
//           hive.heart.dyingState = true;
//         }
//       });
//       // checks if heart is 100 then reset if it is.
//     } else if (gameData.value.heart.amount == gameData.value.heart.max) {
//       gameData.value.heart.amount = 0;

//       // Performs actions on each hive
//       for (const hive of gameData.value.hive) {
//         hive.radius += hive.radiusPerBeat;
//         // set hive previous area to current area
//         hive.previousArea = hive.previousArea;
//         // calculate new area based on radius
//         hive.area = Math.min(hive.maxArea, calculateArea(hive.radius));
//         let difference = hive.area - hive.previousArea;
//         // iterates through each food on 
//         for (const category in hive[COMMON_NAMES.FOOD]) {
          
//           for (const foodKey in hive[COMMON_NAMES.FOOD][category]) {
//             if (foodKey != "show") {
//               // increase each food amount by the difference in area
//                 let amountToAdd = Math.round((difference * foodValues[COMMON_NAMES.FOOD][category][foodKey].multiplyer)*foodValues.Overall );
//                 hive[COMMON_NAMES.FOOD][category][foodKey].amount += amountToAdd;
//               if(hive[COMMON_NAMES.FOOD][category][foodKey].amount > 0 && hive[COMMON_NAMES.FOOD][category][foodKey].show == false) {
//                 hive[COMMON_NAMES.FOOD][category][foodKey].show = true;
//                 hive[COMMON_NAMES.FOOD][category].show = true;
//               }
//             }
//           }
//         }
        
//         growFood();
//       }
//       // adds to each harvest max based on area using forEach vue
//     }
        
//   } else {
//     // Handle the case when no hive has enough biomass
//     // You can add your own logic here if needed
//     gameData.value.heart.dyingState = true;
//   }
// }

export function tickHour() {
  gameData.value.date.hour += 4;
  if (gameData.value.date.hour == 24) {
    gameData.value.date.hour = 0;
    gameData.value.date.day++;
  }
  if (gameData.value.date.day == 365) {
    gameData.value.date.day = 0;
    gameData.value.date.year++;
  }   
}

export function addHive(biome, totalArea) {
  const lastHive = gameData.value.hive[gameData.value.hive.length - 1];
  const newId = lastHive.id + 1;

  // Create a new hive object by merging properties from initHiveForest and new properties
  const newHive = JSON.parse(JSON.stringify(initHiveForest[0]));

  newHive.id = newId;
  newHive.biome = biome; // You can set the biome as needed

  gameData.value.hive.push(newHive);
}
