// グローバルに展開
phina.globalize();

///console.log = function () { };  // ログを出す時にはコメントアウトする

// 定数
const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 960;
const SCREEN_CENTER_X = SCREEN_WIDTH / 2;   // スクリーン幅の半分
const SCREEN_CENTER_Y = SCREEN_HEIGHT / 2;  // スクリーン高さの半分
const BALL_Y = 128 - 16 - 8;

const GAME_MODE = defineEnum({
    START_INIT: {
        value: 0,
        string: 'start_init'
    },
    START: {
        value: 1,
        string: 'start'
    },
    END_INIT: {
        value: 2,
        string: 'end_init'
    },
    END: {
        value: 3,
        string: 'end'
    },
});
const DROP_STATUS = defineEnum({
    WAIT_INIT: {
        value: 0,
        string: 'wait_init'
    },
    WAIT: {
        value: 1,
        string: 'wait'
    },
    DRAG_INIT: {
        value: 2,
        string: 'drag_init'
    },
    DRAG: {
        value: 3,
        string: 'drag'
    },
    DROP_INIT: {
        value: 4,
        string: 'drop_init'
    },
    DROP: {
        value: 5,
        string: 'drop'
    },
    DROP_END: {
        value: 6,
        string: 'drop_end'
    },
});
const BODY_TYPE = defineEnum({
    STATIC: {
        value: 0,
    },
    KINEMATIC: {
        value: 1,
    },
    DYNAMIC: {
        value: 2,
    },
});


// ボール定義用テーブル
const ballDefTable = [
    { name: "ball_00", size: 50.0 * 0.97, density: 1, point: 1 },
    { name: "ball_01", size: 60.2 * 0.97, density: 2, point: 3 },
    { name: "ball_02", size: 72.5 * 0.97, density: 3, point: 6 },
    { name: "ball_03", size: 87.3 * 0.97, density: 4, point: 10 },
    { name: "ball_04", size: 105.1 * 0.97, density: 5, point: 15 },
    { name: "ball_05", size: 126.5 * 0.97, density: 6, point: 21 },
    { name: "ball_06", size: 152.3 * 0.97, density: 7, point: 28 },
    { name: "ball_07", size: 183.4 * 0.97, density: 8, point: 36 },
    { name: "ball_08", size: 220.8 * 0.97, density: 9, point: 45 },
    { name: "ball_09", size: 265.9 * 0.97, density: 10, point: 55 },
    { name: "ball_10", size: 320.0 * 0.97, density: 11, point: 0 },
];

// Box2D用レイヤー
let b2dLayer = null;
// 表示プライオリティは 0：奥 → 9：手前 の順番
let group0 = null;  // BG
let group1 = null;  // ボール
let group2 = null;  // 壁
let group3 = null;  // 爆発

let nowScoreLabel = null;
let nowScore = 0;
let hgyCount = 0;
let bgSprite = null;

let ballArray = [];

let randomSeed = 3557;
let randomMode = true;

let contactIDList = []; // 衝突した物体のIDリスト

let b2dBallArray = [];
let b2dBodyIndex = 0;
let b2dBallOperationIdx = 0;
let spriteArray = [];

let createBallFlag = 0;
let nextBallKind = [0, 0];
let nextBallSprite = null;

/*
*/
phina.define('LoadingScene', {
    superClass: 'DisplayScene',

    init: function (options) {
        this.superInit(options);
        // 背景色
        this.backgroundColor = 'black';
        var self = this;
        var loader = phina.asset.AssetLoader();

        // 明滅するラベル
        let label = phina.display.Label({
            text: "",
            fontSize: 64,
            fill: 'white',
        }).addChildTo(this).setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);

        // ロードが進行したときの処理
        loader.onprogress = function (e) {
            // 進捗具合を％で表示する
            label.text = "{0}%".format((e.progress * 100).toFixed(0));
        };

        // ローダーによるロード完了ハンドラ
        loader.onload = function () {
            // Appコアにロード完了を伝える（==次のSceneへ移行）
            self.flare('loaded');
        };

        // ロード開始
        loader.load(options.assets);
    },

});

/*
 */
