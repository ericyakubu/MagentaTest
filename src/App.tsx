import { FunctionComponent, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { TablePage, Welcome } from "./pages";
import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import axios from "axios";
import { AppDispatch } from "./redux";
import { setPeople } from "./redux/peopleSlice";
import { setFilters } from "./redux/filterSlice";

const App: FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      axios.get("https://swapi.dev/api/people/").then((res) => res.data),
  });

  useEffect(() => {
    if (!data) return;
    const pages = data.count;
    const currentPage = 1;
    const people = data.results;
    dispatch(setFilters(data.results));
    dispatch(setPeople({ pages, currentPage, people }));
  }, [data]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/welcome" />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/table" element={<TablePage />} />
      <Route path="*" element={<Navigate to="/welcome" />} />
    </Routes>
  );
};

export default App;
