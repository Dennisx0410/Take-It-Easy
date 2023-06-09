import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
/**
 * This is verification related component 
 * Components
 * @name Search
 * @description  the shape and color of the search bar is defined here  
 * @name SearchBar
 * @description  return a SearchBar to the main interface of customer 
 * @name SearchIconWrapper
 * @description stling of the search icon from mui
 * @name StyledInputBase
 * @description return a styled input area for SearchBar
 */
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.warning.light, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.warning.light, 0.25),
  },
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(5)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  width: "100%",
}));

export default function SearchBar(props) {
  return (
    <main className="container-fluid">
      <div className="row mb-2">
        <div className="col-1"></div>
        <div className="col-10">
          <Search>
            <SearchIconWrapper>
              <SearchIcon style={{ color: "#8a055e" }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => {
                props.setSearchQ(e.target.value);
                props.setRErender(true);
              }}
            />
          </Search>
        </div>
        <div className="col-1"></div>
      </div>
    </main>
  );
}