phina.define("InitScene", {
    // 継承
    superClass: 'DisplayScene',
    // 初期化
    init: function (option) {
        // 親クラス初期化
        this.superInit(option);
        // 背景色
        this.backgroundColor = 'black';
        // ラベル
        Label({
            text: '',
            fontSize: 48,
            fill: 'yellow',
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
    },
    update: function (app) {
        this.exit();
    }
});

/*
 */
phina.define("TitleScene", {
    // 継承
    superClass: 'DisplayScene',
    // 初期化
    init: function (option) {
        // 親クラス初期化
        this.superInit(option);
        // 背景色
        this.backgroundColor = 'black';

        // タイトルロゴ
        Sprite("title").addChildTo(this).setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y - 196).setSize(320 * 1.8, 178 * 1.8);

        // ラベル
        Label({
            text: ' \nGAME',
            fontSize: 160,
            fontFamily: "misaki_gothic",
            fill: 'white',
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
        Label({
            text: '',
            fontSize: 60,
            fontFamily: "misaki_gothic",
            fill: 'white',
        }).addChildTo(this).setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y + SCREEN_HEIGHT * 1 / 8);
        Label({
            text: 'TAP TO START',
            fontSize: 80,
            fontFamily: "misaki_gothic",
            fill: 'white',
        }).addChildTo(this).setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y + SCREEN_HEIGHT * 1 / 4);
    },
    // タッチで次のシーンへ
    onpointstart: function () {
        this.exit();
    },
});

/*
 */
phina.define("MainScene", {
    // 継承
    superClass: 'DisplayScene',
    // 初期化
    init: function () {
        that = this;

        // 親クラス初期化
        this.superInit();
        // 背景色
        this.backgroundColor = 'black';

        if (!randomMode) randomSeed = 3557;

        contactIDList = []; // 衝突した物体のIDリスト

        group0 = DisplayElement().addChildTo(this);   // BG
        group1 = DisplayElement().addChildTo(this);   // ボール
        group2 = DisplayElement().addChildTo(this);   // 壁
        group3 = DisplayElement().addChildTo(this);   // 爆発
        group4 = DisplayElement().addChildTo(this);   // ステータスs

        // ラベル設定
        nowScoreLabelStr = Label(
            {
                text: "スコア",
                fontSize: 32,
                //fontWeight: "bold",
                fontFamily: "misaki_gothic",
                align: "left",
                fill: "white",
                stroke: "white",
                strokeWidth: 1,
                shadow: "black",
                shadowBlur: 10,
            }
        ).addChildTo(group4).setPosition(16, 60);
        nowScoreLabel = Label(
            {
                text: "0",
                fontSize: 32,
                fontFamily: "misaki_gothic",
                align: "left",
                fill: "white",
                stroke: "white",
                strokeWidth: 1,
                shadow: "black",
                shadowBlur: 10,
            }
        ).addChildTo(group4).setPosition(16 + 128, 60);
        nextBallLabelStr = Label(
            {
                text: "ネクスト",
                fontSize: 32,
                fontFamily: "misaki_gothic",
                align: "left",
                fill: "white",
                stroke: "white",
                strokeWidth: 1,
                shadow: "black",
                shadowBlur: 10,
            }
        ).addChildTo(group4).setPosition(SCREEN_WIDTH - 128 - 64, 60);

        // Box2d用レイヤー作成
        b2dLayer = phina.box2d.Box2dLayer({
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
        }).addChildTo(this);
        console.log(">>>" + b2dLayer.world._scale);

        var contactListener = new Box2D.Dynamics.b2ContactListener();
        // コンタクトが開始したときに呼ばれるメソッド
        contactListener.BeginContact = function (contact) {
            // コンタクトが始まった時の処理
            // contactオブジェクトを使用して詳細な情報を取得できる
            console.log("BeginContact");
            var a = contact
                .GetFixtureA()
                .GetBody();
            var b = contact
                .GetFixtureB()
                .GetBody();
            contactIDList.push({ a: a, b: b });
        };
        // Worldにコンタクトリスナーをセット
        b2dLayer.world.SetContactListener(contactListener);

        // 背景
        bgSprite = Sprite("bg").addChildTo(group0).setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y + 96).setSize(145 * 4.5, 165 * 4.5);
        bgSprite.alpha = 0.0;
        // 容器を生成
        // ゲームオーバーライン
        {
            var shape = phina.display.RectangleShape().addChildTo(group2);
            shape.x = SCREEN_CENTER_X;
            shape.y = 210;
            shape.width = 640 - 22;
            shape.height = 5;
            shape.alpha = 1.0;
            shape.fill = "#FF0000";
            shape.stroke = "#FF0000";
            shape.strokeWidth = 0;
        }

        // 壁＆底
        var createFloor = function (x, y, width, height) {
            var shape = phina.display.RectangleShape().addChildTo(group2);
            shape.x = x;
            shape.y = y;
            shape.width = width;
            shape.height = height;
            shape.fill = "#FFFFFF";
            shape.stroke = "#FFFFFF";
            shape.cornerRadius = 4;
            shape.alpha = 1.0;
            b2dLayer.createBody({
                width: shape.width,
                height: shape.height,
                type: 'static',
                shape: 'box',
                userData: { idx: -1, kind: -1, deleted: false },
            }).attachTo(shape);
        }.bind(this);
        createFloor(5, 505, 10, 800);  // 左
        createFloor(635, 505, 10, 800); // 右
        createFloor(320, 900, 640, 10); // 底

        // 進化の図
        {
            for (let ii = 0; ii < 11; ii++) {
                Sprite(ballDefTable[ii].name).addChildTo(group1).setPosition(128 + 32 + (ii * 32), SCREEN_HEIGHT - 32).setSize(32, 32);
            }
            var shape = phina.display.RectangleShape().addChildTo(group0);
            shape.x = SCREEN_CENTER_X;
            shape.y = SCREEN_HEIGHT - 32;
            shape.width = 640;
            shape.height = 46;
            shape.alpha = 1.0;
            shape.fill = "#000000";
            shape.stroke = "#000000";
            shape.strokeWidth = 0;
        }

        b2dBallArray = [];
        b2dBodyIndex = 0;
        b2dBallOperationIdx = 0;

        spriteArray = [];

        nowScore = 0;
        hgyCount = 0;
        createBallFlag = true;
        nextBallKind = [0, myRandom(0, 4)];
        nextBallSprite = Sprite(ballDefTable[0].name).addChildTo(group1).setPosition(SCREEN_WIDTH - 32, 60).setSize(48, 48);
        gameMode = GAME_MODE.START_INIT;
    },
    update: function (app) {
        switch (gameMode) {
            case GAME_MODE.START_INIT:
                gameMode = GAME_MODE.START;
            // TRUE
            case GAME_MODE.START:
                {
                    if (createBallFlag) {
                        createBall(nextBallKind[0], this.gridX.center(), BALL_Y, true, "static");
                        nextBallKind.shift();
                        nextBallKind.push(myRandom(0, 4));
                        nextBallSprite.remove();
                        nextBallSprite = Sprite(ballDefTable[nextBallKind[0]].name).addChildTo(group1).setPosition(SCREEN_WIDTH - 32, 60).setSize(48, 48);
                        createBallFlag = false;
                    }
                    contactIDList.forEach(function (objs) {
                        let aBody = objs.a;
                        let bBody = objs.b;

                        // 今回落としたボールが何かに接触した？
                        if ((aBody.GetUserData().idx === b2dBallOperationIdx) || (bBody.GetUserData().idx === b2dBallOperationIdx)) {
                            // 次のボールをセット
                            spriteArray.forEach(function (tmpSprite) {
                                if (tmpSprite.ballIdx === b2dBallOperationIdx) {
                                    tmpSprite.dropStatus = DROP_STATUS.DROP_END;
                                }
                            })
                            createBallFlag = true;
                        }

                        // 同じ種類のボール同士が接触した？
                        if ((aBody.GetUserData().kind === bBody.GetUserData().kind)) {
                            // 片方でも既に削除済みならチェックしない
                            if (aBody.GetUserData().deleted === false && bBody.GetUserData().deleted === false) {
                                let kind = aBody.GetUserData().kind;
                                let aBodyPos = aBody.GetPosition();
                                let bBodyPos = bBody.GetPosition();

                                // スコア加算
                                nowScore += ballDefTable[kind].point;
                                nowScoreLabel.text = nowScore;
                                let tmpAlpha = nowScore / 9000.0;
                                if (tmpAlpha >= 1.0) tmpAlpha = 1.0;
                                bgSprite.alpha = tmpAlpha;

                                // kindが9以下ならkind+1のボールを中点に生成する
                                let xpos = ((aBodyPos.x + bBodyPos.x) / 2.0) * b2dLayer.world._scale;
                                let ypos = ((aBodyPos.y + bBodyPos.y) / 2.0) * b2dLayer.world._scale;
                                if (aBody.GetUserData().kind <= 9) {
                                    createBall(kind + 1, xpos, ypos, false, "dynamic");
                                    if (kind + 1 === 10) hgyCount++;
                                }

                                // obj.aとobj.bを消す
                                removeBopdy(aBody);
                                removeBopdy(bBody);

                                Explosion(xpos, ypos, ballDefTable[kind].size * 1.5).addChildTo(group3);
                                SoundManager.play("explosion_" + myRandom(0, 6));
                            }
                        }
                    });
                    contactIDList = [];
                    // 不要になった要素を配列から削除
                    b2dBallArray = b2dBallArray.filter(tmpBody => tmpBody.userData.deleted === false);
                    spriteArray = spriteArray.filter(tmpSprite => tmpSprite.deleted === false);

                    // ゲームオーバー判定
                    let isGameOver = false;
                    spriteArray.forEach(function (tmpSprite) {
                        if (tmpSprite.dropStatus === DROP_STATUS.DROP_END) {
                            if (tmpSprite.y + (tmpSprite.srcRect.height / 2) <= 210) {
                                isGameOver = true;
                            }
                        }
                    })
                    if (!isGameOver) {
                        break;
                    } else {
                        gameMode = GAME_MODE.END_INIT;
                        // THRU
                    }
                }
            case GAME_MODE.END_INIT:
                // 全部staticにする
                {
                    b2dBallArray.forEach(function (tmpBall) {
                        tmpBall.body.SetType(BODY_TYPE.STATIC.value);
                    })
                }
                gameMode = GAME_MODE.END;
                // TWEETボタンの表示
                tweetButton = Button(
                    {
                        text: "TWEET",
                        fontSize: 32,
                        fontFamily: "misaki_gothic",
                        align: "center",
                        baseline: "middle",
                        width: 150,
                        height: 75,
                        //fill: "#6A93CC",  // ボタン色
                        stroke: '#DEE3FF',  // 枠色
                        strokeWidth: 5,     // 枠太さ
                    }
                ).addChildTo(group4).setPosition(SCREEN_CENTER_X - (SCREEN_CENTER_X / 2), SCREEN_CENTER_Y + (SCREEN_CENTER_Y / 2)).onclick = function () {
                    let message = "HxGxYx GAME\nスコア: " + nowScore + "\n";
                    if (hgyCount >= 1) message += hgyCount + "平沢\n";
                    var twitterURL = phina.social.Twitter.createURL({
                        text: message,
                        hashtags: ["平沢グラインド唯"],
                        url: "https://iwasaku.github.io/test15/HGYG/",
                    });
                    window.open(twitterURL);
                };
                // RESTARTボタンの表示
                restartButton = Button(
                    {
                        text: "RESTART",
                        fontSize: 32,
                        fontFamily: "misaki_gothic",
                        align: "center",
                        baseline: "middle",
                        width: 150,
                        height: 75,
                        fill: "#6A93CC",
                        stroke: '#DEE3FF',         // 枠色
                        strokeWidth: 5,         // 枠太さ
                    }
                ).addChildTo(group4).setPosition(SCREEN_CENTER_X + (SCREEN_CENTER_X / 2), SCREEN_CENTER_Y + (SCREEN_CENTER_Y / 2)).onpush = function () {
                    that.exit();
                };
                gameOverLabel = Label(
                    {
                        text: "GAME OVER",
                        fontSize: 96,
                        fontFamily: "misaki_gothic",
                        align: "center",

                        fill: "white",
                        stroke: "white",
                        strokeWidth: 1,
                        shadow: "black",
                        shadowBlur: 10,
                    }
                ).addChildTo(group4).setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
                SoundManager.play("gameover");
            // TRUE
            case GAME_MODE.END:
                // GAME OVERの表示
                break;
        }
    }
});

