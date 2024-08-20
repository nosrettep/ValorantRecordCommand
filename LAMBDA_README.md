# V2 Commands

Below are instructions for new versions of the Valorant Twitch chat commands. Much of the functionality remains similar, but there are a few new bells and whistles added, as well as support for more bots than just Nightbot.

The bot still relies on [HenrikDev's API](https://github.com/Henrik-3/unofficial-valorant-api), but now uses my API key instead of requiring you to go get your own.

For now, the code for it is just sitting in an AWS Lambda function. Eventually I will get it on Github for people to check out and extend, either in this repo or its own.

Feel free to reach out if you're having trouble with any of these!

---

## Example Output:

### Record Command
> When the stream is live, returns something like:
>
> `nosrettep_, Tarik has a record of 4W-0L-1D and is UP 130 RR this stream. His current rank is Radiant - 580 RR.`

> When the stream is offline, returns something like:
>
> `nosrettep_, Tarik has a record of 7W-2L-1D and is UP 103 RR over the course of the last 24 hours. His current rank is Radiant - 580 RR.`

### Rank Command
> If the player is Immortal or higher, returns something like:
>
> `nosrettep_, Radiant - 895 RR (#10 on the leaderboard with 198 wins.)`

> If the player is not on the "leaderboard" (Ascendant and lower), returns something like:
>
> `nosrettep_, Silver 3 - 80 RR`

Note that for lower ranked players this isn't much different than many other chat commands. My version isn't better, it just has more options around this.

---

## Command Templates:

> [!TIP]
> For each of the below commands, you will have to replace `RiotName`, `RiotTag`, `Region`, `StreamerPronoun`, and `StreamerName` with the appropriate values.

```
- RiotName             (example: "SEN tarik")                                             *required*
- RiotTag              (example: "1337")                                                  *required*
- Region               (example: "na") -- could be any of: [eu, na, latam, br, ap, kr]    *required*
- StreamerPronoun      (example: "His")                                                   *defaults to "Their"*
- StreamerName         (example: "Tarik") -- or "Tarik's alt account" also works          *defaults to value of RiotName*
```

---

### Nightbot

#### Record Command
`
$(touser), $(urlfetch https://maycbf42n557zb3oqdraffjc3e0afdcp.lambda-url.us-west-1.on.aws/?name=RiotName&tag=RiotTag&region=Region&pronoun=StreamerPronoun&uptime=$(twitch $(channel) "{{uptimeLength}}")&player_name=StreamerName)
`

#### Rank Command
`
$(touser), $(urlfetch https://maycbf42n557zb3oqdraffjc3e0afdcp.lambda-url.us-west-1.on.aws/?name=RiotName&tag=RiotTag&region=Region&player_name=StreamerName?rankOnly=true)
`

---

### Fossabot

#### Record Command
`
$(touser), $(urlfetch https://maycbf42n557zb3oqdraffjc3e0afdcp.lambda-url.us-west-1.on.aws/?name=RiotName&tag=RiotTag&region=Region&pronoun=StreamerPronoun&uptime=$(uptime)&player_name=StreamerName)
`

#### Rank Command
`
$(touser), $(urlfetch https://maycbf42n557zb3oqdraffjc3e0afdcp.lambda-url.us-west-1.on.aws/?name=RiotName&tag=RiotTag&region=Region&player_name=StreamerName?rankOnly=true)
`

---

### StreamElements

#### Record Command
`
$(touser), $(urlfetch https://maycbf42n557zb3oqdraffjc3e0afdcp.lambda-url.us-west-1.on.aws/?name=RiotName&tag=RiotTag&region=Region&pronoun=StreamerPronoun&uptime=$(queryescape $(uptime))&player_name=StreamerName)
`

#### Rank Command
`
$(touser), $(urlfetch https://maycbf42n557zb3oqdraffjc3e0afdcp.lambda-url.us-west-1.on.aws/?name=RiotName&tag=RiotTag&region=Region&player_name=StreamerName?rankOnly=true)
`
