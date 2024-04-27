export function displayDialogue(text , onDisplayEnd) {
    const dialogueUI = document.getElementById("dialogue");
    const dialogue = document.getElementById("dialogueText");
    dialogueUI.style.display = "block";

    let index = 0;
    let currentText = "";
    
    const intervalRef = setInterval(() => {
      if(index < text.length) {
        currentText += text[index];
        dialogue.innerHTML = currentText; 
        index++;
        return;}
      clearInterval(intervalRef);
    },5);
    
    const closeBtn = document.getElementById("closeBtn");
    function onCloseBtnClick() {
        onDisplayEnd();
        dialogueUI.style.display = "none";
        dialogue.innerHTML = "";
        clearInterval(intervalRef);
        closeBtn.removeEventListener("click", onCloseBtnClick);
    }
    closeBtn.addEventListener("click", onCloseBtnClick);
}

export function setCamScale(K) {
    const resizeFacctor = K.width() / K.height();
    if(resizeFacctor < 1) {
        K.camScale(K.vec2(1));
        return
    }
    K.camScale(K.vec2(1.5));   
    
}