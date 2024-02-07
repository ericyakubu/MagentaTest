import { FunctionComponent, useEffect, useState } from "react";
import { IoOptions, IoSearch } from "react-icons/io5";
import classes from "./Filter.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { removeFilters, setFilterBy } from "../../redux/filterSlice";
import { MdOutlineClear } from "react-icons/md";

type Inputs = {
  mass?: { min?: number; max?: number };
  height?: { min?: number; max?: number };
  eye_color?: string | undefined;
  gender?: string | undefined;
  birth_year?: { min?: number; max?: number };
};

const Filter: FunctionComponent = () => {
  const { filters } = useSelector((state: RootState) => state.filters);
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState<boolean>(false);

  const returnSchema = () => {
    return yup.object().shape({
      mass: yup.object().shape(createMinMaxTest("mass")),
      height: yup.object().shape(createMinMaxTest("height")),
      birth_year: yup.object().shape(createMinMaxTest("birth_year")),
      eye_color: yup.string().default(filters.eye_color[0]),
      gender: yup.string().default(filters.gender[0]),
    });
  };

  const createMinMaxTest = (fieldName: string) => ({
    min: yup
      .number()
      .min((filters[fieldName] as { min: number; max: number }).min)
      .default((filters[fieldName] as { min: number; max: number }).min)
      .test("min-max", function (value) {
        const { max } = this.parent;
        return value === undefined || max === undefined || value < max;
      }),
    max: yup
      .number()
      .max((filters[fieldName] as { min: number; max: number }).max)
      .default((filters[fieldName] as { min: number; max: number }).max)
      .test("min-max", function (value) {
        const { min } = this.parent;
        return value === undefined || min === undefined || value > min;
      }),
  });

  let validationSchema = returnSchema();

  useEffect(() => {
    if (filters.mass.min === 0 || isNaN(filters.mass.min)) return;
    validationSchema = returnSchema();
  }, [filters]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    dispatch(setFilterBy(data));
    toggleOpen();
  };

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClearFilters = () => {
    dispatch(removeFilters());
    toggleOpen();
  };

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
            onSubmit={handleSubmit(onSubmit)}
            style={
              open && filters
                ? { width: "100%", opacity: 1 }
                : { width: "0px", opacity: 0 }
            }
          >
            <label className={classes.Filter__opt_select}>
              <p>Eye color</p>
              <select
                {...register("eye_color")}
                className={errors.eye_color ? classes.Error : ""}
              >
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
              <select
                {...register("gender")}
                className={errors.gender ? classes.Error : ""}
              >
                <option value={""}>Select</option>
                {filters.gender.map((gen) => (
                  <option value={gen} key={gen}>
                    {gen}
                  </option>
                ))}
              </select>
            </label>

            <div className={classes.Filter__opt}>
              <p>Birth year</p>
              <div className={classes.Filter__opt_inputs}>
                <label>
                  <span>Min: </span>
                  <input
                    {...(register("birth_year.min"),
                    { defaultValue: filters.birth_year.min })}
                    className={errors.birth_year?.max ? classes.Error : ""}
                  />
                </label>
                <label>
                  <span>Max: </span>
                  <input
                    {...(register("birth_year.max"),
                    { defaultValue: filters.birth_year.max })}
                    className={errors.birth_year?.max ? classes.Error : ""}
                  />
                </label>
              </div>
            </div>
            <div className={classes.Filter__opt}>
              <p>Mass</p>
              <div className={classes.Filter__opt_inputs}>
                <label>
                  <span>Min: </span>
                  <input
                    {...(register("mass.min"),
                    { defaultValue: filters.mass.min })}
                    className={errors.mass?.min ? classes.Error : ""}
                  />
                </label>
                <label>
                  <span>Max: </span>
                  <input
                    {...(register("mass.max"),
                    { defaultValue: filters.mass.max })}
                    className={errors.mass?.max ? classes.Error : ""}
                  />
                </label>
              </div>
            </div>
            <div className={classes.Filter__opt}>
              <p>Height</p>
              <div className={classes.Filter__opt_inputs}>
                <label>
                  <span>Min: </span>
                  <input
                    {...(register("height.min"),
                    { defaultValue: filters.height.min })}
                    className={errors.height?.max ? classes.Error : ""}
                  />
                </label>
                <label>
                  <span>Max: </span>
                  <input
                    {...(register("height.max"),
                    { defaultValue: filters.height.max })}
                    className={errors.height?.max ? classes.Error : ""}
                  />
                </label>
              </div>
            </div>
            <button
              onClick={handleSubmit(onSubmit)}
              className={`${classes.Filter__submit}`}
            >
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
