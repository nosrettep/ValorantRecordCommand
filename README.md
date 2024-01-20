# Valorant Record Command
Script(s) to accompany data from api.henrikdev.xyz for use in a chatbot !record command. See more about the underlying HenrikDev API here: https://github.com/Henrik-3/unofficial-valorant-api


## Usage Example (Nightbot)
```!addcom !record $(touser), $(eval $(urlfetch json https://raw.githubusercontent.com/nosrettep/ValorantNightbot/main/script.js)('$(twitch $(channel) "{{uptimeLength}}")','$(twitch $(channel) "{{uptimeAt}}")',"$(querystring $(urlfetch json https://api.henrikdev.xyz/valorant/v1/mmr-history/na/username/tag))", 'PlayerName')) | His current rank is $(customapi https://api.kyroskoh.xyz/valorant/v1/mmr/na/username/tag?show=combo&display=0).```
 
 Will produce something similar to:
 ```
 Justin is UP 46RR this stream. Currently 4W - 1L - 0D. | His current rank is Immortal 3 - 473RR. 
 ```

Note that in the above example, `username` should be replaced with the player's Riot username, `tag` should be replaced with the player's Riot tag, and `PlayerName` should be replaced with whatever name the bot should use to refer to the player / streamer.


## Limitations
The !record command assumes that every 0 RR match is a draw, every positive RR match is a win, and every negative RR match is a loss. It cannot tell apart losses from draws which have small amounts of negative RR, for example. Additionally, it only can see 20 games worth of data at maximum. 

Additionally, if the stream begins with an L with loss protection (bringing them to 0 RR), or if they begin the stream with a rank up game, and get boosted up to 10 RR in their division  with a promotion bonus, the reported RR change value for the stream can be off by a small amount.
