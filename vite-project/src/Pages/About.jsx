import React from "react";
import { Container } from "../../components/Layout";
import { Wrapper } from "../../components/Typography";
const About = (props) => {
  return (
    <>
    <Container>
      <Container
        style={{
          marginLeft: "100px",
          marginRight: "100px",
        }}
      >
        <Wrapper className="mt-5">This is About...</Wrapper>
      </Container>
      </Container>
    </>
  );
};

export default About;
