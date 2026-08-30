/* & Juliet: the jukebox musical built from ~30 of Max Martin's songs, reimagining what
   happens after Shakespeare's Romeo & Juliet if Juliet chooses her own ending.
   Production dates/status compiled from Wikipedia and the show's official site,
   accurate as of mid-2026. Titled "& Julia" in German- and Swedish-language productions.
   Each production's url is that production's own official page (venue, tour, or
   local producer site) — checked to make sure it actually resolves. For closed
   productions with no live official page left, the url points to a stable
   record of the run instead (ticketing operator or regional theatre-news page). */
const MAX_MARTIN_JULIET = {
  intro: "& Juliet reimagines Shakespeare's Romeo & Juliet: Juliet gets a second chance at life, set to roughly 30 of Max Martin's songs. It opened in Manchester in 2019 and has since toured the world.",
  officialUrl: "https://andjulietthemusical.com/",
  productions: [
    { place: "Stockholm, Sweden", venue: "\"& Julia\" (Swedish-language production)", dates: "Since Feb 2026", status: "running", statusLabel: "Running", url: "https://cirkus.se/en/shows/och-julia/" },
    { place: "New Zealand", venue: "National production", dates: "Since Apr 2026", status: "running", statusLabel: "Running", url: "https://www.gntproductions.co.nz/and-juliet" },
    { place: "Toronto, Canada", venue: "Royal Alexandra Theatre (all-Canadian cast)", dates: "Dec 2025 – Aug 2026", status: "running", statusLabel: "Running", url: "https://www.mirvish.com/shows/and-juliet" },
    { place: "New York, USA", venue: "Broadway — Stephen Sondheim Theatre", dates: "Since Nov 2022", status: "running", statusLabel: "Running", url: "http://andjulietbroadway.com/" },
    { place: "North America", venue: "National touring production", dates: "Since Sep 2024", status: "running", statusLabel: "Touring", url: "https://andjulietbroadway.com/tour/" },
    { place: "Stuttgart, Germany", venue: "\"& Julia\" (German-language production)", dates: "From Oct 2026", status: "upcoming", statusLabel: "Upcoming", url: "https://www.stage-entertainment.de/musicals-shows/und-julia-hamburg" },
    { place: "Netherlands", venue: "Dutch-language production", dates: "From Sep 2026", status: "upcoming", statusLabel: "Upcoming", url: "https://www.stage-entertainment.nl/shows/musical/andjuliet" },
    { place: "Hamburg, Germany", venue: "\"& Julia\" — Operettenhaus", dates: "Oct 2024 – Feb 2026", status: "closed", statusLabel: "Closed", url: "https://www.stage-entertainment.de/musicals-shows/und-julia-hamburg" },
    { place: "United Kingdom & Ireland", venue: "National touring production", dates: "Jul 2024 – Jun 2025", status: "closed", statusLabel: "Closed", url: "https://www.andjulietthemusical.co.uk/" },
    { place: "Sydney, Australia", venue: "Sydney Lyric", dates: "Mar – Jul 2024", status: "closed", statusLabel: "Closed", url: "https://michaelcassel.com/shows/australia/juliet/" },
    { place: "Perth, Australia", venue: "Crown Theatre", dates: "Dec 2023 – Mar 2024", status: "closed", statusLabel: "Closed", url: "https://michaelcassel.com/shows/australia/juliet/" },
    { place: "Singapore", venue: "Sands Theatre, Marina Bay", dates: "Sep – Oct 2023", status: "closed", statusLabel: "Closed", url: "https://www.broadwayworld.com/singapore/regional/Juliet-3813531" },
    { place: "Melbourne, Australia", venue: "Regent Theatre", dates: "Feb – Jul 2023", status: "closed", statusLabel: "Closed", url: "https://michaelcassel.com/shows/australia/juliet/" },
    { place: "Toronto, Canada", venue: "Princess of Wales Theatre (original run)", dates: "Jun – Aug 2022", status: "closed", statusLabel: "Closed", url: "https://www.mirvish.com/shows/and-juliet" },
    { place: "London, UK", venue: "West End — Shaftesbury Theatre", dates: "Nov 2019 – Mar 2023", status: "closed", statusLabel: "Closed", url: "https://www.andjulietthemusical.co.uk/" },
    { place: "Manchester, UK", venue: "Opera House (world premiere tryout)", dates: "Sep – Oct 2019", status: "closed", statusLabel: "Closed", url: "https://www.atgtickets.com/shows/and-juliet/opera-house-manchester/" },
  ],
};
