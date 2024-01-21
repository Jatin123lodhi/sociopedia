import { PaletteMode } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  picturePath: string;
  friends: (Friends | string)[];
  location: string;
  occupation: string;
  viewedProfile: number;
  impressions: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Like {
  [userId: string]: boolean;
}

export interface Post {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  location: string;
  description: string;
  picturePath?: string;
  userPicturePath: string;
  likes: Like;
  comments: unknown[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Friends{
  _id: string
  firstName: string
  lastName: string
  occupation: string
  location: string
  picturePath: string
}

export interface IAppState {
  mode: PaletteMode;
  user: null | User;
  token: null | string;
  posts: Post[];
  friends: Friends[]| null
}

const initialState: IAppState = {
  friends: null,
  mode: "dark",
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.friends = null;
      state.posts = [];
    },
    setLoggedInUserFriends:(state,action)=>{
      if(state.user){
        state.user.friends = action.payload.friends;
      }
    },
    setFriends: (state, action) => {
      if (action.payload.friends) {
        state.friends = action.payload.friends;
      } else {
        console.error("user friends non-existend :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    deletePost: (state,action)=>{
      const restPosts = state.posts.filter(post=> post._id!==action.payload.postId);
      state.posts = restPosts;
    },
  
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost,deletePost,setLoggedInUserFriends  } =
  authSlice.actions;
export default authSlice.reducer;
