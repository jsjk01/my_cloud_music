let taBtn = document.querySelectorAll(".tab>label")
let screen = document.querySelectorAll(".inner>.screen")
for (let i = 0; i < taBtn.length; i++) {
    taBtn[i].onclick = function () {
        changeHeight(screen[i],screen[i].parentNode.parentNode)
    }
}
function changeHeight(obj,target) {
    console.log(obj.offsetHeight)
    target.style.height = obj.offsetHeight + "px"
    console.log(target.style.height)
}