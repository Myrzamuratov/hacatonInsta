// !Для красоты
// !1
const searchItem = document.querySelector(".search-item");
const searchInput = document.querySelector(".search-input");

searchItem.addEventListener("click", () => {
  searchInput.style.display = "block";
});

searchInput.addEventListener("mouseout", () => {
  searchInput.value = "";
  searchInput.style.display = "none";
  render();
});
// !2

// const image1 = document.querySelector("#navbar_image1");
// const h21 = document.querySelector("#navbar_desc1");
// image1.addEventListener("mouseover", () => {
//   h21.style.display = "block";
// });
// image1.addEventListener("mouseout", () => {
//   h21.style.display = "none";
// });

// const image2 = document.querySelector("#navbar_image2");
// const h22 = document.querySelector("#navbar_desc2");
// image2.addEventListener("mouseover", () => {
//   h22.style.display = "block";
// });
// image2.addEventListener("mouseout", () => {
//   h22.style.display = "none";
// });

// const image3 = document.querySelector("#navbar_image3");
// const h23 = document.querySelector("#navbar_desc3");
// image3.addEventListener("mouseover", () => {
//   h23.style.display = "block";
// });
// image3.addEventListener("mouseout", () => {
//   h23.style.display = "none";
// });

// const image4 = document.querySelector("#navbar_image4");
// const h24 = document.querySelector("#navbar_desc4");
// image4.addEventListener("mouseover", () => {
//   h24.style.display = "block";
// });
// image4.addEventListener("mouseout", () => {
//   h24.style.display = "none";
// });

// const image5 = document.querySelector("#navbar_image5");
// const h25 = document.querySelector("#navbar_desc5");
// image5.addEventListener("mouseover", () => {
//   h25.style.display = "block";
// });
// image5.addEventListener("mouseout", () => {
//   h25.style.display = "none";
// });
// !

const API = "http://localhost:8000/post";

let inputNameProfile = document.querySelector(".input-name-profile");
let inputPhotoProfile = document.querySelector(".input-photo-profile");
let inputPhotoPost = document.querySelector(".input-photo-post");
let inputDescPost = document.querySelector(".input-desc-post");
let add = document.querySelector("#add");
let btnAdd = document.querySelector(".btn-add");
let btnCancel = document.querySelector(".btn-cancel");

//search
let searchVal = "";
let seacrhInp = document.querySelector(".search-input");
// search

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
  };

  createProduct(newPost);
  modal.style.cssText = "display: none;";
  render();
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
// !pagination start
let currentPage = 1;
let perPage = 3; // Количество элементов на одной странице
let pageTotalCount = 1;
let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

// Функция для отображения кнопок пагинации
function drawPaginationButtons() {
  paginationList.innerHTML = "";

  for (let i = 1; i <= pageTotalCount; i++) {
    let pageButton = document.createElement("li");
    pageButton.classList.add("page-item");
    if (i === currentPage) {
      pageButton.classList.add("active");
    }
    pageButton.innerHTML = `<a class="page-link page-number" href="#" data-page="${i}">${i}</a>`;
    paginationList.appendChild(pageButton);
  }

  prev.disabled = currentPage === 1;
  next.disabled = currentPage === pageTotalCount;

  // Обработка нажатия на цифры страниц
  let pageNumbers = document.querySelectorAll(".page-number");
  pageNumbers.forEach((pageNumber) => {
    pageNumber.addEventListener("click", () => {
      let selectedPage = parseInt(pageNumber.dataset.page);
      if (selectedPage !== currentPage) {
        currentPage = selectedPage;
        render();
      }
    });
  });
}

// Обработчик нажатия на кнопку предыдущей страницы
prev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    render();
  }
});

// Обработчик нажатия на кнопку следующей страницы
next.addEventListener("click", () => {
  if (currentPage < pageTotalCount) {
    currentPage++;
    render();
  }
});

let postList = document.querySelector(".post-list");

