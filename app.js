// Imports

import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { hopsList } from "./hopsList.js";

// User profile info

let userName = "";
let userHops = 0;
let userLikes = 0;

// Other page variables

let hopsDisplay = "Your Hops";
let yourHopsArr = [];
let likedHopsArr = [];
let seenHopsArr = [];

// Gathered page elements

const startScreen = document.querySelector(".start-screen");
const hoppingFullscreen = document.querySelector(".hopping-fullscreen");
const mainScreen = document.querySelector(".main-screen");
const displayBtns = document.querySelectorAll(".display-btn");
const profileSect = document.querySelector(".prof-sect");
const contentContainer = document.querySelector(".content-cont");
const usernameForm = document.querySelector(".username-form");

// Code

usernameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const usernameFormData = new FormData(usernameForm);
  userName = usernameFormData.get("username");
  startScreen.style.display = "none";
  refresh();
  mainScreen.style.display = "flex";
  createDocumentListener();
});

function createDocumentListener() {
  document.addEventListener("click", (e) => {
    e.preventDefault();
    if (
      e.target.id === "your-hops-btn" ||
      e.target.id === "liked-hops-btn" ||
      e.target.id === "seen-hops-btn"
    ) {
      handleDisplay(e);
    } else if (e.target.dataset.like) {
      handleLike(e.target.dataset.like);
      if (e.target.id === "hoppinglike-btn") {
        refreshHopping();
      }
    } else if (e.target.id === "post-btn") {
      handlePostHop();
    } else if (e.target.id === "hopping-btn" && !isHopping) {
      startHopping();
    } else if (e.target.id === "nexthop-btn") {
      let isSeenCount = hopsList.filter((hop) => {
        return !hop.isSeen && hop.name !== userName;
      });
      if (isSeenCount.length) {
        displayedHop = newCurrentHop();
        refreshHopping();
      } else {
        noMoreHops = true;
        refreshHopping();
      }
    }
  });
}

let displayedHop;
let timer = 15;
let isHopping = false;
let noMoreHops = false;

function startHopping() {
  isHopping = true;
  displayedHop = newCurrentHop();
  hoppingFullscreen.style.display = "block";

  const activeTimer = setInterval(() => {
    timer--;
    refreshHopping();
  }, 1000);

  const openTimer = setTimeout(
    () => {
      stopHopping();
    },
    !noMoreHops ? parseInt(`${timer}000`) : 3000
  );

  function stopHopping() {
    isHopping = false;
    clearInterval(activeTimer);
    timer = 15;
    hoppingFullscreen.style.display = "none";
  }

  refreshHopping();
}
function newCurrentHop() {
  let currentHop;
  const unseenHops = hopsList.filter((hop) => {
    return !hop.isSeen && hop.name !== userName;
  });
  if (unseenHops.length) {
    currentHop = unseenHops[Math.floor(Math.random() * unseenHops.length)];
    currentHop.isSeen = true;
    return currentHop;
  }
}
function getHoppingCont() {
  let likedClass = "";
  if (displayedHop.isLiked) {
    likedClass = "liked";
  } else {
    likedClass = "";
  }

  return `
    <div class="hopping-cont">
      <div class="prof-timer">
        <div class="prof">
          <img src="./images/prof-pic.png" alt="" />
          <h2>@${displayedHop.name}</h2>
        </div>
        <p id="timer">${timer}</p>
      </div>
      <div class="hop-text">
        <h3>${displayedHop.text}</h3>
      </div>
      <div class="interact-btns">
        <i class="fa-solid fa-heart ${likedClass}" id="hoppinglike-btn" data-like="${displayedHop.uuid}"></i>
        <i class="fa-solid fa-arrow-right" id="nexthop-btn"></i>
      </div>
    </div>
  `;
}
function noHoppingCont() {
  return `
    <div class="hopping-cont">
      <div class="no-content">
        <h2>There are no more hops to view.</h2>
      </div>
    </div>
  `;
}
function refreshHopping() {
  if (!noMoreHops) {
    hoppingFullscreen.innerHTML = getHoppingCont();
  } else {
    hoppingFullscreen.innerHTML = noHoppingCont();
  }
}

