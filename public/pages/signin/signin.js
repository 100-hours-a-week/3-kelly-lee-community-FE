import { componentLoader } from '/global/componentLoader.js';
import { renderHeader } from "/component/header/header.js";
import { authApi } from '/api/auth/authApi.js';


let emailCheck = false;
let passwordCheck = false;

document.addEventListener("DOMContentLoaded", async () => {

  await componentLoader("header","/component/header/header", true, true, null);
  renderHeader({ back: false, profile: false });

  await componentLoader("email", "/component/input-form/input-form", true, false,{
    id: "email",
    label: "이메일*",
    type: "email",
    placeholder: "이메일을 입력하세요.",
    helper: "*이메일을 입력하세요.",
  });
  addEventListenerToEmail();

  await componentLoader("password", "/component/input-form/input-form", true, false,{
    id: "password",
    label: "비밀번호*",
    type: "password",
    placeholder: "비밀번호를 입력하세요.",
    helper: "*비밀번호를 입력하세요.",
  });
  addEventListenerToPassword();

  await componentLoader("signin-button", "/component/button/main-button/main-button", true, false, {
    text: "로그인"
  });
  addEventListenerTpSignInButton();

  await componentLoader("signup-button","/component/button/text-button/text-button", true, false, {
    text: "회원가입"
  });
  addEventListenerToSignUpButton();

});

const emailPattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
function addEventListenerToEmail(){
  const email = document.querySelector("#email input");
  email.addEventListener("input", () => {
    let emailHelperText = document.querySelector("#email .helper-text");

    if(email.value == null){
      emailHelperText.textContent = "이메일을 입력하세요.";
      emailToFalse();
      return;
    }

    if(!emailPattern.test(email.value)){
      emailHelperText.textContent = "* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
      emailToFalse();
      return;
    }

    emailToTrue();
    emailHelperText.textContent = "";
  });
}

function addEventListenerToPassword(){
  const password = document.querySelector("#password input");
  password.addEventListener("input", () => {
    let passwordHelperText = document.querySelector("#password .helper-text");

    if(password.value != null) {
      passwordToTrue();
      passwordHelperText.textContent = "";
      return;
    }
    passwordToFalse();
  });
}


function addEventListenerTpSignInButton(){
  const signinBtn = document.querySelector("#signin-button button");
  signinBtn.disabled = true;

  signinBtn.addEventListener("click", async () => {
    const email = document.querySelector("#email input");
    const emailHelperText = document.querySelector("#email .helper-text");
    const password = document.querySelector("#password input");
    const passwordHelperText = document.querySelector("#password .helper-text");

    if (signinBtn.disabled) return;

    const response = await authApi.login({ email: email.value, password: password.value });
    if (!response.ok) {
      if(response.status === 404){
        emailHelperText.textContent = "로그인 정보를 찾을 수 없습니다.";
      }else if(response.status === 400){
        passwordHelperText.textContent = "잘못된 비밀번호를 입력했습니다.";
      }else{
        alert("로그인을 실패했습니다.");
      }
      return;
    }

    const result = await response.json();
    localStorage.setItem("userId", result.userId);
    localStorage.setItem("accessToken", result.accessToken);
    localStorage.setItem("refreshToken", result.refreshToken);
    window.location.replace("/pages/home/home.html");
    
  });
}

function addEventListenerToSignUpButton(){
  const signupBtn = document.getElementById("signup-button");
  signupBtn.addEventListener("click", () => {
    window.location.href = "/pages/signup/signup.html";
  });
}

function emailToFalse(){
  emailCheck = false;
  updateSigninButtonState();
}

function emailToTrue(){
  emailCheck = true;
  updateSigninButtonState();
}

function passwordToFalse(){
  passwordCheck = false;
  updateSigninButtonState();
}

function passwordToTrue(){
  passwordCheck = true;
  updateSigninButtonState();
}

function updateSigninButtonState() {
  const signinBtn = document.querySelector("#signin-button button");

  if (!signinBtn) return;

  if (emailCheck && passwordCheck) {
    signinBtn.disabled = false;
  } else {
    signinBtn.disabled = true;
  }
}