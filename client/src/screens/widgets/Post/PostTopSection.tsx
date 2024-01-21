import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IAppState, deletePost, setFriends, setLoggedInUserFriends } from "state";
import FlexBetween from "../../../components/FlexBetween";
import UserImage from "../../../components/UserImage";
import { BASE_URL } from "utils";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

interface IPostTopSectionProps {
  postId:string,
  postUserId: string;
  name: string;
  subtitle: string;
  userPicturePath: string;
}
const PostTopSection = ({
  postId,
  postUserId,
  name,
  subtitle,
  userPicturePath,
}: IPostTopSectionProps) => {
  //hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: IAppState) => state.user);
  const token = useSelector((state: IAppState) => state.token);
  const friends = useSelector((state:IAppState)=> state.user?.friends)
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  if (!user) return <>Wating for user</>;
  const { _id: loggedInUserId, firstName, lastName } = user;
 
  const isFriend = friends ? friends.find(friend =>{
    if(typeof friend ==="string"){
      return friend===postUserId
    }else{
      return friend._id===postUserId
    }
  }):false
  
  
 
  //functions
  const patchFriend = async () => {
    try{
      const response = await fetch(
        `${BASE_URL}/users/${loggedInUserId}/${postUserId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if(Array.isArray(data)){
        dispatch(setLoggedInUserFriends({friends:data}))
        dispatch(setFriends({ friends: data }));
      }
    }catch(err){
      console.log(err)
    }
  };

  const handleDeletePost = async ()=>{
    try{
      const response = await fetch(
        `${BASE_URL}/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      const data = await response.json();
      console.log(data)
      if(data?.response?.deletedCount==1)
      dispatch(deletePost({postId:postId}))
    }catch(err){
      console.log(err)
    }
  }

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${postUserId}`);
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
        <IconButton onClick={()=>handleDeletePost()}>
          <DeleteOutlinedIcon />
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default PostTopSection;
