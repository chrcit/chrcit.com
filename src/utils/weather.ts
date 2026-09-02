// Open-Meteo daily.weather_code is the most severe hour of the calendar day
// (max WMO code), so a midnight thunderstorm makes a sunny day "stormy".
// Headline the remaining daytime instead; the icon/dither use current sky.

export const VIENNA_WX_KEY = "chrcit-vienna-wx-3";

export type OpenMeteoForecast = {
  current?: {
    time?: string;
    temperature_2m?: number;
    weather_code?: number;
  };
  hourly?: {
    time?: string[];
    weather_code?: (number | null)[];
    precipitation?: (number | null)[];
    is_day?: (number | null)[];
  };
  daily?: {
    temperature_2m_max?: (number | null)[];
  };
};

export type ViennaWx = {
  temp: number;
  tempMax: number;
  code: number;
  todayCode: number;
};

type Hour = {
  code: number;
  precip: number;
  isDay: boolean;
};

const isStorm = (code: number) => code >= 95;
const isSnow = (code: number) => (code >= 71 && code <= 77) || code === 85 || code === 86;
const isRain = (code: number) => (code >= 61 && code <= 67) || (code >= 80 && code <= 82);
const isDrizzle = (code: number) => code >= 51 && code <= 57;

const remainingHours = (data: OpenMeteoForecast, currentTime: string): Hour[] => {
  const times = data.hourly?.time;
  const codes = data.hourly?.weather_code;
  if (!times || !codes) return [];

  const precip = data.hourly?.precipitation;
  const isDay = data.hourly?.is_day;
  const day = currentTime.slice(0, 10);
  const hourKey = currentTime.slice(0, 13);
  const hours: Hour[] = [];

  for (let i = 0; i < times.length; i++) {
    const t = times[i];
    const code = codes[i];
    if (!t || t.slice(0, 10) !== day || t.slice(0, 13) < hourKey) continue;
    if (typeof code !== "number") continue;
    const mm = precip?.[i];
    const dayFlag = isDay?.[i];
    hours.push({
      code,
      precip: typeof mm === "number" ? mm : 0,
      isDay: dayFlag == null ? true : dayFlag === 1,
    });
  }
  return hours;
};

const headlineWindow = (hours: Hour[]): Hour[] => {
  const daytime = hours.filter((h) => h.isDay);
  return daytime.length >= 2 ? daytime : hours;
};

const pickTodayCode = (data: OpenMeteoForecast, currentCode: number): number => {
  const currentTime = data.current?.time;
  if (!currentTime) return currentCode;

  const window = headlineWindow(remainingHours(data, currentTime));
  if (window.length === 0) return currentCode;

  const precip = window.reduce((sum, h) => sum + h.precip, 0);
  const storms = window.filter((h) => isStorm(h.code));
  const snow = window.filter((h) => isSnow(h.code));
  const rain = window.filter((h) => isRain(h.code));
  const drizzle = window.filter((h) => isDrizzle(h.code));

  if (storms.length >= 1 && (precip >= 0.5 || storms.length >= 2)) return 95;
  if (snow.length >= 2 || (snow.length >= 1 && precip >= 0.2)) return snow[0].code;
  if (rain.length >= 2 || (rain.length >= 1 && precip >= 0.8)) return 63;
  if (drizzle.length >= 2 || precip >= 0.8) return 53;

  return currentCode;
};

export const pickViennaWx = (data: OpenMeteoForecast): ViennaWx | null => {
  const temp = data.current?.temperature_2m;
  const code = data.current?.weather_code;
  if (typeof temp !== "number" || typeof code !== "number") return null;

  const dailyMax = data.daily?.temperature_2m_max?.[0];
  const tempMax = typeof dailyMax === "number" ? dailyMax : temp;

  return {
    temp,
    tempMax,
    code,
    todayCode: pickTodayCode(data, code),
  };
};