phina.main(function () {
    var app = GameApp({
        startLabel: 'init',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        assets: ASSETS,
        // シーンのリストを引数で渡す
        scenes: [
            {
                className: 'InitScene',
                label: 'init',
                nextLabel: 'title',
            },

            {
                className: 'TitleScene',
                label: 'title',
                nextLabel: 'main',
            },
            {
                className: 'MainScene',
                label: 'main',
                nextLabel: 'main',
            },
        ]
    });

    // iOSなどでユーザー操作がないと音がならない仕様対策
    // 起動後初めて画面をタッチした時に『無音』を鳴らす
    app.domElement.addEventListener('touchend', function dummy() {
        var s = phina.asset.Sound();
        s.loadFromBuffer();
        s.play().stop();
        app.domElement.removeEventListener('touchend', dummy);
    });

    // fps表示
    //app.enableStats();
    app.run();
});

phina.define("Explosion", {
    // Spriteを継承
    superClass: 'Sprite',
    // 初期化
    init: function (xpos, ypos, size) {
        // 親クラスの初期化
        this.superInit('explosion', 48, 48);
        // SpriteSheetをスプライトにアタッチ
        var anim = FrameAnimation('explosion_ss').attachTo(this);
        // スプライトシートのサイズにフィットさせない
        anim.fit = false;
        //アニメーションを再生する
        anim.gotoAndPlay('start');
        // サイズ変更
        this.setSize(size, size);

        this.x = xpos;
        this.y = ypos;

        // 参照用
        this.anim = anim;
    },
    // 毎フレーム処理
    update: function () {
        if (gameMode === GAME_MODE.END) return;
        // アニメーションが終わったら自身を消去
        if (this.anim.finished) {
            this.remove();
        }
    },
});
// 
function createBall(kind, xpos, ypos, isDrop, bodyType) {
    let ballDef = ballDefTable[kind];
    let tmpSprite = Sprite(ballDef.name).addChildTo(group1);

    tmpSprite.setPosition(xpos, ypos);
    tmpSprite.setSize(ballDef.size, ballDef.size);    // b2dBodyも大きくなる
    tmpSprite.setScale(1.0, 1.0);   // スプライトだけ大きくなる
    tmpSprite.setInteractive(isDrop);
    tmpSprite.ballIdx = b2dBodyIndex;
    tmpSprite.kind = kind;
    tmpSprite.dropStatus = DROP_STATUS.WAIT;
    tmpSprite.deleted = false;

    if (isDrop) {
        tmpSprite.on('pointstart', function (e) {
            if (this.dropStatus != DROP_STATUS.WAIT) return;
            this.dropStatus = DROP_STATUS.DRAG;
        });
        tmpSprite.on('pointmove', function (e) {
            if (this.dropStatus != DROP_STATUS.DRAG) return;
            let ballDef = ballDefTable[this.kind];
            let tmpX = e.pointer.x;
            let tmpY = BALL_Y;
            let radius = ballDef.size / 2.0;
            if (tmpX <= (0 + 11) + radius) tmpX = (0 + 11) + radius;
            if (tmpX >= (SCREEN_WIDTH - 11) - radius) tmpX = (SCREEN_WIDTH - 11) - radius;
            var p = new b2.Vec2(tmpX / b2dLayer.world._scale, tmpY / b2dLayer.world._scale);
            b2dBallArray.forEach(function (tmpBody) {
                if (tmpBody.userData.idx === b2dBallOperationIdx) {
                    tmpBody.body.SetPosition(p);
                };
            });
        });
        tmpSprite.on('pointend', function (e) {
            this.setInteractive(false);
            this.dropStatus = DROP_STATUS.DROP;
            b2dBallArray.forEach(function (tmpBody) {
                if (tmpBody.userData.idx === b2dBallOperationIdx) {
                    tmpBody.body.SetType(BODY_TYPE.DYNAMIC.value);
                    var filter = new Box2D.Dynamics.b2FilterData();
                    filter.categoryBits = 0x0001;
                    tmpBody.body.GetFixtureList().SetFilterData(filter);
                };
            });
        });
    } else {
        this.dropStatus = DROP_STATUS.DROP_END;
    }

    // Box2dのデバッグ表示が見えるようにする
    tmpSprite.alpha = 0.5;  // FIXME:あとで1.0にする
    tmpSprite.alpha = 1.0;

    // Box2dオブジェクトを作成してballにアタッチ
    let tmpBody = b2dLayer.createBody({
        type: bodyType,
        shape: 'circle',
        density: ballDef.density,
        friction: 0.1,
        restitution: 0.2,
        userData: { idx: b2dBodyIndex, kind: kind, deleted: false },
    }).attachTo(tmpSprite);
    if (isDrop) {
        var filter = new Box2D.Dynamics.b2FilterData();
        filter.categoryBits = 0x0000;
        tmpBody.body.GetFixtureList().SetFilterData(filter);
    }
    // groupIndex: 1,
    // categoryBits: 1,
    // maskBits: 1
    b2dBallArray.push(tmpBody);
    spriteArray.push(tmpSprite);

    if (isDrop) {
        b2dBallOperationIdx = b2dBodyIndex;
    }
    b2dBodyIndex++;
}

function removeBopdy(body) {
    let idx = body.GetUserData().idx;
    b2dLayer.world.DestroyBody(body);
    body.GetUserData().deleted = true;
    spriteArray.forEach(function (tmpSprite) {
        if (tmpSprite.ballIdx === idx) {
            tmpSprite.deleted = true;
            tmpSprite.remove();
        }
    })
}

// 指定の範囲で乱数を求める
// ※start <= end
// ※startとendを含む
function myRandom(start, end) {
    if (start === end) {
        return start;
    }

    if (randomMode) {
        let max = (end - start) + 1;
        return Math.floor(Math.random() * Math.floor(max)) + start;
    } else {
        let mod = (end - start) + 1;
        randomSeed = (randomSeed * 5) + 1;
        for (; ;) {
            if (randomSeed < 2147483647) break;
            randomSeed -= 2147483647;
        }
        return (randomSeed % mod) + start;
    }
}