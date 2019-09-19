let _ = require('lodash');
let sprintf = require('sprintf-js').sprintf;

const TEAMS = 34;    // number of teams
const STATIONS = 14; // number of stations
const ROUNDS = 14;   // number of rounds

// profiling starts
console.time();

// do full calculation for team of 6 (don't forget to change constants above)
print_output(calculate(0));

// calculate for partially solved team of 29
// let stations = JSON.parse("[[[0,1],[2,3],[4,5],[6,7],[8,9],[12,14],[13,16],[10,11],[20,24],[26,28],[17,19,27],[15,18],[23,25],[21,22]],[[9,10,28],[0,4,27],[1,2],[3,5],[6,11],[7,8],[12,17],[13,14],[18,19],[20,25],[15,16],[21,23],[22,24],[26]],[[7,13],[8,10,25],[0,3,28],[1,4],[2,5],[6,9],[18,20],[16,17],[26],[19,21],[22,23],[24],[12,15],[11,14,27]],[[15,19],[12,18],[8,11],[0,2,23],[1,3],[4,10],[5,6,27],[21,24],[13],[16,22],[28],[17,25,26],[14,20],[7,9]],[[8,16],[9,11],[14,15],[17,22],[0,7],[1,5],[2,4],[3,6,25],[10,12],[18,23,27],[21,26],[20,28],[13,19],[24]],[[25,27],[14,17],[12,21],[13,24,28],[15,23],[0,11,22],[1,8],[2,9],[3,4],[5,7],[20],[16,19],[18,26],[6,10]],[[12,22],[13,26],[17,24],[11,18],[14,19],[21,28],[0,9,25],[1,15],[2,6],[3,8],[4,7],[5,10],[16,27],[20,23]],[[18,24],[15,28],[16,23],[14,25],[20,22,26],[13,27],[11,19],[0,5],[1,7],[2,10],[3,9],[4,6],[17,21],[8,12]],[[17,23],[19,22],[10,18],[12,26],[16,24],[15,20],[14,21],[27,28],[0,8],[1,6],[2,11,25],[3,7],[4,9],[5,13]],[[5,11],[6,20],[7,22],[9,19],[21,27],[17,18],[23,24],[26],[14,16,28],[0,13],[1,12],[2,8],[3,10],[4,15,25]],[[4,20],[5,21],[6,13],[8,15],[12,25,28],[19,23],[26],[18,22],[11,17],[14],[0,10,24],[1,9,27],[2,7],[3,16]],[[3,14],[7,24],[26,27],[10,21],[4,13],[16,25],[22,28],[19,20],[5,9,23],[15,17],[6,8],[0,12],[1,11],[2,18]],[[2,21],[23],[19,25],[16,20],[18],[3,24,26],[7,10],[4,8],[15,22,27],[9,12],[5,14],[11,13],[0,6],[1,17,28]],[[6,26],[1,16],[9,20],[27],[10,17],[2],[3,15],[7,12,23],[21,25],[4,11,24],[13,18],[14,22],[5,8,28],[0,19]]]");
// let teams = JSON.parse("[[0,1,2,3,4,5,6,7,8,9,10,11,12,13],[0,13,1,2,3,4,5,6,7,8,9,10,11,12],[12,0,1,3,2,13,4,5,6,7,8,9,10,11],[11,0,2,1,3,12,13,4,5,6,7,8,9,10],[10,1,0,2,11,3,4,12,5,13,6,7,8,9],[9,10,0,1,2,4,3,7,11,5,12,6,13,8],[13,9,10,0,1,2,3,4,6,8,11,7,12,5],[2,11,9,0,4,1,12,13,7,5,6,8,10,3],[4,2,3,10,0,1,5,12,8,6,11,9,13,7],[1,4,13,9,0,2,6,5,11,12,7,10,8,3],[1,2,8,11,13,3,12,0,4,7,10,6,9,5],[9,4,3,6,1,5,7,0,10,13,8,12,11,2],[6,3,5,8,10,0,1,13,4,12,9,11,2,7],[2,6,10,5,11,7,0,1,3,9,13,12,4,8],[11,5,4,7,6,0,8,1,9,10,12,13,3,2],[3,7,4,10,5,8,13,6,12,11,1,0,2,9],[4,13,7,12,8,11,0,2,9,3,1,5,6,10],[8,5,6,4,13,9,1,2,10,11,0,3,7,12],[7,3,8,6,12,9,2,10,1,4,13,0,5,11],[3,8,12,9,6,10,7,11,1,2,0,5,4,13],[10,9,13,12,7,8,2,11,0,1,5,4,3,6],[12,10,5,11,9,6,8,3,13,2,4,1,7,0],[6,8,9,4,7,5,11,10,12,3,2,13,1,0],[8,12,7,3,5,10,9,13,11,4,2,1,0,6],[7,11,6,5,8,12,9,3,0,13,10,2,1,4],[5,2,12,7,10,11,6,4,13,1,8,3,0,9],[13,6,11,8,7,12,10,9,2,0,4,3,5,1],[5,1,11,13,9,7,3,8,12,4,0,10,6,2],[1,7,2,5,10,6,11,8,9,0,3,4,13,12]]");
// print_output(calculate(29, stations, teams));

