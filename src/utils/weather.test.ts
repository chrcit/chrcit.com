import assert from "node:assert/strict";
import { test } from "node:test";
import { pickViennaWx, type OpenMeteoForecast } from "./weather.ts";

// 2026-09-01 Vienna, ~10:30. A thunderstorm at midnight made Open-Meteo's
// daily.weather_code = 95, while the rest of the day is dry and mainly clear.
const viennaMorning: OpenMeteoForecast = {
  current: { time: "2026-09-01T10:30", temperature_2m: 23.2, weather_code: 1 },
  daily: { temperature_2m_max: [27.3] },
  hourly: {
    time: [
      "2026-09-01T00:00",
      "2026-09-01T01:00",
      "2026-09-01T02:00",
      "2026-09-01T03:00",
      "2026-09-01T04:00",
      "2026-09-01T05:00",
      "2026-09-01T06:00",
      "2026-09-01T07:00",
      "2026-09-01T08:00",
      "2026-09-01T09:00",
      "2026-09-01T10:00",
      "2026-09-01T11:00",
      "2026-09-01T12:00",
      "2026-09-01T13:00",
      "2026-09-01T14:00",
      "2026-09-01T15:00",
      "2026-09-01T16:00",
      "2026-09-01T17:00",
      "2026-09-01T18:00",
      "2026-09-01T19:00",
      "2026-09-01T20:00",
      "2026-09-01T21:00",
      "2026-09-01T22:00",
      "2026-09-01T23:00",
    ],
    weather_code: [95, 80, 1, 0, 3, 0, 0, 0, 0, 0, 0, 1, 2, 3, 2, 2, 2, 2, 1, 0, 0, 3, 3, 1],
    precipitation: [
      2.7, 0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    is_day: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  },
};

test("a spent midnight storm does not headline a sunny Vienna morning", () => {
  const wx = pickViennaWx(viennaMorning);
  assert.ok(wx);
  assert.equal(wx.code, 1);
  assert.equal(wx.todayCode, 1);
  assert.equal(wx.temp, 23.2);
  assert.equal(wx.tempMax, 27.3);
  assert.notEqual(wx.todayCode, 95);
});

test("an afternoon thunderstorm still ahead headlines the day", () => {
  const wx = pickViennaWx({
    current: { time: "2026-09-01T10:30", temperature_2m: 22, weather_code: 1 },
    daily: { temperature_2m_max: [27] },
    hourly: {
      time: ["2026-09-01T10:00", "2026-09-01T11:00", "2026-09-01T16:00", "2026-09-01T17:00"],
      weather_code: [1, 2, 95, 80],
      precipitation: [0, 0, 3.2, 1.1],
      is_day: [1, 1, 1, 1],
    },
  });
  assert.ok(wx);
  assert.equal(wx.code, 1);
  assert.equal(wx.todayCode, 95);
});

test("a one-hour drizzle blip does not override a clear sky", () => {
  const wx = pickViennaWx({
    current: { time: "2026-09-01T10:00", temperature_2m: 18, weather_code: 0 },
    daily: { temperature_2m_max: [21] },
    hourly: {
      time: ["2026-09-01T10:00", "2026-09-01T11:00", "2026-09-01T12:00"],
      weather_code: [0, 51, 1],
      precipitation: [0, 0.1, 0],
      is_day: [1, 1, 1],
    },
  });
  assert.ok(wx);
  assert.equal(wx.todayCode, 0);
});

test("several remaining rain hours headline as rainy", () => {
  const wx = pickViennaWx({
    current: { time: "2026-09-01T09:00", temperature_2m: 12, weather_code: 3 },
    daily: { temperature_2m_max: [14] },
    hourly: {
      time: ["2026-09-01T09:00", "2026-09-01T10:00", "2026-09-01T11:00", "2026-09-01T12:00"],
      weather_code: [3, 61, 63, 61],
      precipitation: [0, 0.4, 1.2, 0.6],
      is_day: [1, 1, 1, 1],
    },
  });
  assert.ok(wx);
  assert.equal(wx.code, 3);
  assert.equal(wx.todayCode, 63);
});

test("without hourly data, current sky wins over a missing daily code", () => {
  const wx = pickViennaWx({
    current: { time: "2026-09-01T10:30", temperature_2m: 23.2, weather_code: 1 },
    daily: { temperature_2m_max: [27.3] },
  });
  assert.ok(wx);
  assert.equal(wx.code, 1);
  assert.equal(wx.todayCode, 1);
  assert.equal(wx.tempMax, 27.3);
});

test("rejects a payload with no current observation", () => {
  assert.equal(pickViennaWx({ daily: { temperature_2m_max: [27] } }), null);
});
