import React, { createContext, useEffect, useState } from "react";

export const Background = createContext(null);

export const Provider = (props) => {
  const [data, setData] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [test, setTest] = useState(null);
  const [sm, setSm] = useState(false);
  const [allUserPicture, setAllUserPicture] = useState([]);
  const [userName, setUserNames] = useState([]);
  const [rander, setRander] = useState(false);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const [profileFData, setProfileFData] = useState({});

  const x = window.matchMedia("(min-width:640px)");
  useEffect(() => {
    const getUser = async () => {
      // Make a request to your API here

      const response = await fetch("/user/AllUsers", {
        mathod: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonData = await response.json();
      // console.log(jsonData);
      const allPosts = jsonData.map((j) => j.imgAdd);
      setAllUserPicture(allPosts);
      const names = jsonData.map((user) => user.userName); // mapping is the method to the get array.....
      setUserNames(names);
    };
    getUser(); //userName?.filter((name)=>name.userName.includes('AD47'))
  }, []);

  useEffect(() => {
    const ffFetcher = async () => {
      try {
        const response = await fetch("/api/ffdata", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const ffData = await response.json();
        // console.log(ffData.following.map(following=>following.Following));

        setProfileFData((profileFData) => ({
          ...profileFData,
          following: ffData.following
            .map((following) => following.Following)
            .flat(),
          followers: ffData.followers
            .map((following) => following.followers)
            .flat(),
        }));
      } catch (error) {
        console.error("Error fetching follower data:", error);
      }
    };

    ffFetcher();
  }, [rander]);

  console.log(rander);

  useEffect(() => {
    async function fetchData() {
      const resposnse = await fetch("user/api", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const datas = await resposnse.json();
      setData(datas[0]);
      // console.log(data);
    }
    fetchData();
  }, [isProfileUpdated]);
  
  

  x.addEventListener("change", () => {
    if (x.matches) {
      // If media query matches
      setSm(true);
    } else {
      setSm(false);
    }
  });
  useEffect(() => {
    if (x.matches) {
      // If media query matches
      setSm(true);
    } else {
      setSm(false);
    }
  }, []);

  // for the Search list photo and UserNames
  useEffect(() => {
    const allUserSearchListData = async () => {
      const response = await fetch("user/SearchList/Data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log(response);

      const resluts = await response.json();
      // console.log(resluts);
      setSearchData(resluts);
    };
    allUserSearchListData();
  }, []);
  const [updatedFileToggle, setUpdatedFileToggle] = useState();
  return (
    <Background.Provider
      value={{
        sm,
        data,
        searchData,
        isProfileUpdated,
        setIsProfileUpdated,
        profileFData,
        allUserPicture,
        userName,
        rander,
        setRander,
      }}
    >
      {props.children}
    </Background.Provider>
  );
};
