import { FormEvent, FunctionComponent, useEffect, useState } from "react";
import { IoOptions, IoSearch } from "react-icons/io5";
import classes from "./Filter.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux";
import { removeFilters, setFilterBy } from "../../redux/filterSlice";
import { MdOutlineClear } from "react-icons/md";
import { InputRange } from "..";

const Filter: FunctionComponent = () => {
  const { filters } = useSelector((state: RootState) => state.filters);
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState<boolean>(false);
  const [eyes, setEyes] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [birthYear, setBirthYear] = useState<{ min: number; max: number }>({
    min: filters.birth_year.min,
    max: filters.birth_year.max,
  });
  const [mass, setMass] = useState<{ min: number; max: number }>({
    min: filters.mass.min,
    max: filters.mass.max,
  });
  const [height, setHeight] = useState<{ min: number; max: number }>({
    min: filters.height.min,
    max: filters.height.max,
  });

  const [errors, setErrors] = useState({
    massErr: { min: false, max: false },
    heightErr: { min: false, max: false },
    birth_yearErr: { min: false, max: false },
  });

  const validateMinMax = (key: string, min: number, max: number) => {
    const filterObj = filters[key] as { min: number; max: number };

    return {
      min: min >= max || min < 0,
      max: max > filterObj.max || max <= min,
    };
  };

  const handleErrorCheck = () => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      massErr: validateMinMax("mass", mass.min, mass.max),
      heightErr: validateMinMax("height", height.min, height.max),
      birth_yearErr: validateMinMax("birth_year", birthYear.min, birthYear.max),
    }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      errors.massErr.min ||
      errors.massErr.max ||
      errors.heightErr.min ||
      errors.heightErr.max ||
      errors.birth_yearErr.min ||
      errors.birth_yearErr.max
    )
      return;

    const filt = {
      mass,
      height,
      eye_color: eyes,
      gender: gender,
      birth_year: birthYear,
    };
    dispatch(setFilterBy(filt));
    toggleOpen();
  };

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClearFilters = () => {
    dispatch(removeFilters());
    toggleOpen();
  };

  useEffect(() => {
    handleErrorCheck();
  }, [birthYear, mass, height]);

  useEffect(() => {
    setBirthYear({
      min: filters.birth_year.min,
      max: filters.birth_year.max,
    });
    setMass({
      min: filters.mass.min,
      max: filters.mass.max,
    });
    setHeight({
      min: filters.height.min,
      max: filters.height.max,
    });
  }, [filters]);

  return (
    <section
      className={`${classes.container} ${
        document.body.clientWidth <= 400 && open && filters
          ? classes.mobile
          : ""
      }`}
    >
      <div
        className={classes.Filter}
        style={
          open
            ? { background: "#f6f6f6", width: "100%" }
            : { background: "none", width: "76px" }
        }
      >
        <button onClick={toggleOpen} className={classes.Filter__toggle}>
          <IoOptions />
        </button>
        {open && filters && (
          <form
            className={classes.Filter__filters}
            onSubmit={onSubmit}
            style={
              open && filters
                ? { width: "100%", opacity: 1 }
                : { width: "0px", opacity: 0 }
            }
          >
            <label className={classes.Filter__opt_select}>
              <p>Eye color</p>
              <select onChange={(e) => setEyes(e.target.value)}>
                <option value={""}>Select</option>
                {filters.eye_color.map((color) => (
                  <option value={color} key={color}>
                    {color}
                  </option>
                ))}
              </select>
            </label>
            <label className={classes.Filter__opt_select}>
              <p>Gender</p>
              <select onChange={(e) => setGender(e.target.value)}>
                <option value={""}>Select</option>
                {filters.gender.map((gen) => (
                  <option value={gen} key={gen}>
                    {gen}
                  </option>
                ))}
              </select>
            </label>
            <InputRange
              label="Birth Year"
              valueMin={birthYear.min}
              valueMax={birthYear.max}
              min={filters.birth_year.min}
              max={filters.birth_year.max}
              onChangeMin={(value) =>
                setBirthYear({ ...birthYear, min: value })
              }
              onChangeMax={(value) =>
                setBirthYear({ ...birthYear, max: value })
              }
              errorMin={errors.birth_yearErr.min}
              errorMax={errors.birth_yearErr.max}
            />

            <InputRange
              label="Mass"
              valueMin={mass.min}
              valueMax={mass.max}
              min={filters.mass.min}
              max={filters.mass.max}
              onChangeMin={(value) => setMass({ ...mass, min: value })}
              onChangeMax={(value) => setMass({ ...mass, max: value })}
              errorMin={errors.massErr.min}
              errorMax={errors.massErr.max}
            />

            <InputRange
              label="Height"
              valueMin={height.min}
              valueMax={height.max}
              min={filters.height.min}
              max={filters.height.max}
              onChangeMin={(value) => setHeight({ ...height, min: value })}
              onChangeMax={(value) => setHeight({ ...height, max: value })}
              errorMin={errors.heightErr.min}
              errorMax={errors.heightErr.max}
            />
            <button type="submit" className={`${classes.Filter__submit}`}>
              <IoSearch />
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className={`${classes.Filter__clear}`}
            >
              <span>
                <MdOutlineClear />
              </span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Filter;
