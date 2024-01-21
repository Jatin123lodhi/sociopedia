import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import {   useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "components/Navbar";
import FriendListWidget from "screens/widgets/FriendListWidget";
import MyPostWidget from "screens/widgets/Post/MyPostWidget";
import PostsWidget from "screens/widgets/Post/PostsWidget";
import UserWidget from "screens/widgets/UserWidget";
import { BASE_URL } from "utils";
import { IAppState  } from "state";

const ProfilePage = () => {
   
  const loggedInUser = useSelector((state: IAppState) => state.user);
  // const user = useSelector((state:IAppState)=> state.currentProfileUser);
  const [user, setUser] = useState(loggedInUser);

  const { userId  } = useParams();
  const token = useSelector((state: IAppState) => state.token);

  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getUser = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (loggedInUser && userId !== loggedInUser._id) getUser();
    else setUser(loggedInUser);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!loggedInUser || !user) return <>Loading...</>;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget user={user} picturePath={user?.picturePath || ""} />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId || ""} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {userId === loggedInUser._id && (
            <>
              <MyPostWidget picturePath={user?.picturePath || ""} />
              <Box m="2rem 0" />
            </>
          )}

          <PostsWidget userId={userId || ""} isProfilePage={true} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
