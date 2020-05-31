showDate()
function showDate(){
    let date = new Date()
    let month = (date.getMonth() < 9) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)
    let day = (date.getDate() < 9) ? "0" + date.getDate() : date.getDate()
    let box = document.querySelector(".hottime")
    box.innerHTML = `更新日期：${month}月${day}日`
}
// 获取
fetch("http://localhost:3000/top/list?idx=2",{
    method: "get",
    mode:"cors"
})
.then(function(data){
    return data.json()//转换数据流为json
})
.then(function(data){
    let str = ''//定义空字符串，接收HTML模板
    
    for(i = 0; i < 20; i ++){
        //歌曲信息处理
        let des = (data.playlist.tracks[i].ar.length==2) ? data.playlist.tracks[i].ar[1].name + " - " + data.playlist.tracks[i].ar[0].name : data.playlist.tracks[i].ar[0].name
        let num = (i < 9) ? "0" + (i+1) : (i+1)
        let numspan = (i < 3) ? `<span class="num num-red">${num}</span>` : `<span class="num">${num}</span>`
        str += 
        `
        ${numspan}
        <a href="play.html?id=${data.playlist.trackIds[i].id}">
                <li>
                    <div class="song-title-container">
                        <div class="song-title">
                            <p>${data.playlist.tracks[i].al.name}</p>
                        </div>
                        <div class="song-des">
                            <p></p>
                        </div>
                        <div class="play-icon"></div>
                    </div>

                    <div class="singer">
                        <span class="sqicon"></span>${des}
                    </div>
                </li>
            </a>
        `
    }
    let box = document.querySelector(".hotsong>ul")
    box.innerHTML = str

})