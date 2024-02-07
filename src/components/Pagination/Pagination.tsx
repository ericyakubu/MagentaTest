import { ChangeEvent, FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux";
import { useQuery } from "react-query";
import axios from "axios";
import { getMorePeople, setPage } from "../../redux/peopleSlice";
import MuiPagination from "@mui/material/Pagination";
import { setFilters } from "../../redux/filterSlice";

const Pagination: FunctionComponent = () => {
  const { currentPage, pages } = useSelector(
    (state: RootState) => state.people
  );
  const dispatch = useDispatch<AppDispatch>();

  const { data, refetch } = useQuery({
    queryKey: ["getMorePeople", currentPage],
    queryFn: () =>
      axios
        .get(`https://swapi.dev/api/people/?page=${currentPage}`)
        .then((res) => res.data),
  });

  const handlePageChange = (_e: ChangeEvent<unknown>, page: number) => {
    dispatch(setPage(page));
  };

  useEffect(() => {
    if (!data) return;
    refetch();

    dispatch(setFilters(data.results));
    dispatch(getMorePeople(data.results));
  }, [currentPage, data]);

  return (
    <section>
      <MuiPagination
        count={pages}
        variant="outlined"
        shape="rounded"
        onChange={handlePageChange}
        sx={{
          "& .MuiPaginationItem-root": {
            backgroundColor: "#f6f6f6",
            boxShadow: "0px 0px 12px 0px rgba(0, 0, 0, 0.25)",
            "&.Mui-selected": {
              backgroundColor: "#362f4b",
              color: "white",
            },
            "&.MuiPaginationItem-ellipsis": {
              backgroundColor: "transparent",
              color: "white",
              fontSize: "20px",
              boxShadow: "none",
            },
          },
        }}
      />
    </section>
  );
};

export default Pagination;
