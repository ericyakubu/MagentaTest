import { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import classes from "./Table.module.scss";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";
import { PeopleType } from "../../redux/peopleSlice";

const Table: FunctionComponent = () => {
  const { people } = useSelector((state: RootState) => state.people);
  const { filterBy } = useSelector((state: RootState) => state.filters);

  const [tablePeople, setTablePeople] = useState<PeopleType[]>(people);

  const columns = [
    { title: "Name", key: "name" },
    { title: "Birth year", key: "birth_year" },
    { title: "Gender", key: "gender" },
    { title: "Eye color", key: "eye_color" },
    { title: "Mass", key: "mass" },
    { title: "Height", key: "height" },
  ];

  const handleSort = (category: string, sort: string) => {
    const sorted = [...tablePeople];

    if (category === "name") {
      sorted.sort((a, b) => {
        if (sort === "up") {
          return a[category].toString().localeCompare(b[category].toString());
        } else if (sort === "down") {
          return b[category].toString().localeCompare(a[category].toString());
        }
        return 0;
      });
    } else if (category === "birth_year") {
      sorted.sort((a, b) => {
        if (isNaN(Number(a[category]))) return 1;
        if (isNaN(Number(b[category]))) return -1;
        if (sort === "up") {
          return Number(a[category]) - Number(b[category]);
        } else if (sort === "down") {
          return Number(b[category]) - Number(a[category]);
        }
        return 0;
      });
    } else {
      sorted.sort((a, b) => {
        if (isNaN(Number(a[category]))) return 1;
        if (isNaN(Number(b[category]))) return -1;
        if (sort === "up") {
          return Number(a[category]) - Number(b[category]);
        } else if (sort === "down") {
          return Number(b[category]) - Number(a[category]);
        }
        return 0;
      });
    }

    setTablePeople(sorted);
  };

  useEffect(() => {
    setTablePeople(people);
  }, [people]);

  useEffect(() => {
    if (!filterBy) return setTablePeople(people);

    const oldPeople = people;

    const filterPeople = (): PeopleType[] => {
      return oldPeople.filter((person) => {
        for (const key in filterBy) {
          if (Object.prototype.hasOwnProperty.call(filterBy, key)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const filterValue = (filterBy as any)[key];
            const personValue = person[key];
            if (!filterValue) return true;

            if (typeof filterValue === "object") {
              if (
                personValue < filterValue.min ||
                personValue > filterValue.max
              ) {
                return false;
              }
            } else {
              if (!filterValue) return true;
              if (personValue !== filterValue) return false;
            }
          }
        }
        return true;
      });
    };

    setTablePeople(filterPeople());
  }, [filterBy]);

  return (
    <section className={classes.container}>
      <table className={classes.Table}>
        <thead>
          <tr className={classes.Table__head}>
            {columns.map((column, i) => (
              <th key={`column ${i}`}>
                <div className={classes.Table__column}>
                  <p>{column.title}</p>
                  {column.key !== "eye_color" && column.key !== "gender" && (
                    <div className={classes.Table__column__btns}>
                      <button onClick={() => handleSort(column.key, "up")}>
                        <TiArrowSortedUp />
                      </button>
                      <button onClick={() => handleSort(column.key, "down")}>
                        <TiArrowSortedDown />
                      </button>
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={classes.Table__body}>
          {tablePeople.map((person) => (
            <tr className={classes.Table__person} key={person.name}>
              <td>{person.name}</td>
              <td>
                {person.birth_year !== "unknown"
                  ? `${person.birth_year} BBY`
                  : `—`}
              </td>
              <td>
                {person.gender
                  ? person.gender === "n/a"
                    ? "—"
                    : person.gender
                  : "—"}
              </td>
              <td>{person.eye_color !== "unknown" ? person.eye_color : "—"}</td>
              <td>
                {!person.mass ? (
                  "—"
                ) : (
                  <>
                    {person.mass}
                    <span>kg</span>
                  </>
                )}
              </td>
              <td>
                {!person.height ? (
                  "—"
                ) : (
                  <>
                    {person.height}
                    <span>cm</span>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Table;
