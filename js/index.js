// --- 照片預覽 ---
document.getElementById("photoInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const preview = document.getElementById("photoPreview");
  const placeholder = document.getElementById("photoPlaceholder");

  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";
  placeholder.style.display = "none";
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

// --- BBC 換算公式：人類年齡 = 16 ln(狗狗年齡) + 31 ---
document.getElementById("calcBtn").addEventListener("click", function () {
  magicEffect(this);

  const name = document.getElementById("dogName").value || "狗狗";
  const birth = new Date(document.getElementById("birthDate").value);
  const today = new Date();

  if (birth > today) {
    showError("❗ 生日不能是未來的日期！");
    return;
  }

  hideError();

  // 天數 → 狗狗實際年齡
  const diffDays = (today - birth) / (1000 * 3600 * 24);
  const dogAge = diffDays / 365;

  // BBC 換算成人類年齡
  const humanLikeAge = 16 * Math.log(dogAge) + 31;

  // 結果顯示
  document.getElementById("result").style.display = "block";
  document.getElementById(
    "resultTitleText"
  ).textContent = `${name} 的魔法年齡報告`;

  // 填入內容
  document.getElementById("resultContent").innerHTML = `
    🐶 實際年齡：<b>${dogAge.toFixed(2)}</b> 歲<br>
    ✨ BBC 換算人類年齡：約 <b>${humanLikeAge.toFixed(1)}</b> 歲<br><br>
    ${
      dogAge >= 3
        ? `🔮 ${name} 已進入成熟巫師階段，魔力穩定且沉著。`
        : `✨ ${name} 是年輕的小魔法師，魔力像煙火一樣噴發！`
    }
  `;

  // 顯示照片
  const file = document.getElementById("photoInput").files[0];
  const resultPhotoWrapper = document.getElementById("resultPhotoWrapper");
  const resultPhoto = document.getElementById("resultPhoto");

  if (file) {
    resultPhoto.src = URL.createObjectURL(file);
    resultPhotoWrapper.style.display = "block";
  } else {
    resultPhotoWrapper.style.display = "none";
  }

  // 比較與使用者年齡
  const userAge = Number(document.getElementById("humanAge").value);
  const compareText = document.getElementById("compareText");

  if (userAge) {
    compareText.innerHTML =
      humanLikeAge > userAge
        ? `🪄 麻瓜，你已輸給 ${name} 的魔法時鐘了！`
        : `✨ 你比 ${name} 更成熟 —— 或至少你活得比較久！`;
  } else {
    compareText.innerHTML = "";
  }

  // 生日倒數
  const nextBirthday = new Date(
    today.getFullYear(),
    birth.getMonth(),
    birth.getDate()
  );
  if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);

  const countdown = Math.floor((nextBirthday - today) / (1000 * 3600 * 24));

  const banner = document.getElementById("birthdayBanner");
  banner.innerHTML =
    countdown <= 30
      ? `🎉 ${name} 的生日倒數 <b>${countdown}</b> 天！準備肉肉大餐！`
      : "";
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
