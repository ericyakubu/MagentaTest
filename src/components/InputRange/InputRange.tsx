import React, { ChangeEvent } from "react";
import classes from "./InputRange.module.scss";

interface InputRangeProps {
  label: string;
  valueMin: number;
  valueMax: number;
  min: number;
  max: number;
  onChangeMin: (value: number) => void;
  onChangeMax: (value: number) => void;
  errorMin: boolean;
  errorMax: boolean;
}

const InputRange: React.FC<InputRangeProps> = ({
  label,
  valueMin,
  valueMax,
  min,
  max,
  onChangeMin,
  onChangeMax,
  errorMin,
  errorMax,
}) => {
  return (
    <div className={classes.Filter__opt}>
      <p>{label}</p>
      <div className={classes.Filter__opt_inputs}>
        <label>
          <span>Min: {min}</span>
          <input
            value={valueMin}
            type="number"
            min={min}
            max={max}
            className={errorMin ? classes.Error : ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChangeMin(+e.target.value)
            }
          />
        </label>
        <label>
          <span>Max: {max}</span>
          <input
            value={valueMax}
            type="number"
            min={min}
            max={max}
            className={errorMax ? classes.Error : ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChangeMax(+e.target.value)
            }
          />
        </label>
      </div>
    </div>
  );
};

export default InputRange;
