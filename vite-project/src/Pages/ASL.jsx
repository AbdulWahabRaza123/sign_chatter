import React from "react";
import { Wrapper,P } from "../../components/Typography";
import TextField from "@mui/material/TextField";
import { Container} from "../../components/Layout";
import SearchIcon from "@mui/icons-material/Search";
import { Spacer } from "../../components/Spacer";
import { SearchButton } from "../../components/Style";
const ASL = (props) => {
  return (
    <>
    <Container>
    <Spacer height="30px"/>
      <Wrapper className="d-flex flex-row justify-content-center">
        <TextField
          id="outlined-basic"
          label="ASL Dictionary"
          variant="outlined"
          value={""}
          sx={{
            width: "400px",
            color: "black",
          }}
        />
        <SearchButton>
          <SearchIcon
            className="ms-2 me-1 mt-1"
            style={{
              width: "50px",
              height: "50px",
              color: "black",
              cursor: "pointer",
            }}
          />
        </SearchButton>
      </Wrapper>
      <Container
        style={{
          marginLeft: "100px",
          marginRight: "100px",
        }}
      >
        <Wrapper className="mt-5">This is Data...</Wrapper>
      </Container>
      </Container>
    </>
  );
};

export default ASL;
