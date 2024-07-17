import React from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Drawer, Grid, Skeleton } from "@mui/material";
import ChatList from "../specific/ChatList";
import { samepleChats } from "../../constants/sampleData";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile";

const AppLayout = () => (WrappedComponent) => {
  const handleDeleteChat = (e, chatId, groupChat) => {
    // dispatch(setIsDeleteMenu(true));
    // dispatch(setSelectedDeleteChat({ chatId, groupChat }));
    // deleteMenuAnchor.current = e.currentTarget;
  };

  return (props) => {
    const params = useParams();
    // const navigate = useNavigate();
    // const dispatch = useDispatch();
    // const socket = getSocket();

    const user = {
      name: "Chatless",
      _id: "sdfsdfsdf",
      createdAt: "Thu Jul 11 2024 18:52:38 GMT+0530 (India Standard Time)",
      username: "Lodiyu",
    };

    const chatId = params.chatId;
    const isLoading = false;
    return (
      <>
        <Title />
        <Header />

        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={samepleChats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                // newMessagesAlert={newMessagesAlert}
                // onlineUsers={onlineUsers}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>

          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
          >
            <Profile user={user} />
          </Grid>
        </Grid>
        {/* <div>Footer</div> */}
      </>
    );
  };
};

export default AppLayout;