// Функция для загрузки и отображения данных
async function render() {
  let post = await fetch(`${API}?q=${searchVal}`).then((res) => res.json());
  const response = await fetch(`${API}?q=${searchVal}`);
  const data = await response.json();

  // Сортировка по новизне
  data.sort((a, b) => b.timestamp - a.timestamp);

  // Вычисление общего количества страниц
  pageTotalCount = Math.ceil(data.length / perPage);

  // Определение начального и конечного индексов для текущей страницы
  let startIndex = (currentPage - 1) * perPage;
  let endIndex = startIndex + perPage;

  // Очистка контейнера с фотографиями
  postList.innerHTML = "";

  // Отображение фотографий на текущей странице
  for (let i = startIndex; i < endIndex && i < data.length; i++) {
    let item = data[i];
    if (item.saved == "done") {
      postList.innerHTML += `<div class="card-list">
      <div class="card">
        <div class="card-content">
          <div class="profile">
            <img src="${item.profileI}" class="profile-photo" onerror="handleImageError()" alt="Profile Image" alt="Profile Photo">
            <h3 class="${item.profileN}">${item.profileN}</h3>
            <button onclick="savePost(${item.id})" class="btn-save-pub">Удалить из сохраненных</button>
  
          </div>
          <p class="post-description">${item.descP}</p>
          <img src="${item.photoP}" class="post-photo" alt="Post Photo">
          <div class="card-buttons">
          <button onclick="likeProduct(${item.id})" class="like">
          <img class="button-images" src="../image/social-network.png" alt="">
          <p>Нравится ${item.like}</p>
        </button>
        
        <button onclick="disLikeProduct(${item.id})" class="disLike">
          <img class="button-images" src="../image/hand.png" alt="">
        </button>
        
        <button onclick="commentFunc(${item.id})" class="comment">
          <img src="../image/comments.png" alt="">
        </button>
        
        <button onclick="editProduct(${item.id}); openEditModal();" class="btnEdit">
          <img class="button-images" src="../image/edit.png" alt="">
        </button> 
        
        <button onclick="deleteProduct(${item.id})" class="btn-delete">
          <img class="button-images" src="../image/trash.png" alt="">
        </button>
        
          
          
          </div>
        </div>
      </div>
    </div>`;
    }
  }

  drawPaginationButtons();
}

// Вызов функции render() для начальной загрузки данных
render();

async function deleteProduct(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  render();
}

seacrhInp.addEventListener("input", () => {
  searchVal = seacrhInp.value;
  render();
});

async function deleteProduct(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  render();
}
let modal = document.querySelector(".modal");
add.addEventListener("click", () => {
  modal.style.cssText = "display: block;";
});

async function savePost(id) {
  // Получаем объект из localStorage по ID
  let post = await fetch(`${API}/${id}`).then((res) => res.json());

  // Проверяем, существует ли объект и имеет ли свойство saved
  if (!post || !post.saved) {
    console.error(
      `Unable to save post with ID ${id}. Post may not exist or missing 'saved' property.`
    );
    return;
  }

  // Вносим необходимые изменения в объект
  post.saved = "none";

  // Обновляем объект в localStorage

  localStorage.setItem(id, JSON.stringify(post));

  // Отправляем запрос на сервер для обновления данных, если необходимо
  fetch(`${API}/${id}`, {
    method: "PUT",
    body: JSON.stringify(post),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Post updated successfully", data);
    })
    .catch((error) => {
      console.error("Error updating post", error);
    });

  // Перерендерим страницу после сохранения
  render();
}
const commentList = document.querySelector(".comment-elem");
const commentModal = document.querySelector(".modal-comments");
let commName = document.querySelector(".comment-input-name");
let commBody = document.querySelector(".comment-input-body");
let commentSave = document.querySelector(".comment-btn-save");
let commentClose = document.querySelector(".comment-btn-close");

async function commentFunc(id) {
  commentModal.style.display = "block";

  let comment = await fetch(`${API}/${id}`).then((res) => res.json());

  commentSave.addEventListener("click", () => {
    comment.user = commName.value;
    comment.comment = commBody.value;
    console.log(comment);
    fetch(`${API}/${id}`, {
      method: "PUT",
      body: JSON.stringify(comment),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Post updated successfully", data);
        // Добавление карточки комментария в список комментариев
        commentList.innerHTML += `
          <div id="comment-card">
            <h2 id="comment-name">${comment.user}</h2>
            <p id="comment-body">${comment.comment}</p>
          </div>
        `;
      })
      .catch((error) => {
        console.error("Error updating post", error);
      });
    commBody.value = "";
    commName.value = "";
  });
  commentList.innerHTML += `
          <div id="comment-card">
            <h2 id="comment-name">${comment.user}</h2>
            <p id="comment-body">${comment.comment}</p>
          </div>
        `;
}
commentClose.addEventListener("click", () => {
  commentModal.style.display = "none";
});

