# Valorant Record Command
Script(s) to accompany data from api.henrikdev.xyz for use in a chatbot !record command. See more about the underlying HenrikDev API here: https://github.com/Henrik-3/unofficial-valorant-api

---

## Update: August 18, 2024 - New Version of Command
Because the way this command works relies on the $(eval) Javascript functionality offered by Nightbot, which is not offered by other popular chatbots like Fossabot and StreamElements, I've recreated this stuff in a separate AWS Lambda function, and would recommend that people start using that now, instead of this one. I will leave this up here but have stopped making updates to it.

> [!IMPORTANT]
> **Check out instructions on how to set yourself up with the new and improved command [HERE](LAMBDA_README.md).**

It works for Nightbot, StreamElements, and Fossabot! It also allows you to customize the pronoun the bot uses to refer to the streamer, and automatically displays the last 24 hours of record and RR differential if the stream is offline.

## Update: July 25, 2024 - API Keys
HenrikDev made an update to their API to make it require an API key a while back, and the command won't work any more without adding

```?api_key=YOUR_API_KEY```

to the https://api.henrikdev.xyz URL. To get an API key, follow the instructions on Henrik's site and use the Discord bot to request one.

---

## Usage Example (Nightbot)
```!addcom !record $(touser), $(eval $(urlfetch json https://raw.githubusercontent.com/nosrettep/ValorantNightbot/main/script.js)('$(twitch $(channel) "{{uptimeLength}}")','$(twitch $(channel) "{{uptimeAt}}")',"$(querystring $(urlfetch json https://api.henrikdev.xyz/valorant/v1/mmr-history/na/username/tag?api_key=YOUR_API_KEY))", 'PlayerName'))```
 
 Will produce something similar to:
 ```
 Justin is UP 46RR this stream. Currently 4W - 1L - 0D. | Their current rank is Immortal 3 - 473RR. 
 ```

> [!WARNING]
> Note that in the above example, `username` should be replaced with the player's Riot username, `tag` should be replaced with the player's Riot tag, and `PlayerName` should be replaced with whatever name the bot should use to refer to the player / streamer.


## Limitations
The !record command assumes that every 0 RR match is a draw, every positive RR match is a win, and every negative RR match is a loss. It cannot tell apart losses from draws which have small amounts of negative RR, for example. Additionally, it only can see 20 games worth of data at maximum. 

Additionally, if the stream begins with an L with loss protection (bringing them to 0 RR), or if they begin the stream with a rank up game, and get boosted up to 10 RR in their division  with a promotion bonus, the reported RR change value for the stream can be off by a small amount.
