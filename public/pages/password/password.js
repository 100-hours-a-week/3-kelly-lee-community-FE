import { componentLoader } from '/global/componentLoader.js';
import { renderHeader } from "/component/header/header.js";
import { memberApi } from '/api/member/memberApi.js';
import { showToast } from '/global/toast.js';

const memberId = localStorage.getItem("userId");

let password, rePassword, submitBtn;
let passwordHelperText, rePasswordHelperText;

document.addEventListener("DOMContentLoaded", async () => {
  await componentLoader("header", "/component/header/header", true, true, null);
  renderHeader({ back: false, profile: true });
  
  await componentLoader("password-submit-button", "/component/button/main-button/main-button", true, false, {
    text: "수정하기"
  });

  await componentLoader("password", "/component/input-form/input-form", true, false, {
    id: "password",
    label: "비밀번호*",
    type: "password",
    placeholder: "비밀번호를 입력하세요.",
    helper: "*비밀번호를 입력하세요.",
  });
  
  await componentLoader("re-password", "/component/input-form/input-form", true, false, {
    id: "re-password",
    label: "비밀번호 확인*",
    type: "password",
    placeholder: "비밀번호를 한번 더 입력하세요.",
    helper: "*비밀번호를 한번 더 입력하세요.",
  });

  password = document.querySelector("#password input");
  rePassword = document.querySelector("#re-password input");
  submitBtn = document.querySelector("#password-submit-button button");
  passwordHelperText = document.querySelector("#password .helper-text");
  rePasswordHelperText = document.querySelector("#re-password .helper-text");

  addEventListenerToPasswordInputs();
  addEventListenerToSubmitButton();
});


const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/;
function addEventListenerToPasswordInputs() {
  const validatePasswords = () => {
    const pw = password.value.trim();
    const rePw = rePassword.value.trim();

    if (!pw) {
        passwordHelperText.textContent = "*비밀번호를 입력하세요.";
        submitBtn.disabled = true;
        return;
    }else if(!passwordPattern.test(pw)){
        passwordHelperText.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야합니다.";
        if (pw !== rePw) {      
            rePasswordHelperText.textContent = "비밀번호가 일치하지 않습니다.";
        } 
        submitBtn.disabled = true;
        return;
    }else{
        passwordHelperText.textContent = "";
    }

    if(!rePw){
        rePasswordHelperText.textContent = "*비밀번호를 한번 더 입력하세요.";
        submitBtn.disabled = true;
        return;
    }

    if (pw !== rePw) {      
        rePasswordHelperText.textContent = "비밀번호가 일치하지 않습니다.";
        submitBtn.disabled = true;
    } else {
        rePasswordHelperText.textContent = "비밀번호가 일치합니다.";
        submitBtn.disabled = false;
    }
  };

  password.addEventListener("input", validatePasswords);
  rePassword.addEventListener("input", validatePasswords);
}

function addEventListenerToSubmitButton() {
  submitBtn.disabled = true;

  submitBtn.addEventListener("click", async () => {
    if (submitBtn.disabled) return;

    try {
      const response = await memberApi.patchPassword(memberId, { password: password.value });

      if (!response.ok) {
        alert("비밀번호 수정 실패");
        return;
      }
      
    showToast("수정완료", false, true);
      
    } catch (e) {
      alert("비밀번호 수정 실패");
    }
  });
}


