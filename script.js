((
  /** @type {string} */ streamUptimeString,
  /** @type {string} */ streamStartDateString,
  /** @type {string} */ urlEncodedGetMmrHistoryResponseJson,
) => {
  /* streamStartDateString will be a date string even if the channel is not currently live (the date will be the current
     date). This may be a Nightbot bug. This is why streamUptimeString is needed to check whether the channel is live */
  if (/\bnot live\b/i.test(streamUptimeString)) {
    return 'TrulyTenzin is not live';
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

    let mmrChangeThisStream = 0;
    let winCountThisStream = 0;
    let lossCountThisStream = 0;
    for (const {date_raw: dateUnixS, mmr_change_to_last_game: mmrChange} of getMmrHistoryResponse.data) {
      const date = new Date(dateUnixS * 1000);
      if (date >= streamStartDate) {
        mmrChangeThisStream += mmrChange;

        if (mmrChange > 0) {
          winCountThisStream++;
        } else {
          lossCountThisStream++;
        }
      }
    }

    return `billy bongos#10ZIN is ${mmrChangeThisStream > 0 ? 'UP' : 'DOWN'} ${mmrChangeThisStream}RR. Currently ${winCountThisStream}W-${lossCountThisStream}L`;
  } catch (e) {
    return `Failed to parse MMR history: ${e.message}: ${getMmrHistoryResponseJson}`.slice(0, 400);
  }
})
