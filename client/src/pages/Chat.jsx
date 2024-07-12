import AppLayout from "../components/layout/AppLayout";
import { sampleMessage } from "../constants/sampleData";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IconButton, Skeleton, Stack } from "@mui/material";
import { grayColor, orange } from "../constants/color";
import MessageComponent from "../components/shared/MessageComponent";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponents";
import FileMenu from "../components/dialogs/FileMenu.jsx";

const Chat = ({ chatId, user }) => {
  // console.log(user);
  const allMessages = sampleMessage;

  const submitHandler = () => {};

  const handleFileOpen = () => {};

  const messageOnChange = () => {};

  return (
    <>
      <Stack
        // ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}

        {/* {userTyping && <TypingLoader />} */}

        {/* <div ref={bottomRef} /> */}
      </Stack>

      <form
        style={{
          height: "10%",
        }}
        onSubmit={submitHandler}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          alignItems={"center"}
          position={"relative"}
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "1.5rem",
              rotate: "30deg",
            }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox
            placeholder="Type Message Here..."
            // value={message}
            onChange={messageOnChange}
          />

          <IconButton
            type="submit"
            sx={{
              rotate: "-30deg",
              bgcolor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>

      {/* <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} /> */}
    </>
  );
};

export default AppLayout()(Chat);
