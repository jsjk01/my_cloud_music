function getSongDetail(){
    return axios.get("http://localhost:3000/playlist/detail" + location.search)
}
function songComment(){
    return axios.get("http://localhost:3000/comment/playlist" + location.search)
}
// 并发处理歌单详情
axios.all([getSongDetail(),songComment()])
.then(axios.spread(function(songDetailData,songCommentData){
    let songImg = document.querySelector(".song-img>img")
    let avatar = document.querySelector(".avatar>img")
    let songTitle = document.querySelector(".song-text>h2")
    let author = document.querySelector(".song-text>p")
    let bg = document.querySelector(".bg>img")


    songImg.setAttribute("src",songDetailData.data.playlist.coverImgUrl)
    bg.setAttribute("src",songDetailData.data.playlist.coverImgUrl)
    avatar.setAttribute("src",songDetailData.data.playlist.creator.avatarUrl)
    songTitle.innerHTML = songDetailData.data.playlist.name
    author.innerHTML = songDetailData.data.playlist.creator.nickname

    let str = ''//定义空字符串，接收HTML模板
    for(i = 0; i < songDetailData.data.playlist.tracks.length; i ++){
        //歌曲信息处理
        
        let des = songDetailData.data.playlist.tracks[i].ar[0].name + " -" + songDetailData.data.playlist.tracks[i].al.name
        let num = (i < 9) ? "0" + (i+1) : (i+1)
        let numspan = (i < 3) ? `<span class="num num-red">${num}</span>` : `<span class="num">${num}</span>`
        str += 
        `
        ${numspan}
        <a href="play.html?id=${songDetailData.data.playlist.tracks[i].id}">
                <li>
                    <div class="song-title-container">
                        <div class="song-title">
                            <p>${songDetailData.data.playlist.tracks[i].name}</p>
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

    // 标签与简介处理
    let tags = songDetailData.data.playlist.tags
    let des = songDetailData.data.playlist.description

    let reg = /\n/g
    let desStr = des.replace(reg,"<br>")
    let tagStr = ``
    for(i = 0; i < tags.length; i ++){
        tagStr += `<span>${tags[i]}</span>`
    }
    $(".introduction-title").innerHTML += tagStr
    $(".introduction-text>p").innerHTML = desStr
    initHeight()
    
}))

// 简介的显示与折叠
let num = 0
function show(obj){
    num ++
    if(num % 2 ==1){
        obj.style.height = "auto"
        obj.parentNode.style.height = "auto"
        $(".introduction-text>img").classList.remove("down")
        $(".introduction-text>img").classList.add("up")
    }else{
        obj.style.height = heightTemp + "px"
        obj.parentNode.style.height = (heightTemp + 5) + "px"
        $(".introduction-text>img").classList.remove("up")
        $(".introduction-text>img").classList.add("down")
    }
}
// 初始化inner高度
let heightTemp
function initHeight(){
    $('.inner').style.height = "auto"
    heightTemp = $('.inner').offsetHeight
    $('.inner').style.height = (heightTemp > 120) ? "120px" : "auto"
    $('.inner').parentNode.style.height = (heightTemp > 120) ? "135px" : (heightTemp + 5) + "px"
    heightTemp = (heightTemp > 120) ? 120 : heightTemp
}