var ASSETS = {
    font: {
        misaki_gothic: "https://cdn.leafscape.be/misaki/misaki_gothic_web.woff2"
    },
    image: {
        "ball_00": "./resource/ball_00.png?20231220",
        "ball_01": "./resource/ball_01.png?20231220",
        "ball_02": "./resource/ball_02.png?20231220",
        "ball_03": "./resource/ball_03.png?20231220",
        "ball_04": "./resource/ball_04.png?20231220",
        "ball_05": "./resource/ball_05.png?20231220",
        "ball_06": "./resource/ball_06.png?20231220",
        "ball_07": "./resource/ball_07.png?20231220",
        "ball_08": "./resource/ball_08.png?20231220",
        "ball_09": "./resource/ball_09.png?20231220",
        "ball_10": "./resource/ball_10.png?20231220",

        "explosion": "./resource/expl_48.png",
        "title": "./resource/hxgxyx.png",
    },
    spritesheet: {
        "explosion_ss":
        {
            // フレーム情報
            "frame": {
                "width": 48, // 1フレームの画像サイズ（横）
                "height": 48, // 1フレームの画像サイズ（縦）
                "cols": 11, // フレーム数（横）
                "rows": 1, // フレーム数（縦）
            },
            // アニメーション情報
            "animations": {
                "start": { // アニメーション名
                    "frames": Array.range(11), // フレーム番号範囲[0,1,2]の形式でもOK
                    "next": "", // 次のアニメーション。空文字列なら終了。同じアニメーション名ならループ
                    "frequency": 1, // アニメーション間隔
                },
            }
        },
    },
    sound: {
        "explosion_0": "https://iwasaku.github.io/test8/COKS/resource/explosion_0.mp3",
        "explosion_1": "https://iwasaku.github.io/test8/COKS/resource/explosion_1.mp3",
        "explosion_2": "https://iwasaku.github.io/test8/COKS/resource/explosion_2.mp3",
        "explosion_3": "https://iwasaku.github.io/test8/COKS/resource/explosion_3.mp3",
        "explosion_4": "https://iwasaku.github.io/test8/COKS/resource/explosion_4.mp3",
        "explosion_5": "https://iwasaku.github.io/test8/COKS/resource/explosion_5.mp3",
        "explosion_6": "https://iwasaku.github.io/test8/COKS/resource/explosion_6.mp3",
        "gameover": "https://iwasaku.github.io/test11/UT-404/SSS2/resource/t02/12.mp3",
    },
};
