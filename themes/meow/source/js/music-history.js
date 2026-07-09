document.addEventListener('DOMContentLoaded', function () {
    // 1. 让全局播放器支持记忆功能
    var checkGlobalPlayer = setInterval(function() {
        var globalMeting = document.querySelector('#music-player meting-js, .aplayer-fixed meting-js');
        if (globalMeting && globalMeting.aplayer) {
            clearInterval(checkGlobalPlayer);
            var globalAP = globalMeting.aplayer;

            // 强制开启 APlayer 的存储历史功能
            globalAP.options.storageName = 'meow-blog-music-history';
            
            // 从本地缓存恢复播放状态和进度
            var history = JSON.parse(localStorage.getItem('meow-blog-music-history'));
            if (history) {
                globalAP.list.switch(history.index);
                globalAP.seek(history.currentTime);
                globalAP.volume(history.volume, true);
                // 如果上一页是在播放状态，新页面自动接着播
                if (!history.paused) {
                    globalAP.play();
                }
            }

            // 每次播放时间更新时，自动同步到缓存
            globalAP.on('timeupdate', function () {
                var status = {
                    index: globalAP.list.index,
                    currentTime: globalAP.audio.currentTime,
                    volume: globalAP.audio.volume,
                    paused: globalAP.audio.paused
                };
                localStorage.setItem('meow-blog-music-history', JSON.stringify(status));
            });
        }
    }, 300);

    // 2. 核心联动：如果文章内有新的单独播放器播放，暂停全局播放器
    var checkArticlePlayer = setInterval(function() {
        var globalMeting = document.querySelector('#music-player meting-js, .aplayer-fixed meting-js');
        var articleMeting = document.querySelector('main meting-js'); 

        if (globalMeting && articleMeting && globalMeting.aplayer && articleMeting.aplayer) {
            clearInterval(checkArticlePlayer);
            var globalAP = globalMeting.aplayer;
            var articleAP = articleMeting.aplayer;

            // 监听文章内播放器的播放事件
            articleAP.on('play', function () {
                if (!globalAP.audio.paused) {
                    globalAP.pause();
                    console.log('检测到文章内音乐开始播放，已自动暂停全局播放器。');
                }
            });
        }
    }, 500);
});