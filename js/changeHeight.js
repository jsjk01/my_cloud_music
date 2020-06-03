let taBtn = document.querySelectorAll(".tab>label")
let screen = document.querySelectorAll(".inner>.screen")
for (let i = 0; i < taBtn.length; i++) {
    taBtn[i].onclick = function () {
        changeHeight(screen[i],screen[i].parentNode.parentNode)
    }
}
function changeHeight(obj,target) {
    target.style.height = obj.offsetHeight + "px"
}