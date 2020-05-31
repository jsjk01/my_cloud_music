// 获取
fetch("http://localhost:3000/personalized/newsong",{
    method: "get",
    mode:"cors"
})
.then(function(data){
    return data.json()//转换数据流为json
})
// 渲染最新音乐
.then(function(data){
    let str = ''//定义空字符串，接收HTML模板
    for(i = 0; i < data.result.length; i ++){
        
        let des = data.result[i].song.alias[0] || '' // 检测专辑是否为空
        str += 
        `
        <a href="play.html?id=${data.result[i].id}">
                <li>
                    <div class="song-title-container">
                        <div class="song-title">
                            <p>${data.result[i].name}</p>
                        </div>
                        <div class="song-des">
                            <p>${des}</p>
                        </div>
                        <div class="play-icon"></div>
                    </div>

                    <div class="singer">
                        <span class="sqicon"></span>${data.result[i].song.artists[0].name} - ${data.result[i].song.album.name}
                    </div>
                </li>
            </a>
        `
    }
    let box = document.querySelector(".newSong>ul")
    //写入网页
    box.innerHTML = str
})




