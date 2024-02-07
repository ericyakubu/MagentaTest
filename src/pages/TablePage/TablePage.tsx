import { FunctionComponent } from "react";
import classes from "./TablePage.module.scss";
import { Filter, Pagination, Table } from "../../components";

const TablePage: FunctionComponent = () => {
  return (
    <main className={classes.TablePage}>
      <Filter />
      <Table />
      <Pagination />
    </main>
  );
};

export default TablePage;
