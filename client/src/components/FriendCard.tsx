import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IAppState, setFriends, setLoggedInUserFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { BASE_URL } from "utils";

interface IFriendCardProps {
  friendId: string;
  name: string;
  subtitle: string;
  userPicturePath: string;
}
const FriendCard = ({
  friendId,
  name,
  subtitle,
  userPicturePath,
}: IFriendCardProps) => {
  //hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { palette } = useTheme();

  const token = useSelector((state: IAppState) => state.token);
  const user = useSelector((state: IAppState) => state.user);
  const friends = useSelector((state:IAppState)=>state.friends)
  if(!user) return <>Loading...</>;
  const {
    _id: loggedInUserId,
    firstName,
    lastName,
    // friends,
  } = user;

  
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends ? friends.find((value) => {
    if (typeof value === "object") {
      return value._id === friendId;
    } else {
      return value === friendId;
    }
  }) : false

  //functions
  const patchFriend = async () => {
    const response = await fetch(
      `${BASE_URL}/users/${loggedInUserId}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    
    dispatch(setLoggedInUserFriends({friends:data}))
    dispatch(setFriends({ friends: data }));
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {name !== `${firstName} ${lastName}` ? ( // dont show icons in case of current user
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      ) : (
        <></>
      )}
    </FlexBetween>
  );
};

export default FriendCard;