function handlePostHop() {
  const postInput = document.querySelector("#post");

  if (postInput.value && postInput.value.replace(/\s/g, "").length) {
    hopsList.unshift({
      name: userName,
      text: postInput.value,
      likes: 0,
      isLiked: false,
      isSeen: false,
      uuid: uuidv4(),
    });
    userHops++;
    postInput.value = "";
    refresh();
  }
}

let likeTimer = setInterval(() => {
  yourHopsArr.forEach((hop) => {
    hop.likes += Math.floor(Math.random() * 4);
    refresh();
  });
}, 3000);

function handleLike(hopId) {
  const targetHop = hopsList.filter((hop) => {
    return hop.uuid === hopId;
  })[0];

  if (targetHop.isLiked) {
    targetHop.likes--;
  } else {
    targetHop.likes++;
  }
  targetHop.isLiked = !targetHop.isLiked;
  refresh();
}

function handleDisplay(event) {
  if (event.target.id === "your-hops-btn") {
    hopsDisplay = "Your Hops";
    for (let button of displayBtns) {
      button.classList.remove("current-display");
    }
    event.target.classList.add("current-display");
  } else if (event.target.id === "liked-hops-btn") {
    hopsDisplay = "Liked Hops";
    for (let button of displayBtns) {
      button.classList.remove("current-display");
    }
    event.target.classList.add("current-display");
  } else if (event.target.id === "seen-hops-btn") {
    hopsDisplay = "Seen Hops";
    for (let button of displayBtns) {
      button.classList.remove("current-display");
    }
    event.target.classList.add("current-display");
  }
  refresh();
}

function loadArrays() {
  if (hopsDisplay === "Your Hops") {
    const currentUserHops = hopsList.filter((hop) => {
      return hop.name === userName;
    });

    yourHopsArr = currentUserHops;
  } else if (hopsDisplay === "Liked Hops") {
    const currentLikedHops = hopsList.filter((hop) => {
      return hop.isLiked;
    });

    likedHopsArr = currentLikedHops;
  } else if (hopsDisplay === "Seen Hops") {
    const currentSeenHops = hopsList.filter((hop) => {
      return hop.isSeen;
    });

    seenHopsArr = currentSeenHops;
  }
}

function getProfHtml() {
  return `
    <img src="./images/prof-pic.png" alt="" />
    <h2>@${userName}</h2>
    <div class="holders">
      <div>
        <i class="fa-solid fa-frog"></i>
        <p>${userHops}</p>
      </div>
      <div>
        <i class="fa-solid fa-heart"></i>
        <p>${userLikes}</p>
      </div>
    </div>
  `;
}

function getUserLikes() {
  let allLikes = 0;
  yourHopsArr.forEach((hop) => {
    allLikes += hop.likes;
  });
  return allLikes;
}

function getContentHtml(displayArr) {
  let contentHtml = "";

  displayArr.forEach((post) => {
    let likedClass = "";

    if (post.isLiked) {
      likedClass = "liked";
    }

    contentHtml += `
        <div class="post">
            <div class="post-content">
                <div class="prof-info">
                    <img src="./images/prof-pic.png" alt="" />
                    <h2>@${post.name}</h2>
                </div>
                <div class="post-text">
                    <h3>${post.text}</h3>
                </div>
            </div>
            <div class="post-data">
                <i class="fa-solid fa-heart ${likedClass}" data-like="${post.uuid}"></i>
                <p>${post.likes}</p>
            </div>
        </div>
    `;
  });
  return contentHtml;
}

function refresh() {
  userLikes = getUserLikes();
  profileSect.innerHTML = getProfHtml();
  if (hopsDisplay === "Your Hops") {
    loadArrays();
    contentContainer.innerHTML = getContentHtml(yourHopsArr);
  } else if (hopsDisplay === "Liked Hops") {
    loadArrays();
    contentContainer.innerHTML = getContentHtml(likedHopsArr);
  } else if (hopsDisplay === "Seen Hops") {
    loadArrays();
    contentContainer.innerHTML = getContentHtml(seenHopsArr);
  }
}
