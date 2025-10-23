import { authApi } from "/api/auth/authApi.js";

export function renderHeader({ back = false, profile = false, image = "https://i.namu.wiki/i/n_jBz7bcTo4VFyasnau8sTBfhY8b1IqRAU59IbTaENBPYfb0HqVTiAGoxkmZ4byR6LSczPivVUecrUZf_5E8pMtlbI2Sk24fvTx2aXQtfxPYFk7FwEJzBasRBwYqwjrAUvTtukMO_dJydgRleBQllQ.webp"
} = {}) {

  if (back) {
    const backBtn = document.getElementById("header-back-button");
    backBtn.style.visibility = "visible"; 
    backBtn.onclick = () => history.back();
  }

  if (profile) {
    const profileWrapper = document.getElementById("profile-wrapper");
    profileWrapper.style.visibility = "visible";
    
    const profileBtn = document.getElementById("header-profile-image");
    profileBtn.addEventListener("click", () => {
      const profileMenu = document.getElementById("profile-menu");
      profileMenu.classList.toggle("hidden");
    });

    renderHeaderProfile();
  }
}

export function renderHeaderProfile(){
  const profileBtn = document.getElementById("profile-button");
  const profileMenu = document.getElementById("profile-menu");

  profileBtn.addEventListener("click", () => {
    console.log("click");
    profileMenu.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!profileBtn.contains(e.target)) {
        profileMenu.classList.remove("show");
      }
    });

  const profileModifyBtn = document.getElementById("header-profile-modify-button");
  profileModifyBtn.addEventListener("click", () => {
    location.href = "/pages/profile/profile.html"
  });

  const passwordModifyBtn = document.getElementById("header-password-modify-button");
  passwordModifyBtn.addEventListener("click", () => {
    location.href = "/pages/password/password.html"
  });

  const logoutBtn = document.getElementById("logout-button");
  logoutBtn.addEventListener("click", async (event) => {
    try{
      const memberId = localStorage.getItem("userId");
      const response = await authApi.logout(memberId);

      if(!response){
        alert("로그아웃 실패");
        return;
      }

      localStorage.clear();
      sessionStorage.clear();

      window.location.replace("/pages/signin/signin.html");

    }catch(e){

    }
  });

}