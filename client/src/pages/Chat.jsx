import AppLayout from "../components/layout/AppLayout";
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
import { getSocket } from "../socket.jsx";
import { NEW_MESSAGE } from "../../../server/constants/events.js";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api.js";
import { useErrors, useSocketEvents } from "../hooks/hook.jsx";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsFileMenu } from "../redux/reducers/misc.js";
import { removeNewMessagesAlert } from "../redux/reducers/chat.js";

const Chat = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const socket = getSocket();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const members = chatDetails?.data?.chat?.members;

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    //Emitting messages to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    // socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      // socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  const messageOnChange = (e) => {
    setMessage((prev) => (prev = e.target.value));
  };

  const newMessagesHandler = useCallback(
    (data) => {
      if (data?.chatId !== chatId) return;

      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const eventHandlers = { [NEW_MESSAGE]: newMessagesHandler };

  useSocketEvents(socket, eventHandlers);

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <>
      <Stack
        ref={containerRef}
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
        {allMessages?.map((i) => (
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
            value={message}
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

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </>
  );
};

export default AppLayout()(Chat);
