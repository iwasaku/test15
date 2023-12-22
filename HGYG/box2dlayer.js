/**
 * @class phina.box2d.Box2dLayer
 * @extends phina.display.Layer
 */
phina.define('phina.box2d.Box2dLayer', {
    superClass: 'phina.display.CanvasLayer',


    init: function (params) {
        this.superInit(params);

        params = (params || {}).$safe({
            worldScale: 50, // or 50
        });

        // 重力と物理世界の設定
        var gravity = new b2.Vec2(0, 9.8);
        var world = new b2.World(gravity, true);

        this.world = world;
        this.world._scale = params.worldScale;

        this._setupDebugDraw();
    },

    _setupDebugDraw: function () {
        // デバッグ用スプライト
        var debugDraw = new b2.DebugDraw();
        debugDraw.SetSprite(this.canvas.context);
        debugDraw.SetDrawScale(this.world._scale);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetAlpha(1);
        debugDraw.SetFillAlpha(0.4);
        debugDraw.SetFlags(b2.DebugDraw.e_shapeBit);
        this.world.SetDebugDraw(debugDraw);
    },

    createBody: function (params) {
        params.world = this.world;
        var body = phina.box2d.Box2dBody(params);
        return body;
    },

    update: function (app) {
        var timeStep = app.ticker.deltaTime / 1000;
        var velocityIterations = 10;
        var positionIterations = 10;
        // 物理空間の更新
        this.world.Step(timeStep, velocityIterations, positionIterations);
    },

    draw: function (canvas) {
        // debug画面の更新
        //this.world.ClearForces();
        //this.world.ClearForces();
        //this.world.DrawDebugData();
        //var domElement = this.canvas.domElement;
        //canvas.context.drawImage(domElement, 0, 0, domElement.width, domElement.height);
    },

    getWorld: function () {
        return this.world;
    },

});