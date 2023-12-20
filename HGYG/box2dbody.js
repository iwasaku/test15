// fixture.density、fixture.friction、fixture.restitution をcreateBodyの引数で設定できるようにした

/**
 * @class phina.box2d.Box2dBody
 * @extends phina.accessory.Accessory
 */
phina.define('phina.box2d.Box2dBody', {
    superClass: 'phina.accessory.Accessory',


    init: function (params) {
        this.superInit();

        this.world = params.world;
        this.type = params.type;
        this.shape = params.shape;
        this.density = params.density == null ? 0.0 : params.density;
        this.friction = params.friction == null ? 0.2 : params.friction;
        this.restitution = params.restitution == null ? 0.0 : params.restitution;
        this.userData = params.userData == null ? { idx: -1, kind: -1 } : params.userData;

        this._init();
        this.body.SetUserData(this.userData);

        this.on('attached', function () {
            var target = this.target;

            var p = new b2.Vec2(target.x / this.world._scale, target.y / this.world._scale);
            this.body.SetPosition(p);
            this.body.SetAngle(target.rotation * Math.PI / 180);

            this._bindFixture(this.target);
        });
    },

    update: function (app) {
        var target = this.target;

        target.x = this.body.GetPosition().x * this.world._scale;
        target.y = this.body.GetPosition().y * this.world._scale;
        target.rotation = this.body.GetAngle() * 180 / Math.PI;
    },

    _init: function () {
        this._setupBody();
        return this;
    },

    _setupBody: function () {
        var self = this;
        var world = this.world;
        var scale = world._scale;
        var bodyDef = new b2.BodyDef();
        bodyDef.type = (function () {
            return {
                'dynamic': b2.Body.b2_dynamicBody,
                'kinematic': b2.Body.b2_kinematicBody,
                'static': b2.Body.b2_staticBody,
            }[self.type || 'dynamic'];
        })();
        bodyDef.position.Set(0, 0);
        var body = world.CreateBody(bodyDef);
        this.body = body;

        return this;
    },

    _bindFixture: function () {
        var self = this;
        var target = this.target;
        var fixture = this.body.GetFixtureList();
        if (fixture) {
            this.body.DestroyFixture(fixture);
        }
        // 
        var world = this.world;
        var scale = world._scale;
        // shape を取得
        var shape = (function () {
            var shape = null;
            if (self.shape === 'circle') {
                shape = new b2.CircleShape(target.radius / scale);
            }
            else if (self.shape === 'box') {
                shape = new b2.PolygonShape();
                shape.SetAsBox(target.width / scale / 2, target.height / scale / 2);
            }
            else {
                shape = new b2.CircleShape(32 / scale);
            }
            return shape;
        })();

        var fixture = new b2.FixtureDef();
        fixture.shape = shape;
        fixture.density = self.density;
        fixture.friction = self.friction;
        fixture.restitution = self.restitution;
        this.body.CreateFixture(fixture);
    },
});
