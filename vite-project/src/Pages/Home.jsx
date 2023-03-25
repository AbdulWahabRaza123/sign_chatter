import React, { useState, useRef, useCallback, useEffect } from "react";
import DrawerComp from "../../components/Drawer";
import { Container, Row, Col, Image } from "../../components/Layout";
import TextField from "@mui/material/TextField";
import { Wrapper, H1, P } from "../../components/Typography";
import Logo from "../assets/logo.png";
import ToggleBtn from "../../components/ToggleBtn";
import SearchIcon from "@mui/icons-material/Search";
import Webcam from "react-webcam";
import styled from "styled-components";
import axios from "axios";
import jsonp from "jsonp";
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
const RedDot = styled.div`
  background: red;
  border-radius: 37%;
  height: 16px;
  width: 16px;
`;
const RedDotOpen = styled.div`
  background: red;
  border-radius: 50%;
  height: 12px;
  width: 12px;
`;
const Home = () => {
  const [page, setPage] = useState(0);
  const [camera, setCamera] = useState(false);
  const [translation, setTranslation] = useState("");
  const [counter, setCounter] = useState(-1);
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
    try {
      setCapturing(() => {
        return true;
      });
      
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm",
      });
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
      
    } catch (e) {
      console.log("Error found ", e);
    }
  }, [
    webcamRef,
    setCapturing,
    mediaRecorderRef,
    handleDataAvailable,
    capturing,
  ]);

  const handleStopCaptureClick = useCallback(() => {
    try {
      mediaRecorderRef.current.stop();
      setCapturing(false);
      
    } catch (e) {
      console.log("This is error ", e);
    }
  }, [mediaRecorderRef, setCapturing]);

  //to download video
  const SendData = useCallback(async () => {
    if (recordedChunks.length) {
      setTranslation("Loading...");
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
        const formData = new FormData();
        formData.append("file",blob,"filename");
        const url="http://109.205.182.203:5420/";
        const boundary = `----${new Date().getTime()}`;
         axios
          .post(url, formData, {
            headers: {
              "Content-Type":`multipart/form-data; boundary=${boundary}`,
            },
          }).then((res)=>{
            if(res.statusText=="OK"){
              setTranslation(res.data.Prediction);
            }
            else{
              setTranslation("Error, TryAgain!!!");
            }
          }).catch((e)=>{
            setTranslation("Error, TryAgain!!!");
          });
      
      setRecordedChunks([]);
    } else {
      alert("Try Again!!!");
    }
  }, [recordedChunks]);
  useEffect(() => {
    // counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    if (counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000);
    } else if (counter == 0) {
      setCounter(-1);
      handleStopCaptureClick();
      SendData();
    }
  }, [counter]);
 
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
                    mirrored={true}
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
                  {!camera ? (
                    <button
                      className="btn btn-danger ms-3"
                      onClick={() => {
                        setCamera(true);
                      }}
                    >
                      open Camera !
                    </button>
                  ) : capturing === true && camera === true ? (
                    <ButtonStyle
                      variant="outlined"
                      color="error"
                      className="d-flex flex-row justify-content-center align-items-center"
                    >
                      <P size="20px" color="red" weight="500" className="mb-0">
                        {counter}
                      </P>
                      {/* <RedDot /> */}
                    </ButtonStyle>
                  ) :(
                    <ButtonStyle
                      variant="outlined"
                      color="error"
                      onClick={() => {                       
                        setCounter(5);
                        handleStartCaptureClick();
                        
                      }}
                    >
                      <RedDotOpen />
                    </ButtonStyle>
                  )}
                </Wrapper>
                {camera ? (
                  <Wrapper
                    className="d-flex flex-row justify-content-end"
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "10px",
                    }}
                  >
                    <P
                      color="red"
                      style={{
                        borderBottom: "1px solid red",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setCamera(false);
                        setTranslation("");
                      }}
                    >
                      Close Camera
                    </P>
                  </Wrapper>
                ) : null}
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
