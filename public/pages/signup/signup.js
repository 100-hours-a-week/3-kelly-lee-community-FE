
import { componentLoader } from '/global/componentLoader.js';
import { renderHeader } from "/component/header/header.js";
import { memberApi } from '/api/member/memberApi.js';
import { imageApi } from '/api/image/imageApi.js';
import { showToast } from '/global/toast.js';

let email;
let emailHelperText;
let password;
let passwordHelperText;
let rePassword;
let rePasswordHelperText;
let nickname;
let nicknameHelperText;
let profileImageFile = null;
let emailCheck = false;
let passwordCheck = false;
let nicknameCheck = false;

document.addEventListener("DOMContentLoaded", async () => {
  
  //header
  await componentLoader("header","/component/header/header", true, true, null);
  renderHeader({ back: false, profile: false, title: false });
  
  //button
  await componentLoader("signup-button", "/component/button/main-button/main-button", true, false, {
    text: "회원 가입"
  });
  addEventListenerToSignUpButton();

  await componentLoader("signin-button","/component/button/text-button/text-button", true, false, {
    text: "로그인하러 가기"
  });
  addEventListenerToSigninButton();

  //email
  await componentLoader("email", "/component/input-form/input-form", true, false,{
    id: "email",
    label: "이메일*",
    type: "email",
    placeholder: "이메일을 입력하세요.",
    helper: "* 이메일을 입력하세요.",
  });

  addEventListenerToEmail();

  //password
  await componentLoader("password", "/component/input-form/input-form", true, false,{
    id: "password",
    label: "비밀번호*",
    type: "password",
    placeholder: "비밀번호를 입력하세요.",
    helper: "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야합니다.",
  });
  
  await componentLoader("re-password", "/component/input-form/input-form", true, false,{
    id: "re-password",
    label: "비밀번호 확인*",
    type: "re-password",
    placeholder: "비밀번호를 한번 더 입력하세요.",
    helper: "* 비밀번호를 한번 더 입력하세요.",
  });
  addEventListenerToPassword();

  //nickname
  await componentLoader("nickname", "/component/input-form/input-form", true, false,{
    id: "nickname",
    label: "닉네임*",
    type: "nickname",
    placeholder: "닉네임을 입력하세요.",
    helper: "* 닉네임을 입력하세요.",
  });
  addEventListenerToNickname();
  updateProfileImage();

});

function addEventListenerToSignUpButton(){
  const signupBtn = document.querySelector("#signup-button button");
  signupBtn.disabled = true;

  signupBtn.addEventListener("click", async () => {  
    try{

      if(signupBtn.disabled) return;
      const email = document.querySelector("#email input");
      const nickname = document.querySelector("#nickname input");
      const password = document.querySelector("#password input");

      console.log(profileImageFile);
      const response = await memberApi.signup({
        email: email.value,
        nickname: nickname.value,
        password: password.value,
        imageUrl: profileImageFile
      });

      if(!response.ok){
        alert("회원가입 실패");
        return;
      }

      const result = await response.json();
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);
      window.location.replace("/pages/home/home.html");

    }catch(e){
      alert("회원가입 실패");
    }
  });

}

function addEventListenerToSigninButton(){
  const signinBtn = document.getElementById("signin-button");
  signinBtn.addEventListener("click", () => history.back());

}

const emailPattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
function addEventListenerToEmail(){
  email = document.querySelector("#email input");
  emailHelperText = document.querySelector("#email .helper-text");

  email.addEventListener("change", async () => {
    if(email.value == null){
      emailHelperText.textContent = "이메일을 입력하세요.";
      emailCheckToFalse();
      return;
    }

    if(!emailPattern.test(email.value)){
      emailHelperText.textContent = "* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
      emailCheckToFalse();
      return;
    }
  
    try{
      const response = await memberApi.emailValidation(email.value);
    
      if(response.ok){
        emailHelperText.textContent = "";
        emailCheckToTrue();
      }else if(response.status === 409){
        emailHelperText.textContent = "* 중복된 이메일입니다.";
        emailCheckToFalse();
      }else{
        emailHelperText.textContent = "잘못된 이메일 형식입니다.";
        emailCheckToFalse();
      }
    }catch(e){
      alert("이메일 설정 실패");
    }
  });
}

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/;
function addEventListenerToPassword(){
  password = document.querySelector("#password input");
  passwordHelperText = document.querySelector("#password .helper-text");
  rePassword = document.querySelector("#re-password input");
  rePasswordHelperText = document.querySelector("#re-password .helper-text");

  password.addEventListener("input", () => {

    if(password.value === null){
      passwordHelperText.textContent = "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야합니다.";
      passwordToFalse();
      return;
    }
    if(!passwordPattern.test(password.value)){
      passwordHelperText.textContent = "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야합니다.";
      passwordToFalse();
      return;
    }

    if(password.value != rePassword.value){
      passwordHelperText.textContent = "*비밀번호가 다릅니다.";
      passwordToFalse();
      return;
    }

    passwordHelperText.textContent = "";
    rePasswordHelperText.textContent = "";
    passwordToTrue();
      
  });

  rePassword.addEventListener("input", () => {
    if(rePassword.value === null){
      rePasswordHelperText.textContent = "*비밀번호를 한번 더 입력해주세요.";
      passwordToFalse();
    }
    
    if(rePassword.value === password.value) {
      passwordHelperText.textContent = "";
      rePasswordHelperText.textContent = "";
      passwordToTrue();
    }else{
      rePasswordHelperText.textContent = "비밀번호가 다릅니다.";
      passwordToFalse()
    }
  });

}

