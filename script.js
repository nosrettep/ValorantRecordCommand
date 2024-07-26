((
  /** @type {string} */ streamUptimeString,
  /** @type {string} */ streamStartDateString,
  /** @type {string} */ urlEncodedGetMmrHistoryResponseJson,
  /** @type {string} */ playerName,
) => {
  return `Record command is currently down for maintenance. We're waiting on the HenrikDev API that the command relies on to be fixed. Check its status here: https://status.henrikdev.xyz/`;

  /* streamStartDateString will be a date string even if the channel is not currently live (the date will be the current
     date). This may be a Nightbot bug. This is why streamUptimeString is needed to check whether the channel is live */
  if (/\bnot live\b/i.test(streamUptimeString)) {
    return `${playerName} is not live.`;
  }

  const streamStartDate = new Date(streamStartDateString);
  if (Number.isNaN(streamStartDate.valueOf())) {
    return `Failed to parse stream start date: ${streamStartDateString}`.slice(0, 400);
  }

  const getMmrHistoryResponseJson = decodeURIComponent(urlEncodedGetMmrHistoryResponseJson);
  if (/^Error Connecting To Remote Server\b/i.test(getMmrHistoryResponseJson)) {
    return getMmrHistoryResponseJson;
  }

  try {
    /** @type {{
      readonly data: ReadonlyArray<{
        readonly mmr_change_to_last_game: number;
        readonly date_raw: number;
      }>;
    }} */
    const getMmrHistoryResponse = JSON.parse(getMmrHistoryResponseJson);

    let winCountThisStream = 0;
    let lossCountThisStream = 0;
    let drawCountThisStream = 0;
    
    let latestMatchThisStream = 0;
    let latestRawEloThisStream = null;
    let earliestMatchThisStream = Number.POSITIVE_INFINITY;
    let earliestRawEloThisStream = null;

    for (const {date_raw: dateUnixS, mmr_change_to_last_game: mmrChange, elo: rawElo} of getMmrHistoryResponse.data) {
      const date = new Date(dateUnixS * 1000);
      if (date >= streamStartDate) {
        if (mmrChange > 0) {
          winCountThisStream++;
        }
        else if (mmrChange == 0) {
          drawCountThisStream++;
        }
        else {
          lossCountThisStream++;
        }

        if (latestMatchThisStream < date) {
          latestMatchThisStream = date;
          latestRawEloThisStream = rawElo;
        }
        if (earliestMatchThisStream > date) {
          earliestMatchThisStream = date;
          earliestRawEloThisStream = rawElo - mmrChange;
        }
      }
    }
    let fullStreamEloChange = latestRawEloThisStream - earliestRawEloThisStream;

    let currentRankString = `${getMmrHistoryResponse.data[0].currenttierpatched} - ${getMmrHistoryResponse.data[0].ranking_in_tier} RR`;

    return `${playerName} is ${fullStreamEloChange >= 0 ? 'UP' : 'DOWN'} ${fullStreamEloChange}RR this stream. Currently ${winCountThisStream}W - ${lossCountThisStream}L - ${drawCountThisStream}D. | Their current rank is ${currentRankString}.`;
  } catch (e) {
    return `Failed to parse MMR history: ${e.message}: ${getMmrHistoryResponseJson}`.slice(0, 400);
  }
})
