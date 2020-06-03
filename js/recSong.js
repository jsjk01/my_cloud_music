// 获取推荐歌单
fetch("http://localhost:3000/personalized",{
    method: "get",
    mode:"cors"
})
// 数据流转json
.then(function(data){
    return data.json()
})
// 渲染推荐歌单
.then(function(data){
    let box = document.querySelector(".rec-song")
    for(i = 0; i < data.result.slice(1,7).length; i ++){
        box.innerHTML += //动态添加元素
        `
        <a href="recSong.html?id=${data.result[i+1].id}">
            <div class="song-item">
                <img src="${data.result[i+1].picUrl}" alt="">
                <p>${data.result[i+1].name}</p>
            </div>
        </a>
        `
    }
})