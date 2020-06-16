// 获取推荐歌单
fetch("http://localhost:3000/mv/first",{
    method: "get",
    mode:"cors"
})
// 数据流转json
.then(function(data){
    return data.json()
})
// 渲染推荐歌单
.then(function(data){
    let box = document.querySelector(".rec-mv")
    for(i = 0; i < data.data.slice(1,7).length; i ++){
        box.innerHTML += //动态添加元素
        `
        <a href="recMv.html?id=${data.data[i].id}">
            <div class="song-item">
                <img src="${data.data[i].cover}" alt="">
                <p>${data.data[i].name}</p>
            </div>
        </a>
        `
    }
})