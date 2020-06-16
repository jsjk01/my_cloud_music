// 手机号码
let tel = document.querySelector(".tel")
// 密码
let yzm = document.querySelector(".yzm")
// 评论
let pinglun = document.querySelector(".pl-input")

// 登录 采用jQuery
function login(){
    $.ajax({
    url: `http://localhost:3000/login/cellphone?phone=${tel.value}&password=${yzm.value}`,
    xhrFields: {
      withCredentials: true //保存cookie 
    },
    success: function (data) {
        // 如果登录成功，将登录界面隐藏
        if(data.code == 200){
            document.querySelector('.sub').style.display = "none"
            document.querySelector('.white_content').style.display = "none"
        }else {
           
        }

    },
    error: function (err) {
      console.log(err)
    }
  })
}


// 发送评论，不能即时显示，API机制
function sentComment(){
    // fetch(`http://localhost:3000/comment?t=1&type=1&id=${location.search.slice(4)}&content=${pinglun.value}`, {
      $.ajax({
        url: `http://localhost:3000/comment?t=1&type=1&id=${location.search.slice(4)}&content=${pinglun.value}`,
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          console.log(data)
        },
        error: function (err) {
          console.log(err)
        }
      })

}
// 获取mv地址
function getMv(){
    return axios.get("http://localhost:3000/mv/url" + location.search)
}
// 获取mv名称与作者
function getMvInfo(){
    return axios.get("http://localhost:3000/mv/detail?mvid=" + location.search.slice(4))
}
// 获取歌曲评论
function getMvComment(){
    return axios.get("http://localhost:3000/comment/mv" + location.search)
}

axios.all([getMv(),getMvInfo(),getMvComment()])
.then(axios.spread(function(mvUrl,mvInfo,mvComment){
    let play = document.querySelector(".mv-player")
    let mv_title = document.querySelector(".mv-info>h2")
    let mv_singer = document.querySelector(".mv-info>p")
    play.setAttribute("src",mvUrl.data.data.url)
    mv_title.innerHTML = mvInfo.data.data.name
    mv_singer.innerHTML = mvInfo.data.data.artists[0].name
    let commentStr = ``
    mvComment.data.comments.forEach(element => {
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
    document.querySelector(".comments").innerHTML = commentStr
}))

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

// 登录界面，在页面最底下
let num = 0
function show(obj){
    num ++
    if(num % 2 ==1){
        obj.style.height = "auto"
        obj.style.display="block"
    }else{
        obj.style.height = 0 + "px"
    }
}