let inpEdit1 = document.querySelector("#editNameProfile");
let inpEdit2 = document.querySelector("#editPhotoProfile");
let inpEdit3 = document.querySelector("#editPhotoPost");
let inpEdit4 = document.querySelector("#editDescPost");
let modale = document.querySelector("#editModal");
let btnSave = document.querySelector("#editSave");
let btnCan = document.querySelector("#btn-cancel2");
async function editProduct(id) {
  // Получаем данные выбранного поста для редактирования
  let postToEdit = await fetch(`${API}/${id}`).then((res) => res.json());

  // Заполняем инпуты в модальном окне для редактирования
  inpEdit1.value = postToEdit.profileN;
  inpEdit2.value = postToEdit.profileI;
  inpEdit3.value = postToEdit.photoP;
  inpEdit4.value = postToEdit.descP;

  btnCan.addEventListener("click", () => {
    modale.style.display = "none";
    inpEdit1.value = "";
    inpEdit2.value = "";
    inpEdit3.value = "";
    inpEdit4.value = "";
  });

  // Навешиваем id на кнопку сохранения изменений
  btnSave.setAttribute("data-id", id);
}

// Слушатель событий на кнопку сохранения изменений
btnSave.addEventListener("click", async (e) => {
  // Получаем id, который был назначен выше
  let id = e.target.getAttribute("data-id");

  // Проверка на заполненность
  if (
    !inpEdit1.value.trim() ||
    !inpEdit2.value.trim() ||
    !inpEdit3.value.trim() ||
    !inpEdit4.value.trim()
  ) {
    alert("Заполните все поля");
    return;
  }

  // Собираем отредактированный пост
  let editedPost = {
    profileN: inpEdit1.value,
    profileI: inpEdit2.value,
    photoP: inpEdit3.value,
    descP: inpEdit4.value,
  };

  // Отправляем PATCH запрос для сохранения изменений на сервере
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(editedPost),
  });

  modale.style.display = "none";

  // Вызываем функцию render, чтобы увидеть отредактированный пост без перезагрузки страницы
  render();
});

function openEditModal() {
  let modale = document.querySelector("#editModal");
  modale.style.display = "block";
}

let likeBtn = document.querySelector(".like");

async function likeProduct(id) {
  // Получаем объект из localStorage по ID
  let like = await fetch(`${API}/${id}`).then((res) => res.json());

  // Проверяем, существует ли объект и имеет ли свойство saved
  if (!like || !like.saved) {
    console.error(
      `Unable to save post with ID ${id}. Post may not exist or missing 'saved' property.`
    );
    return;
  }

  // Вносим необходимые изменения в объект
  like.like++;

  // Обновляем объект в localStorage

  localStorage.setItem(id, JSON.stringify(like));

  // Отправляем запрос на сервер для обновления данных, если необходимо
  fetch(`${API}/${id}`, {
    method: "PUT",
    body: JSON.stringify(like),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Post updated successfully", data);
    })
    .catch((error) => {
      console.error("Error updating post", error);
    });

  // Перерендерим страницу после сохранения
  render();
}

// !Dislike
let dislike = document.querySelector(".disLike");

async function disLikeProduct(id) {
  // Получаем объект из localStorage по ID
  let like = await fetch(`${API}/${id}`).then((res) => res.json());

  // Проверяем, существует ли объект и имеет ли свойство saved
  if (!like || !like.saved) {
    console.error(
      `Unable to save post with ID ${id}. Post may not exist or missing 'saved' property.`
    );
    return;
  }

  // Вносим необходимые изменения в объект
  like.like--;

  // Обновляем объект в localStorage

  localStorage.setItem(id, JSON.stringify(like));

  // Отправляем запрос на сервер для обновления данных, если необходимо
  fetch(`${API}/${id}`, {
    method: "PUT",
    body: JSON.stringify(like),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Post updated successfully", data);
    })
    .catch((error) => {
      console.error("Error updating post", error);
    });

  // Перерендерим страницу после сохранения
  render();
}
