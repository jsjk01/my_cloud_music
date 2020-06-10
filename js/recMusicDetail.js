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
        let numspan = `<span class="num">${num}</span>`
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
                        ${des}
                    </div>
                </li>
            </a>
        `
    }
    // 将歌曲信息写入网页
    let box = document.querySelector(".hotsong>ul")
    box.innerHTML = str
    initHeight()

    let commentStr = ``
    songCommentData.data.comments.forEach(element => {
        commentStr +=
            `<div class="comment">
                <div class="user-cmt">
                    <div class="user-head">
                        <a href="">
                            <img src="${element.user.avatarUrl}" alt="">
                        </a>
                    </div>
                    <div class="cmt_wrap">
                        <div class="cmt_header">
                            <div class="cmt_meta">
                                <span class="cmt_user">
                                    <a class="nickname" href="">
                                        ${element.user.nickname}
                                    </a>
                                </span>
                                <div class="cmt_time">
                                    <span>
                                    ${parseTime( new Date(element.time) )}
                                    </span>
                                </div>
                            </div>
                            <div class="cmt_like">
                                <span class="cmt_likearea">
                                    <span class="cmt_count">
                                    ${element.likedCount}
                                    </span>
                                    <i class="cmt_likeicn">
                                        <svg class="u-svg u-svg-unzancmt" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
                                            <path fill="#999" d="m25.857 14.752c-.015.059-1.506 5.867-2.932 8.813-1.162 2.402-3 2.436-3.099 2.436h-12.826v-13c3 0 5.728-4 5.728-7.275 0-3.725 1.433-3.725 2.142-3.725 1.327 0 1.978 1.345 1.978 4 0 2.872-.832 4.525-.839 4.537-.161.31-.155.682.027.981.181.299.5.482.849.482h6.942c.922 0 1.551.215 1.866.64.467.626.286 1.705.164 2.112m-23.857 10.248v-10c0-1.795.659-1.981.855-2h2.145v13h-2.173c-.829 0-.827-.648-.827-1m25.309-13.54c-.713-.969-1.886-1.46-3.482-1.46h-5.519c.26-.932.519-2.285.519-4 0-5.221-2.507-6-4-6-1.909 0-4.185.993-4.185 5.725 0 2.206-1.923 5.275-3.815 5.275h-4-.011c-1.034.011-2.816.862-2.816 4v10.02c0 1.198.675 2.979 2.827 2.979h16.971.035c.364 0 3.224-.113 4.894-3.564 1.514-3.127 3.01-8.942 3.056-9.14.071-.23.664-2.289-.474-3.836"></path>
                                        </svg>
                                    </i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            
                <div class="cmt_content ">
                    <span class="cmt_text">
                        ${element.content}
                    </span>
                </div>
            </div>
            `
    });
    $(".comments").innerHTML = commentStr
    
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

//13位数时间戳  返回计算结果
function parseTime(time){
    // now要传入的时间戳
    let year = time.getFullYear()
    let month = time.getMonth()+1
    let date = time.getDate()
    let hour = time.getHours()
    let minute = time.getMinutes()

    let now = new Date()
    let now_hour = now.getHours()
    let now_minute = now.getMinutes()

    if(now_hour - hour == 0){
        if(now_minute - minute < 3){
            return `刚刚`
        }else{
            return `${Math.abs(now_minute - minute)}分钟前`
        }
    }else{
        return `${Math.abs(now_hour - hour)}小时前`
    }
    
}