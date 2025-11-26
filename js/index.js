// --- localStorage Keys ---
const BIRTHDAY_KEY = "dog-birthdate";
const DOGNAME_KEY = "dog-name";
const HUMANAGE_KEY = "human-age";
const PHOTO_KEY = "dog-photo-base64";

// --- 頁面載入：讀取 localStorage ---
window.addEventListener("DOMContentLoaded", () => {
  // 生日
  const savedBirth = localStorage.getItem(BIRTHDAY_KEY);
  if (savedBirth) {
    document.getElementById("birthDate").value = savedBirth;
  }

  // 名字
  const savedName = localStorage.getItem(DOGNAME_KEY);
  if (savedName) {
    document.getElementById("dogName").value = savedName;
  }

  // 人類年齡
  const savedHumanAge = localStorage.getItem(HUMANAGE_KEY);
  if (savedHumanAge) {
    document.getElementById("humanAge").value = savedHumanAge;
  }

  // 照片（Base64）
  const savedPhoto = localStorage.getItem(PHOTO_KEY);
  if (savedPhoto) {
    const preview = document.getElementById("photoPreview");
    const placeholder = document.getElementById("photoPlaceholder");

    preview.src = savedPhoto;
    preview.style.display = "block";
    placeholder.style.display = "none";

    // 結果區的圖片也預先放好
    document.getElementById("resultPhoto").src = savedPhoto;
  }
});

// --- 將照片轉成 Base64 並存到 localStorage ---
document.getElementById("photoInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  const errorInput = document.getElementById("fileSizeError");

  if (!file) return;

  // --- 檢查大小 > 200KB ---
  if (file.size > 204800) {
    errorInput.value = "⚠️ 圖片超過 200KB，請上傳較小的圖片！";
    errorInput.style.display = "block"; // 顯示錯誤

    // 清空預覽
    document.getElementById("photoPreview").style.display = "none";
    document.getElementById("photoPlaceholder").style.display = "block";

    // 清掉 localStorage 裡的舊照片
    localStorage.removeItem(PHOTO_KEY);

    // 清掉 input 的檔案
    e.target.value = "";
    return;
  }

  // --- 正常圖片：隱藏錯誤 ---
  errorInput.value = "";
  errorInput.style.display = "none";

  const preview = document.getElementById("photoPreview");
  const placeholder = document.getElementById("photoPlaceholder");

  // 預覽
  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";
  placeholder.style.display = "none";

  // base64 存 localStorage
  const reader = new FileReader();
  reader.onload = function () {
    localStorage.setItem(PHOTO_KEY, reader.result);
  };
  reader.readAsDataURL(file);
});

