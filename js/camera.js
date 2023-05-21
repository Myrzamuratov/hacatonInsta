// Список фотографий
let photoList = [
  "../camera.img/1680693239_animals-pibig-info-p-selfi-obezyani-zhivotnie-instagram-52.jpg",
  "../camera.img/220px-Macaca_nigra_self-portrait_full_body.jpg",
  "../camera.img/images.jpg",
  "../camera.img/Macaca_nigra_self-portrait_large.jpg",
  // Добавьте здесь остальные пути к фотографиям
];

const randomPhoto = document.querySelector(".camera_img");
function getRandomPhoto() {
  const randomIndex = Math.floor(Math.random() * photoList.length);
  return photoList[randomIndex];
}

// Пример использования функции
const randomPhotoUrl = getRandomPhoto();

randomPhoto.innerHTML += `<img id="random-photo" src="${randomPhotoUrl}" alt="Random Photo" />`;

// ! Пост фотки
const API = "http://localhost:8000/post";
const modal = document.querySelector(".modal");
let inputNameProfile = document.querySelector(".input-name-profile");
let inputPhotoProfile = document.querySelector(".input-photo-profile");
let inputPhotoPost = document.querySelector(".input-photo-post");
let inputDescPost = document.querySelector(".input-desc-post");
let add = document.querySelector("#add");
let btnAdd = document.querySelector(".btn-add");
let btnCancel = document.querySelector(".btn-cancel");
let selfie = document.querySelector(".selfie");

selfie.addEventListener("click", () => {
  modal.style.display = "block";

  inputPhotoPost.value = randomPhotoUrl;
});

btnCancel.addEventListener("click", () => {
  modal.style.cssText = "display: none;";
  inputNameProfile.value = "";
  inputPhotoProfile.value = "";
  inputPhotoPost.value = "";
  inputDescPost.value = "";
});
btnAdd.addEventListener("click", () => {
  if (
    !inputNameProfile.value.trim() ||
    !inputPhotoProfile.value.trim() ||
    !inputPhotoPost.value.trim() ||
    !inputDescPost.value.trim()
  ) {
    alert("заполните инпуты");
    return;
  }

  let newPost = {
    profileN: inputNameProfile.value,
    profileI: inputPhotoProfile.value,
    photoP: inputPhotoPost.value,
    descP: inputDescPost.value,
    saved: "none",
    like: 0,
  };
  createProduct(newPost);
  modal.style.cssText = "display: none;";
  render();

  window.location.href =
    "file:///C:/Users/user/Desktop/INSTAGRAM/html/index.html";
});

async function createProduct(newPost) {
  try {
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(newPost),
    });
  } catch (error) {
    console.log(error);
  }
}
