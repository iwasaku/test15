var ASSETS = {
    font: {
        misaki_gothic: "https://cdn.leafscape.be/misaki/misaki_gothic_web.woff2"
    },
    image: {
        "ball_00": "./resource/ball_00.png",
        "ball_01": "./resource/ball_01.png",
        "ball_02": "./resource/ball_02.png",
        "ball_03": "./resource/ball_03.png",
        "ball_04": "./resource/ball_04.png",
        "ball_05": "./resource/ball_05.png",
        "ball_06": "./resource/ball_06.png",
        "ball_07": "./resource/ball_07.png",
        "ball_08": "./resource/ball_08.png",
        "ball_09": "./resource/ball_09.png",
        "ball_10": "./resource/ball_10.png",

        "explosion": "./resource/expl_48.png",
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
        "explosion": "https://iwasaku.github.io/test10/PRJNTK/resource/se/se_explode08.mp3",
        "shot": "https://iwasaku.github.io/test10/PRJNTK/resource/se/laser2.mp3",
        "item": "https://iwasaku.github.io/test7/NEMLESSSTER/resource/coin05.mp3",
    },
};
