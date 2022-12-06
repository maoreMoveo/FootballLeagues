
interface Ileague {
  idLeague: string;
  strLeague: string;
  strLeagueAlternate: string;
  strSport: string;
}
interface Iteam {
  idTeam: string;
  strTeam: string;
  strTeamBadge: string;
  strSport: string;
  strLeague: string;
}

document.getElementById("body").onload = () => fetchLeagues();
const baseUrlForLeagues = "https://www.thesportsdb.com/api/v1/json/2/all_leagues.php";
const baseUrlForTeams='https://www.thesportsdb.com/api/v1/json/2/search_all_teams.php?l='


var listLeagues: Ileague[] = [];
var listLeaguePerTeam: Iteam[][] = [];

const fetchLeagues = async (): Promise<void> => {
  try {
    const resLeagues: Response = await fetch(baseUrlForLeagues);
    const res = await resLeagues.json();
    listLeagues = res.leagues.splice(0, 5);
    console.log('leagues')
    console.log(listLeagues)
    const teams = await fetchTeamsPerLeague();
  } catch (err) {
    console.log(err);
  } finally {
    console.log("finish");
    showLegues();
  }
};

const fetchTeamsPerLeague = async () => {
  const promises = listLeagues.map(async (league) => {
    try {
      const resLeagues: Response = await fetch(
        `${baseUrlForTeams}${league.strLeague}`
      );
   
      const resTeams = await resLeagues.json();
      console.log('listLeaguePerTeam')
      console.log(resTeams)
      listLeaguePerTeam.push(resTeams.teams);
    } catch (err) {
      console.log(err);
    }
  });
  return Promise.all(promises);
};

const showLegues = () => {
  let main = document.getElementById("main");
  let content: string = ``;
  for (let i = 0; i < listLeaguePerTeam.length; i++) {
    content += `<div class='card'> 
    <div class='name-league'>
    <span>${listLeaguePerTeam[i][0].strLeague}<span>
    </div>
    <div class='card-body'>
    <ul>`;
    for (let j = 0; j < listLeaguePerTeam[i].length; j++) {
      content += `<li>
   <div class='img-team'> <img src=${listLeaguePerTeam[i][j].strTeamBadge}></img></div>
   <div class='name-team'> <span>    ${listLeaguePerTeam[i][j].strTeam}</span></div>
     </li>`;
    }
    content += `</ul></div></div>`;
  }

  main.innerHTML += content;
};
