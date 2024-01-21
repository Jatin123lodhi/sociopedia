import { Box, Typography, useTheme } from "@mui/material";
import FriendCard from "../../components/FriendCard";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IAppState, setFriends } from "../../state";

import { BASE_URL } from "../../utils";

const FriendListWidget = ({ userId }:{userId:string}) => {
  const dispatch = useDispatch();
  const friends = useSelector((state:IAppState) => state.friends);
  
  const { palette } = useTheme();
  const token = useSelector((state:IAppState) => state.token);

  const getFriends = async () => {
    try{
      const response = await fetch(`${BASE_URL}/users/${userId}/friends`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      
      dispatch(setFriends({ friends: data }));
    }catch(err){
      console.log(err)
    }
   
  };

  useEffect(() => {
    getFriends();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends && friends.map((friend) => (
          <FriendCard
            key={friend._id}
            friendId={friend._id || ""}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation || ""}
            userPicturePath={friend.picturePath || ""}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
