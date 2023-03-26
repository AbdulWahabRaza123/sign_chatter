import React, { useState, useRef, useCallback, useEffect } from "react";
import DrawerComp from "../../components/Drawer";
import { Container,Image } from "../../components/Layout";
import { Wrapper, P } from "../../components/Typography";
import {Spacer} from "../../components/Spacer";
import Logo from "../assets/logo.png";
import Webcam from "react-webcam";
import axios from "axios";
import {
  videoConstraints,
  BackgroundCamera,
  BackgroundTranslation,
  ButtonStyle,
  RedDotOpen,
  SearchButton
} from "../../components/Style";

const Home = (props) => {
 
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
    if (counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000);
    } else if (counter == 0) {
      handleStopCaptureClick();
      setCounter(-1);
      SendData();
    }
  }, [counter]);
 
  return (
    <>
      <Container>
        <Spacer height="30px"/>
        {props.page === 0 ? (
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
                      turn on!
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
                        handleStartCaptureClick();
                        setTranslation("");                     
                        setCounter(5);
                       
                        
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
                      close
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
        {props.page === 1 ? (
          <>
           
          </>
        ) : null}
      </Container>
    </>
  );
};

export default Home;