function addEventListenerToNickname(){
  nickname = document.querySelector("#nickname input");
  nicknameHelperText = document.querySelector("#nickname .helper-text");

  nickname.addEventListener("input", async () => {
    if(!checkNickname(nickname, nicknameHelperText)){
      nicknameCheckToFalse();
      return;
    }
  
    try{
      const response = await memberApi.nicknameValidation(nickname.value);
      if(response.ok){
        nicknameHelperText.textContent = "";
        nicknameCheckToTrue();
      }else if(response.status === 409){
        nicknameHelperText.textContent = "중복된 닉네임입니다.";
        nicknameCheckToFalse();
      }else{
        nicknameHelperText.textContent = "잘못된 닉네임 형식입니다.";
        nicknameCheckToFalse();
      }
    }catch(e){
      alert("닉네임 설정 실패");
    }
  });
}

function checkNickname(){
  if(nickname.value == null){
    nicknameHelperText.textContent = "닉네임을 입력하세요.";
    return false;
  }else if( /\s/.test(nickname.value)){
    nicknameHelperText.textContent = "* 띄어쓰기를 없애주세요.";
    return false;
  }else if(nickname.value.length > 10){
    nicknameHelperText.textContent = "닉네임은 최대 10자까지 작성 가능합니다.";
    return false;
  }
  return true;
}

function emailCheckToFalse(){
  emailCheck = false;
  email.classList.remove("valid");
  updateSignupButtonState();
}

function emailCheckToTrue(){
  emailCheck = true;
  email.classList.add("valid");
  updateSignupButtonState();
}

function passwordToFalse(){
  passwordCheck = false;
  password.classList.remove("valid");
  rePassword.classList.remove("valid");
  updateSignupButtonState();
}

function passwordToTrue(){
  passwordCheck = true;
  password.classList.add("valid");
  rePassword.classList.add("valid");
  updateSignupButtonState();
}

function nicknameCheckToFalse(){
  nicknameCheck = false;
  nickname.classList.remove("valid");
  updateSignupButtonState();
}

function nicknameCheckToTrue(){
  nicknameCheck = true;
  nickname.classList.add("valid");
  updateSignupButtonState();
}

function updateSignupButtonState() {
  const signup = document.querySelector("#signup-button button");

  if (!signup) return;

  if (emailCheck && passwordCheck && nicknameCheck) {
    signup.disabled = false;
  } else {
    signup.disabled = true;
  }
}

function updateProfileImage(){

  const profileImageInput = document.getElementById("profileImage");
  const profilePreview = document.getElementById("profilePreview");

  profileImageInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

  
    const formData = new FormData();
    const json = JSON.stringify({ type: "profile" });
    formData.append("file", file);
    formData.append("imageRequest", new Blob([json], { type: "application/json" }));    

    try {
      const response = await imageApi.postImage(formData);

      if (!response.ok) {
        showToast("이미지 업로드 실패", false, true);
        return;
      }

      const result = await response.json();
      profileImageFile = result.imageUrl;
      console.log(profileImageFile);

      //이미지 업로드
      const reader = new FileReader();
      reader.onload = (e) => {
          profilePreview.style.backgroundImage = `url(${profileImageFile})`;
          profilePreview.style.backgroundSize = "cover";
          profilePreview.style.backgroundPosition = "center";
          profilePreview.innerHTML = ""; 
        };
      reader.readAsDataURL(file);


    } catch (error) {
      showToast("이미지 업로드 실패", false, true);
    }
  });
}