// --- 魔法粒子 ---
function magicEffect(btn) {
  for (let i = 0; i < 12; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");

    p.style.left = Math.random() * btn.offsetWidth + "px";
    p.style.top = "0px";

    btn.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

// --- BBC 計算 ---
document.getElementById("calcBtn").addEventListener("click", function () {
  magicEffect(this);

  const name = document.getElementById("dogName").value.trim();
  const birth = document.getElementById("birthDate").value;
  const humanAge = document.getElementById("humanAge").value;
  const today = new Date();

  // ❗ 先隱藏結果（避免上一輪的內容殘留）
  document.getElementById("result").style.display = "none";
  document.getElementById("resultContent").innerHTML = "";
  document.getElementById("compareText").innerHTML = "";
  document.getElementById("birthdayBanner").innerHTML = "";
  hideError();

  // ❗ 檢查必填：名字
  if (!name) {
    alert("請輸入狗狗名稱!");
    return;
  }

  // ❗ 檢查必填：生日
  if (!birth) {
    alert("請選擇狗狗生日!");
    return;
  }

  const birthDate = new Date(birth);

  // ❗ 檢查未來日期
  if (birthDate > today) {
    // 先隱藏結果（避免上一輪的內容殘留）
    document.getElementById("result").style.display = "block";
    document.getElementById("resultContent").innerHTML = "";
    document.getElementById("compareText").innerHTML = "";
    document.getElementById("birthdayBanner").innerHTML = "";
    showError("生日不能是未來的日期！");
    return; // ← 不做任何計算
  }

  // --- 儲存 name / birth / age ---
  localStorage.setItem(DOGNAME_KEY, name);
  localStorage.setItem(BIRTHDAY_KEY, birth);
  if (humanAge) localStorage.setItem(HUMANAGE_KEY, humanAge);

  hideError();

  // 轉換成狗齡
  const diffDays = (today - birthDate) / (1000 * 3600 * 24);
  const dogAge = diffDays / 365;

  // 💡 如果生日填錯（差異過小），dogAge 可能會是 NaN 或 Infinity
  if (!isFinite(dogAge) || dogAge < 0) {
    showError("日期輸入無效，請重新選擇生日！");
    return;
  }

  // BBC 換算
  const humanLikeAge = 16 * Math.log(dogAge) + 31;

  // --- 顯示結果區 ---
  document.getElementById("result").style.display = "block";

  // 標題
  document.getElementById(
    "resultTitleText"
  ).textContent = `📜${name}的魔法年齡報告`;

  // 內容
  document.getElementById("resultContent").innerHTML = `
    🐶 實際年齡：<b>${dogAge.toFixed(2)}</b> 歲<br>
    ✨ BBC 換算人類年齡：約 <b>${
      isFinite(humanLikeAge) ? humanLikeAge.toFixed(1) : "?"
    }</b> 歲<br><br>
    ${
      dogAge >= 3
        ? `🔮 ${name} 已進入成熟巫師階段，魔力穩定且沉著。`
        : `✨ ${name} 是年輕的小魔法師，魔力像煙火一樣噴發！`
    }
  `;

  // --- 顯示照片（從 localStorage 還原） ---
  const savedPhoto = localStorage.getItem(PHOTO_KEY);
  const resultPhotoWrapper = document.getElementById("resultPhotoWrapper");
  const resultPhoto = document.getElementById("resultPhoto");

  if (savedPhoto) {
    resultPhoto.src = savedPhoto;
    resultPhotoWrapper.style.display = "block";
  } else {
    resultPhotoWrapper.style.display = "none";
  }

  // --- 比較 ---
  const compareText = document.getElementById("compareText");
  const userAge = Number(humanAge);

  if (userAge) {
    compareText.innerHTML =
      humanLikeAge > userAge
        ? `🪄 麻瓜，你已輸給 ${name} 的魔法時鐘了！`
        : `✨ 你比 ${name} 更成熟 —— 或至少你活得比較久！`;
  }

  // --- 生日倒數 ---
  const nextBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );
  if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);

  const countdown = Math.floor((nextBirthday - today) / (1000 * 3600 * 24));
  document.getElementById("birthdayBanner").innerHTML =
    countdown <= 30
      ? `🎉 ${name} 的生日倒數 <b>${countdown}</b> 天！準備肉肉大餐！`
      : "";
});

// 清除 localStorage + 重置所有欄位
document.getElementById("clearBtn").addEventListener("click", function () {
  // 移除 localStorage 所有相關紀錄
  localStorage.removeItem(DOGNAME_KEY);
  localStorage.removeItem(BIRTHDAY_KEY);
  localStorage.removeItem(HUMANAGE_KEY);
  localStorage.removeItem(PHOTO_KEY);

  // 清空所有欄位
  document.getElementById("dogName").value = "";
  document.getElementById("birthDate").value = "";
  document.getElementById("humanAge").value = "";

  // 清空錯誤提示
  const err = document.getElementById("fileSizeError");
  err.value = "";
  err.style.display = "none";

  // 清空圖片預覽
  document.getElementById("photoPreview").style.display = "none";
  document.getElementById("photoPlaceholder").style.display = "block";
  document.getElementById("resultPhoto").src = "";
  document.getElementById("resultPhotoWrapper").style.display = "none";

  // 清空結果顯示
  document.getElementById("result").style.display = "none";

  // 清掉 input file（不然同一張不能重選）
  document.getElementById("photoInput").value = "";

  alert("已清除所有紀錄！");
});

// --- error ---
function showError(msg) {
  const err = document.getElementById("errorText");
  err.textContent = msg;
  err.style.display = "block";
}
function hideError() {
  const err = document.getElementById("errorText");
  err.style.display = "none";
}
