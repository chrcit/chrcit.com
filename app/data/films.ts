export type FilmSeed = {
  title: string;
  year?: number;
  imdbId?: string;
  rating?: number;
  letterboxdSlug?: string;
};

export const fallbackFilmSeeds: FilmSeed[] = [
  { title: "In the Mood for Love", year: 2000 },
  { title: "Spirited Away", year: 2001 },
  { title: "Pan's Labyrinth", year: 2006 },
  { title: "The Godfather", year: 1972 },
  { title: "The Matrix", year: 1999 },
  { title: "Lost in Translation", year: 2003 },
  { title: "The Grand Budapest Hotel", year: 2014 },
  { title: "Her", year: 2013 },
  { title: "Arrival", year: 2016 },
  { title: "Moonlight", year: 2016 },
  { title: "The Handmaiden", year: 2016 },
  { title: "Blade Runner 2049", year: 2017 },
  { title: "Roma", year: 2018 },
  { title: "Parasite", year: 2019 },
  { title: "Portrait of a Lady on Fire", year: 2019 },
  { title: "Drive", year: 2011 },
];
