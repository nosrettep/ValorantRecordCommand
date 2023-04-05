# ValorantNightbot
Script(s) to accompany data from api.henrikdev.xyz for use in a chatbot !record command.


## Limitations
The !record command assumes that every 0 RR match is a draw, every positive RR match is a win, and every negative RR match is a loss. It cannot tell apart losses from draws which have small amounts of negative RR, for example. Additionally, it only can see 20 games worth of data at maximum. 
