/**
 * 获取歌单信息：
 * 歌单封面：songDetailData.data.playlist.coverImgUrl
 * 歌单名称：songDetailData.data.playlist.name
 * 歌单标签：songDetailData.data.playlist.tags
 * 歌单创建者昵称：songDetailData.data.playlist.creator.nickname
 * 歌单创建者头像：songDetailData.data.playlist.creator.avatarUrl
 * 歌单列表：
 * 歌单歌曲名：songDetailData.data.playlist.tracks[i].name
 * 歌手名：songDetailData.data.playlist.tracks[i].ar[0].name
 * 歌曲专辑：songDetailData.data.playlist.tracks[i].al.name
 */

function getSongDetail(){
    return axios.get("http://localhost:3000/playlist/detail" + location.search)
}
/**
 * //todo待补充
 */
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

    

    // 标签与简介处理
    let tags = songDetailData.data.playlist.tags
    let des = songDetailData.data.playlist.description
    // 正则表达式处理
    let reg = /\n/g
    let desStr = des.replace(reg,"<br>")
    let tagStr = ``
    for(i = 0; i < tags.length; i ++){
        tagStr += `<span>${tags[i]}</span>`
    }

    // 写入网页
    $(".introduction-title").innerHTML += tagStr
    $(".introduction-text>p").innerHTML = desStr
    

    let str = ''// 定义空字符串，接收HTML模板
    for(i = 0; i < songDetailData.data.playlist.tracks.length; i ++){
        // 歌单歌曲列表信息处理
        let des = songDetailData.data.playlist.tracks[i].ar[0].name + " -" + songDetailData.data.playlist.tracks[i].al.name
        // 序号处理 小于9的前面补0 美观
        let num = (i < 9) ? "0" + (i+1) : (i+1)
        // 歌曲前的序号 前三字体标红
        let numspan = (i < 3) ? `<span class="num num-red">${num}</span>` : `<span class="num">${num}</span>`
        // 将处理好的歌曲写入框架并存储到str内
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
    // 将歌曲信息写入网页
    let box = document.querySelector(".hotsong>ul")
    box.innerHTML = str
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
let heightTemp //全局变量
function initHeight(){
    /**
     * 动态设置inner和content元素高度
     */
    // 先将inner设置为自动扩展，以检测目前需要怎样的高度才能够容纳所有内容
    $('.inner').style.height = "auto"
    // 将扩展到最大的inner的高度储存到heightTemp
    heightTemp = $('.inner').offsetHeight
    // 如果heightTemp比120大，就将inner的高度设置为120px，否则就让它自由扩展，总之都这么小了
    $('.inner').style.height = (heightTemp > 120) ? "120px" : "auto"
    // 父级元素处理方式同上
    $('.inner').parentNode.style.height = (heightTemp > 120) ? "135px" : (heightTemp + 5) + "px"
    // 将heightTemp进行处理，不然上面的show(obj)就没办法按预期运行了
    heightTemp = (heightTemp > 120) ? 120 : heightTemp
}