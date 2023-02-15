import React, { useState, useRef, useCallback } from "react";
import DrawerComp from "../../components/Drawer";
import { Container, Row, Col, Image } from "../../components/Layout";
import TextField from "@mui/material/TextField";
import { Wrapper, H1 } from "../../components/Typography";
import Logo from "../assets/logo.png";
import ToggleBtn from "../../components/ToggleBtn";
import SearchIcon from "@mui/icons-material/Search";
import Webcam from "react-webcam";
import styled from "styled-components";
import {
  videoConstraints,
  BackgroundCamera,
  BackgroundTranslation,
  ButtonStyle,
} from "../../components/Style";
const SearchButton = styled.div`
  background: #fd7e14;
  height: 55px;
  border: 1px solid black;
`;
const Home = () => {
  const [page, setPage] = useState(0);
  const [camera, setCamera] = useState(false);
  const [translation, setTranslation] = useState("This is Translation...");
  const RedDot = styled.div`
    background: red;
    border-radius: ${camera ? "37%" : "50%"};
    height: ${camera ? "16px" : "12px"};
    width: ${camera ? "16px" : "12px"};
  `;
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  //containing video
  const [recordedChunks, setRecordedChunks] = useState([]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  //to download video
  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);
  return (
    <>
      <Container>
        <Wrapper
          className="d-flex flex-row align-items-center justify-content-between mt-5"
          style={{ marginRight: "1.7%" }}
        >
          <DrawerComp page={page} setPage={setPage} />
          <Image
            className="img-fluid"
            src={Logo}
            alt="Logo"
            width="100px"
            height="100px"
          />
          <div className="me-5" />
        </Wrapper>
        <Wrapper className="d-flex flex-row align-items-center justify-content-center mt-3 mb-5">
          <ToggleBtn page={page} setPage={setPage} />
        </Wrapper>
        {page === 0 ? (
          <>
            <Wrapper className="d-flex flex-row justify-content-center mb-3">
              <BackgroundCamera>
                {camera ? (
                  <Webcam
                    imageSmoothing={true}
                    ref={webcamRef}
                    audio={false}
                    mirrored={false}
                    videoConstraints={videoConstraints}
                    width={720}
                    height={400}
                  />
                ) : null}
                <Wrapper
                  className="d-flex flex-row justify-content-center"
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    left: 0,
                    right: 0,
                  }}
                >
                  <ButtonStyle
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setCamera(!camera);
                    }}
                  >
                    <RedDot />
                  </ButtonStyle>
                </Wrapper>
              </BackgroundCamera>
            </Wrapper>

            <Wrapper className="d-flex flex-row justify-content-center mb-5 ">
              <BackgroundTranslation>{translation}</BackgroundTranslation>
            </Wrapper>
          </>
        ) : null}
        {page === 1 ? (
          <>
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
          </>
        ) : null}
        {page === 2 ? (
          <>
            <Container
              style={{
                marginLeft: "100px",
                marginRight: "100px",
              }}
            >
              <Wrapper className="mt-5">This is About...</Wrapper>
            </Container>
          </>
        ) : null}
      </Container>
    </>
  );
};

export default Home;
