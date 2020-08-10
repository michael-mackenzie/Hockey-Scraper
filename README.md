# AHL Web Scraper

<!--- These are examples. See https://shields.io for others or to customize this set of shields. You might want to include dependencies, project status and licence info here --->

This is a script to scrape per period goal data for AHL teams.  It cycles through text box score sheets from each game, scrapes the required data, parses it, and returns a csv.    

## Procedure

1. Using dev tools in chrome, a JSON file was returned upon the initial GET request when accessing the theahl.com full season game scores list (per team).

2. This JSON contained the game ID for each game.  All stats on theahl.com are sourced from a third-party company, which also makes each game's text box score sheets publicly available.

3. This JSON was parsed to grab the game IDs, then the third-party company's text box score sheets were scraped.

4. Finally, a nicely formatted csv is exported to the current working directory.

## Output Format

For a specified team, the output will look like the following:

![Model Output](../master/mscraper.GIF)

## Contact

If you want to contact me you can reach me at mikedavidmackenzie@gmail.com.
