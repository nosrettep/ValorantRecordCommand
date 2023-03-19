((
  /** @type {string} */ streamUptimeString,
  /** @type {string} */ streamStartDateString,
  /** @type {string} */ urlEncodedGetMmrHistoryResponseJson,
) => {

  /* streamStartDateString will be a date string even if the channel is not currently live (the date will be the current
     date). This may be a Nightbot bug. This is why streamUptimeString is needed to check whether the channel is live */
  if (/\bnot live\b/i.test(streamUptimeString)) {
    return 'Bini is not live';
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

    // counter variables to keep track of record
    let winCountThisStream = 0;
    let lossCountThisStream = 0;
    let drawCountThisStream = 0;
    
    // keep track of 
    let latestMatchDateThisStream = 0;
    let latestRawEloThisStream = null;
    let earliestMatchDateThisStream = Number.POSITIVE_INFINITY;
    let earliestRawEloThisStream = null;

    for (let i = 0; i < getMmrHistoryResponse.data.length; i++) {
      const match = getMmrHistoryResponse.data[i];
      const priorMatch = getMmrHistoryResponse.data[i+1]
      const dateUnixS = match.date_raw;
      const mmrChange = match.mmr_change_to_last_game;
      const rawElo = match.elo;
      
      const date = new Date(dateUnixS * 1000);
      if (date >= streamStartDate) {
        // tally win/loss/draw
        if (mmrChange > 0) {
          winCountThisStream++;
        }
        else if (mmrChange == 0) {
          drawCountThisStream++;
        }
        else {
          lossCountThisStream++;
        }

        // keep track of rawElo values from the earliest and latest
        // matches of the stream
        if (latestMatchDateThisStream < date) {
          latestMatchDateThisStream = date;
          latestRawEloThisStream = rawElo;
        }
        if (earliestMatchDateThisStream > date) {
          earliestMatchDateThisStream = date;
          earliestRawEloThisStream = priorMatch.elo;
        }
      }
    }
    let fullStreamEloChange = latestRawEloThisStream - earliestRawEloThisStream;

    return `Bini is ${fullStreamEloChange >= 0 ? 'UP' : 'DOWN'} ${fullStreamEloChange}RR this stream. Currently ${winCountThisStream}W - ${lossCountThisStream}L - ${drawCountThisStream}D.`;
  } catch (e) {
    return `Failed to parse MMR history: ${e.message}: ${getMmrHistoryResponseJson}`.slice(0, 400);
  }
})
