let lyric
// 获取音频地址
function getAddress(){
    return axios.get("http://localhost:3000/song/url" + location.search)
}

// 获取音频专辑图片
function getAlbumImg(){
    return axios.get("http://localhost:3000/song/detail?ids=" + location.search.slice(4))
}

// 获取音频歌词
function getSongLrc(){
    return axios.get("http://localhost:3000/lyric" + location.search)
}

// 并发处理请求
axios.all([getAddress(),getAlbumImg(),getSongLrc()])
    .then(axios.spread(function(musicUrlData,albumImgData,lyricData){
        
        let playBox = document.querySelector(".play")
        let albumImgBox = document.querySelector(".album-img")
        let LyricBox = document.querySelector(".song-lrc>h2")
        let blurBox = document.querySelector(".blur-img")
        let lyricP = document.querySelector("#lyric-text")
        let musicPlay = document.querySelector(".container")
        
        let disc = document.querySelector(".roll");
        let rangeBar = document.querySelector("#range-bar")

        playBox.innerHTML = `<audio id="music" src="${musicUrlData.data.data[0].url}"></audio>`//音频
        albumImgBox.innerHTML = `<img id="album-img" src="${albumImgData.data.songs[0].al.picUrl}" alt=""></img>`//专辑图
        blurBox.innerHTML = `<img src="${albumImgData.data.songs[0].al.picUrl}" alt=""></img>`//毛玻璃背景
        LyricBox.innerHTML = `
        <h2>${albumImgData.data.songs[0].name + " " +albumImgData.data.songs[0].alia}</h2>
        `
        try{
            lyric = new window.Lyric(lyricData.data.lrc.lyric,function(data){
                updateLyric(data.txt)//将数据发往歌词滚动处理方法
            })
        }catch(error){
            lyricP.innerHTML = `<b>暂无歌词</b>`
        }
        
        
        

               
        // 播放控制
        let audio = document.querySelector("#music")
        musicPlay.addEventListener("click",playOrPause)
        function playOrPause(){
            if (audio.paused) {
                audio.play();
                // 样式切换
                disc.classList.remove("paused")
                disc.classList.add("playing")
                playBox.classList.remove("play")
                // 歌词状态切换
                try{
                    lyric.togglePlay()
                }
                catch(error){
                    
                }
                
            }else{
                audio.pause();
                disc.classList.remove("playing")
                disc.classList.add("paused")
                playBox.classList.add("play")
                try{
                    lyric.togglePlay()
                }
                catch(error){

                }
            }
        }
        playOrPause()
        // 歌词滚动
        let lyric_text = [];
        let count = 0;
        function updateLyric(text){
            
            if(text != null){
                lyric_text.push(text)
                count ++
            }
            
            if(count == 1){
                lyricP.innerHTML = `<b>${lyric_text[count - 1]}</b>`
            }
            if(count == 2){
                lyricP.innerHTML = `
                <p>${lyric_text[count - 2]}</p>
                <b>${lyric_text[count - 1]}</b>
                `
            }
            if(count > 2){
                lyricP.innerHTML = `
                <p>${lyric_text[count - 3]}</p>
                <p>${lyric_text[count - 2]}</p>
                <b>${lyric_text[count - 1]}</b>
                `
            }
            
        }

        audio.onloadedmetadata = function(){
            audio.ontimeupdate = function(){
                rangeBar.value = audio.currentTime * 100 / audio.duration
            }
        }

        rangeBar.oninput = function(){
            audio.currentTime = rangeBar.value * audio.duration / 100
            try{
               lyric.seek(audio.currentTime * 1000) 
            }catch(error){
                
            }
            
        }
    }))




