import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IAppState, setPosts } from "state";
import PostWidget from "./PostWidget";
import { BASE_URL } from "utils";
interface IPostsWidgetProps {
  userId: string;
  isProfilePage?: boolean;
}
const PostsWidget = (props: IPostsWidgetProps) => {
  const { userId, isProfilePage = false } = props;
  const dispatch = useDispatch();
  const posts = useSelector((state: IAppState) => state.posts);
  const token = useSelector((state: IAppState) => state.token);


  const getAllPosts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      dispatch(setPosts({ posts: data }));
    } catch (err) {
      console.log(err);
    }
  };
  const getPostsByUserId = async (userId:string)=>{
    try {
      const response = await fetch(`${BASE_URL}/posts/${userId}/posts`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      dispatch(setPosts({ posts: data }));
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (isProfilePage) {
      getPostsByUserId(userId);
    } else {
      getAllPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(()=>{
    getPostsByUserId(userId);
  },[userId])
   

  return (
    <div>
      
      {posts?.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath || ""}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </div>
  );
};

export default PostsWidget;
