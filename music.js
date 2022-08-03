/*

1. Render Songs
2. Scroll top
3. Play/ pause / seek
4. CD rotate
5. Next / prev
6. Random
7. Next / Repeat when ended
8. Active Song
9. Scroll active song into view : not done
10. Play song when click

*/



const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'App_music'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd =$('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist =  $('.playlist')
 
// console.log(playBtn)

const app = {

    // lấy chỉ mục đầu tiên của mảng
    currentIndex : 0, 
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
     
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},


    songs: [
        {
            name: 'Vi me anh bat chia tay',
            singer : 'Midu-Karik',
            path: './assets/music/song 1.mp3',
            image: './assets/images/song 1.png'
        },
        {
            name : 'Mot buoc yeu van dam dau',
            singer : 'Mr.Siro',
            path : './assets/music/song 2.mp3',
            image : './assets/images/song 2.png'
        },{
            name: 'Halo',
            singer : 'Beyonce',
            path: './assets/music/song 3.mp3',
            image: './assets/images/song 3.png'
        },
        {
            name : 'Someone Like You',
            singer : 'Adele',
            path : './assets/music/song 4.mp3',
            image : './assets/images/song 4.png'
        },
        {
            name: 'Cay dan sinh vien',
            singer : 'My Tam',
            path: './assets/music/song 5.mp3',
            image: './assets/images/song 5.png'
        },
        {
            name : 'Cho mot tinh yeu',
            singer : 'My Tam',
            path : './assets/music/song 7.mp3',
            image : './assets/images/song 7.png'
        },{
            name: 'Phu Ban Dau',
            singer : 'Beyonce',
            path: './assets/music/song 8.mp3',
            image: './assets/images/song 8.png'
        },
        {
            name : 'Sau tim thiep hong',
            singer : 'Le Quyen',
            path : './assets/music/song 9.mp3',
            image : './assets/images/song 9.png'
        }
    ],
    

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    
    //    tao render ra view
    render: function () {
        const htmls = this.songs.map((song, index) => {

            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}"> 
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties : function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handelEvents: function () {

        const _this = this

        // xử lý cd quay và dưng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity // loop vo han

        })
        cdThumbAnimate.pause()
        // console.log(cdThumbAnimate)

        // xử lý phóng to thu nhỏ image
        const cdWidth = cd.offsetWidth
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || window.scrollY
            const newCdWidth = cdWidth-scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // xử lý khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying){
                audio.pause() 
            }else {
                audio.play()
            }

            // khi song được play
            audio.onplay = function() {
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
                
            }

            // khi song pause
            audio.onpause = function() {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }

            

            // khi tiến độ bài hát thay đổi
            audio.ontimeupdate = function() {
                if (audio.duration ) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100 )
                    progress.value = progressPercent
                    
                }
            }

            // xử lý khi tua

            progress.onchange = function(e) {
                const seekTime = e.target.value * audio.duration / 100
                audio.currentTime = seekTime
            }
        }

        // xử lý next bai 
        nextBtn.onclick = function() {

            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
               
                audio.play()
                _this.render()
        }

        // xu ly khi prev 
        prevBtn.onclick = function() {
            
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }

            
            audio.play()
            _this.render()
        }

        // xử lý bật tắt random
        randomBtn.onclick = function(e) {
           
            _this.isRandom = !this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', this.isRandom)
        }

        // xử lý phát lặp lại bài
        repeatBtn.onclick = function() {

            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', this.isRepeat)
        }


        // xử lý next song khi audio ended
        audio.onended = function() {

            if(_this.isRepeat) {
                audio.play()
            } else {
                
                nextBtn.click()
            }

        }

        // lắng nghe khi  click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')

            if (songNode || (e.target.closest('.option')) ) {
                // xử lý khi click vào bài hát
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // xử lý khi click vào option
                if ((e.target.closest('.option'))) {

                }
            
            }
        }

    },

    loadCurrentSong: function () {  
        
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

       
    },

    nextSong: function () {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function () {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },

    // xử lý khi random 
    playRandomSong: function () {
        let newIndex
        do{
            newIndex = Math.floor(Math.random()*this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    //    tao start de bat dau chay 
    start: function () {
        //  Render playlist
        this.render()

        //  Lăng nghe / xử lý các sự kiện (Dom Events)
        this.handelEvents()

        //  Định nghĩa các thuộc tính cho Object
        this.defineProperties()
    
        //  Tải thông tin bài đầu tiên vào UI khi chạy
        this.loadCurrentSong()

    },

}
app.start()















