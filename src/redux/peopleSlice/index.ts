import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type PeopleType = {
  name: string;
  birth_year: string | number;
  eye_color: string;
  films: string[];
  gender: string;
  hair_color: string;
  height: number;
  homeworld: string;
  mass: number;
  species: string[];
  starships: string[];
  vehicles: string[];
  [key: string]: string | number | string[];
};

export type FilterType = {
  mass: { min: number; max: number };
  height: { min: number; max: number };
  eye_color: string[];
  gender: string[];
  birth_year: { min: number; max: number };
  [key: string]: string[] | { min: number; max: number };
};

type PayloadPeople = {
  name: string;
  birth_year: string;
  eye_color: string;
  films: string[];
  gender: string;
  hair_color: string;
  height: string;
  homeworld: string;
  mass: string;
  species: string[];
  starships: string[];
  vehicles: string[];
};

type PayloadType = {
  pages: number;
  currentPage: number;
  people: PayloadPeople[];
};

type InitialType = {
  pages: number;
  currentPage: number;
  people: PeopleType[];
  filters: FilterType;
};

const initialState: InitialType = {
  pages: 1,
  currentPage: 1,
  people: [],
  filters: {
    mass: {
      min: 0,
      max: 100,
    },
    height: {
      min: 0,
      max: 100,
    },
    birth_year: {
      min: 0,
      max: 100,
    },
    eye_color: [],
    gender: [],
  },
};

export const people = createSlice({
  name: "people",
  initialState,
  reducers: {
    setPeople: (state, action: PayloadAction<PayloadType>) => {
      const init = action.payload.pages;
      const perPage = 10;
      const remaining = init % perPage;
      const pages =
        remaining >= 1
          ? (init - remaining) / perPage + 1
          : (init - remaining) / perPage;

      state.pages = pages;

      const modifiedData = action.payload.people.map((item) => {
        const birthYear = parseFloat(item.birth_year.replace("BBY", ""));
        const mass = parseFloat(item.mass);
        const height = parseFloat(item.height);

        return {
          ...item,
          mass: mass,
          height: height,
          birth_year: isNaN(birthYear) ? "unknown" : birthYear,
        };
      });
      state.people = modifiedData;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    getMorePeople: (state, action: PayloadAction<PayloadPeople[]>) => {
      const modifiedData = action.payload.map((item) => {
        const birthYear = parseFloat(item.birth_year.replace("BBY", ""));
        const mass = parseFloat(item.mass);
        const height = parseFloat(item.height);
        return {
          ...item,
          mass: mass,
          height: height,
          birth_year: isNaN(birthYear) ? "unknown" : birthYear,
        };
      });
      state.people = modifiedData;
    },
  },
});

export const { setPeople, setPage, getMorePeople } = people.actions;
export default people.reducer;
