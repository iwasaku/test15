var ASSETS = {
    font: {
        misaki_gothic: "https://cdn.leafscape.be/misaki/misaki_gothic_web.woff2"
    },
    image: {
        "ball_00": "./resource/krag00.png?20240522",
        "ball_01": "./resource/krag01.png?20240522",
        "ball_02": "./resource/krag02.png?20240522",
        "ball_03": "./resource/krag03.png?20240522",
        "ball_04": "./resource/krag04.png?20240522",
        "ball_05": "./resource/krag05.png?20240522",
        "ball_06": "./resource/krag06.png?20240522",
        "ball_07": "./resource/krag07.png?20240522",
        "ball_08": "./resource/krag08.png?20240522",
        "ball_09": "./resource/krag09.png?20240522",
        "ball_10": "./resource/krag10.png?20240522",

        "explosion": "../HGYG/resource/expl_48.png",

        "bg": "./resource/bg.jpg",
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
        "hit": "./resource/pa.mp3",
        "gameover": "https://iwasaku.github.io/test11/UT-404/SSS2/resource/t02/12.mp3",
    },
};