// profiling ends
console.timeEnd();

// full calculation for all teams
function calculate(start = 0, stations = _.times(STATIONS, _.stubArray), teams = _.times(TEAMS, _.stubArray)) {
  let result;
  
  for(let team = start; team < TEAMS; team++) {
    // make sure teams are properly allocated even when calculating deserialized state
    teams[team] = teams[team] || [];

    result = assign(team, stations, teams, [])() || assign(team, stations, teams, [], 3)();
  
    // if stations is falsy, then we didn't get the solution pair
    if (!result) {
      return result;
    }
  
    [stations, teams] = result;
  }
  return result;
}

// assign teams from compositions structure to the stations
function assign(team, stations, teams, friends, size = 2) {
  // we return function to save the parameters in a closure
  return function inner(station_start = 0) {
    // if the team occupies all the stations, we are done
    let occupancy = teams[team].filter(t => t !== undefined).length;  
  	if (occupancy == STATIONS) {
		  return [stations, teams];
    }
  
    for (let station = station_start; station < STATIONS; station++) {
  		// don't assign team to a station it was assigned to before
		  if (teams[team].indexOf(station) !== -1) {
  			continue;	
		  }

		  for (let round = 0; round < ROUNDS; round++) {
        // check if any of the teams are not in this round on a different station
			  if (stations.find(st => (st[round] !== undefined ? st[round] : []).indexOf(team) !== -1)) {
  				continue;
			  }
			
			  let cur = stations[station][round] || [];
        
			  // we have max cap on the number of teams in given entry
			  if (cur.length >= size) {
	  			continue;
  			}

		  	// check if we have already been with teams that area on this entry
  			if (cur.find(cf => friends.indexOf(cf) !== -1) !== undefined) {
				  continue;
			  }
    
        Array.prototype.push.apply(friends, cur);
			  cur.push(team);
			  stations[station][round] = cur;
			  teams[team][round] = station;

        // try another assignment for the team, try allocate 2 teams at max or 3 if that is not possible
        let result = inner(station + 1);

			  // we found the solution for the team, we are done;				
			  if (result) {
  				return result;
        }
        
        // if no solution was found, we will rollback our changes
        teams[team][round] = undefined;
        cur.pop();
        friends = friends.filter(f => cur.indexOf(f) === -1);
  		}
  	}
	  // we exhausted all the options, there is no solution
	  return false;
  }
}

function print_output(result) {
  // if stations is falsy, then we didn't get the solution pair
  if (!result) {
  	console.log("No solution! :(");
  	return;
  }

  // split the proper result into our structures
  [stations, teams] = result;

  // output which stations are assigned to which team each round
  console.log('');
  teams.forEach((t, ix) => {
  	console.log(sprintf('Team %2d: %s', ix + 1, t.map(st => sprintf('%2d', st + 1)).join(' ')));
  });
	
  // output which teams are assigned on which station each round
  console.log('');
  stations.forEach((st, ix) => {
  	console.log(sprintf('Station %2d:', ix + 1));
  	st.forEach((teams, ix) => console.log(sprintf('\tRound %2d: %s', ix + 1, teams === undefined ? '-' : teams.map(t => sprintf('%2d', t + 1)).join(' '))));
  });
}
