import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PeopleType } from "../peopleSlice";

export type FilterType = {
  mass: { min: number; max: number };
  height: { min: number; max: number };
  eye_color: string[];
  gender: string[];
  birth_year: { min: number; max: number };
  [key: string]: string[] | { min: number; max: number };
};

export type FilterByType = {
  mass?: { min?: number; max?: number };
  height?: { min?: number; max?: number };
  eye_color?: string | undefined;
  gender?: string | undefined;
  birth_year?: { min?: number; max?: number };
};

type InitialType = {
  filters: FilterType;
  filterBy?: FilterByType;
};

const initialState: InitialType = {
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

export const filter = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<PeopleType[]>) => {
      const filterNum = (cat: string) => {
        return action.payload
          .map((ppl) => Number(ppl[cat]))
          .filter((value) => !isNaN(value));
      };

      const filterString = (cat: string, filt: string) => {
        return action.payload
          .map((ppl) => ppl[cat])
          .filter((value) => value !== filt);
      };

      const masses = filterNum("mass").sort((a, b) => b - a);
      const height = filterNum("height").sort((a, b) => b - a);
      const eyeColor = [...new Set(filterString("eye_color", "unknown"))];
      const gender = [...new Set(filterString("gender", "n/a"))];

      const numYears = action.payload.map((human) =>
        parseFloat((human.birth_year as string).replace("BBY", ""))
      );
      const birthYear = numYears
        .filter((value) => !isNaN(value))
        .sort((a, b) => b - a);

      const newFilters = {
        mass: { min: masses[masses.length - 1], max: masses[0] },
        height: { min: height[height.length - 1], max: height[0] },
        birth_year: {
          min: birthYear[birthYear.length - 1],
          max: birthYear[0],
        },
        eye_color: eyeColor.map(String),
        gender: gender.map(String),
      };
      state.filters = newFilters;
    },
    setFilterBy: (state, action: PayloadAction<FilterByType>) => {
      state.filterBy = action.payload;
    },
    removeFilters: (state) => {
      delete state.filterBy;
    },
  },
});

export const { setFilters, setFilterBy, removeFilters } = filter.actions;
export default filter.reducer;
