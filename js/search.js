searchHot()
getLocalInfo()
// 全局变量
let searchInput = document.querySelector(".search-bar>input")
let tempWord
// 光标在输入框时监听
searchInput.onfocus = function () {
    searchInput.onkeyup = function (e) {
        if (searchInput.value == "") {
            showContainer(document.querySelector(".search-def"))
            getLocalInfo()
        } else {
            if (e.keyCode == 13) {
                showContainer(document.querySelector(".search-res"))
                // 检查本地储存是否为空
                let keyWord = JSON.parse(localStorage.getItem("singerName")) || []
                // 若历史搜索记录不包含所键入内容，则储存
                if (!keyWord.includes(searchInput.value)) {
                    keyWord.push(searchInput.value)
                    localStorage.setItem("singerName", JSON.stringify(keyWord))
                }
                // 并发处理搜索结果
                tempWord = searchInput.value
                searchResult()
            } else {
                showContainer(document.querySelector(".search-rem"))
                // 搜索建议
                searchRem()
            }
        }
    }

}
// 光标不在输入框时监听
searchInput.onBlur = function () { }

// 渲染搜索结果
function searchResult() {
    axios.all([getAlbum(), getSongList()])
        .then(axios.spread(function (alblmData, songlistData) {
            let albumStrBox = document.querySelector(".search-res>ol")
            let songListBox = document.querySelector(".search-res>ul")

            let albumStr = ``
            let songListStr = ``
            let songArr = songlistData.data.result.songs

            albumStr = (alblmData.data.result.artist && alblmData.data.result.album) ? `
                        <li>
                            <img src="${alblmData.data.result.artist[0].picUrl}" alt="">
                            <p>${alblmData.data.result.artist[0].name}</p>
                        </li>
                        <li>
                            <img src="${alblmData.data.result.album[0].picUrl}" alt="">
                            <p>${alblmData.data.result.album[0].name}</p>
                        </li>
                        ` : ``

            for (i = 0; i < songArr.length; i++) {
                let songid = songArr[i].id
                songListStr += `
                                <a href="play.html?id=${songid}">
                                    <li>
                                        <div class="song-title-container">
                                            <div class="song-title">
                                                <p>${songArr[i].name}</p>
                                            </div>
                                            <div class="song-des">
                                            
                                        </div>
                                        <div class="play-icon"></div>
                                    </div>                        
                                        <div class="singer">
                                            <span class="sqicon"></span>
                                            ${songArr[i].artists[0].name} - ${songArr[i].album.name}
                                        </div>
                                    </li>
                                </a>
                                `
            }
            albumStrBox.innerHTML = albumStr
            songListBox.innerHTML = songListStr

        }))
}

// 搜索热词
function searchHot() {
    fetch("http://localhost:3000/search/hot", {
        method: "get",
        mode: "cors"
    })
        // 数据流转json
        .then(function (data) {
            return data.json()
        })
        .then(function (data) {
            let box = document.querySelector(".hot-key")
            let str = ``
            for (i = 0; i < data.result.hots.length; i++) {
                str += `<span onclick="changeTempWord(\'${data.result.hots[i].first}\')">${data.result.hots[i].first}</span>`
            }
            box.innerHTML = str
        })
}

// 获取并渲染历史搜索词
function getLocalInfo() {
    let keyWord = JSON.parse(localStorage.getItem("singerName")) || []
    let str = ``
    let box = document.querySelector(".search-list")
    for (i = 0; i < keyWord.length; i++) {
        str +=
            `
        <li>
            <p onclick="changeTempWord(\'${keyWord[i]}\')">${keyWord[i]}</p><span onclick="delInfo(${i})">x</span>
        </li>
        `
    }
    box.innerHTML = str
}

// 删除历史搜索词
function delInfo(x) {
    let keyWord = JSON.parse(localStorage.getItem("singerName")) || []
    keyWord.splice(x, 1)
    localStorage.setItem("singerName", JSON.stringify(keyWord))
    getLocalInfo()
}

// 搜索建议
function searchRem() {
    let box = document.querySelector(".search-rem>.search-list")
    fetch(`http://localhost:3000/search/suggest?keywords=${searchInput.value}&type=mobile`, {
        method: "get",
        mode: "cors"
    })
        // 数据流转json
        .then(function (data) {
            return data.json()
            // data.result.allMatch

        })
        .then(function (data) {
            let str = ``
            try {
                for (i = 0; i < data.result.allMatch.length; i++) {
                    str +=
                        `
                <li>
                    <p onclick="changeTempWord(\'${data.result.allMatch[i].keyword}\')">${data.result.allMatch[i].keyword}</p>
                </li>
                `
                }
            } catch (error) {

            }
            box.innerHTML = str

        })

}
// 切换搜索结果关键词并渲染
function changeTempWord(text) {
    tempWord = text
    searchInput.value = text
    showContainer(document.querySelector(".search-res"))
    searchResult()
}

// 搜索结果获取
// 获取专辑
function getAlbum() {
    return axios.get(`http://localhost:3000/search/multimatch?keywords= ${tempWord}`)
}
// 获取歌曲列表
function getSongList() {
    return axios.get(`http://localhost:3000/search?keywords= ${tempWord}`)
}


