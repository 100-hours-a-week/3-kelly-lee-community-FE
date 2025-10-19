import { componentLoader } from '/global/componentLoader.js';
import { renderHeader } from "/component/header/header.js";


document.addEventListener("DOMContentLoaded", async () => {
    
    await componentLoader("header","/component/header/header", true, true, null);
    renderHeader({ back: true, profile: true });

    await componentLoader("comment-submit-button", "/component/button/round-button/round-button", true, false, {
      text: "댓글 등록"
    });

    await componentLoader("comment-card", "/component/comment-card/comment-card", true, false, {
      text: "댓글 등록"
    });

});