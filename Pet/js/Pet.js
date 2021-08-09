var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("ts/PhysicsObject", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PhysicsObject {
        constructor(x, y, width, height) {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
            this.speedX = 0;
            this.speedY = 0;
            this.onDrawFunctions = [];
            this.onPhysicsUpdateFunctions = [];
            this.onBounceFunctions = [];
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.onPhysicsUpdateFunctions.push(() => {
                this.x += this.speedX;
                this.y += this.speedY;
            });
        }
        applyAcceleration(angleInRads, amount) {
            this.speedX += Math.cos(angleInRads) * amount;
            this.speedY += Math.sin(angleInRads) * amount;
        }
        move(x, y) {
            this.x += x;
            this.y += y;
        }
        getDirectionAngle() { return Math.atan2(this.speedY, this.speedX); }
        getSpeed() {
            return Math.sqrt((this.speedX * this.speedX) + (this.speedY * this.speedY));
        }
        onPhysicsUpdate() {
            for (var i = 0; i < this.onPhysicsUpdateFunctions.length; ++i) {
                this.onPhysicsUpdateFunctions[i](this);
            }
        }
        onBounce() {
            for (var i = 0; i < this.onBounceFunctions.length; ++i) {
                this.onBounceFunctions[i](this);
            }
        }
        draw(context) {
            for (var i = 0; i < this.onDrawFunctions.length; ++i)
                this.onDrawFunctions[i](this, context);
        }
        drawAsRect(color, context) {
            context.fillStyle = color;
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    exports.default = PhysicsObject;
});
define("ts/PhysicsBox", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PhysicsBox {
        constructor(x, y, width, height) {
            this.physicsObjects = [];
            this.gravity = .5;
            this.gravityDirectionInRads = Math.PI / 2;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        addObject(obj) {
            this.updateObjBounds(obj);
            this.physicsObjects.push(obj);
        }
        updateObjPhysics(obj) {
            obj.applyAcceleration(this.gravityDirectionInRads, this.gravity);
            obj.onPhysicsUpdate();
        }
        updateObjBounds(obj) {
            let getCoordUpdate = (c, speed, size, minBound, boundSize) => {
                let bounce = false;
                let maxBound = minBound + boundSize;
                if (c < minBound) {
                    bounce = true;
                    c = minBound;
                    speed *= -1;
                }
                else if ((c + size) > maxBound) {
                    bounce = true;
                    c = maxBound - size;
                    speed *= -1;
                }
                return { c: c, speed: speed, bounced: bounce };
            };
            let updatedX = getCoordUpdate(obj.x, obj.speedX, obj.width, this.x, this.width);
            let updatedY = getCoordUpdate(obj.y, obj.speedY, obj.height, this.y, this.height);
            obj.x = updatedX.c;
            obj.y = updatedY.c;
            obj.speedX = updatedX.speed;
            obj.speedY = updatedY.speed;
            if (updatedX.bounced || updatedY.bounced)
                obj.onBounce();
        }
        updatePhysics() {
            for (var i = 0; i < this.physicsObjects.length; ++i) {
                this.updateObjPhysics(this.physicsObjects[i]);
                this.updateObjBounds(this.physicsObjects[i]);
            }
        }
        drawAsRect(innerColor, outerColor, context) {
            const margin = 5;
            context.fillStyle = outerColor;
            context.fillRect(this.x - margin, this.y - margin, this.width + (margin * 2), this.height + (margin * 2));
            context.fillStyle = innerColor;
            context.fillRect(this.x, this.y, this.width, this.height);
        }
        drawObjects(context) {
            for (var i = 0; i < this.physicsObjects.length; ++i) {
                this.physicsObjects[i].draw(context);
            }
        }
    }
    exports.default = PhysicsBox;
});
define("ts/Mathz", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Mathz {
        // Wrap a number using the slow method.
        static slowWrap(min, max, val) {
            if (min >= max)
                throw 'Min is greater than or equal to max!';
            let diff = Math.abs(max - min);
            while (val < min) {
                val += diff;
            }
            while (val > max) {
                val -= diff;
            }
        }
    }
    exports.default = Mathz;
});
define("ts/NameGenerator", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class NameGenerator {
        static generateRomajiName(minChars, maxChars) {
            let name = "";
            //let minChars: number = 3;
            //let maxChars: number = minChars + Math.random() * 10;
            let combos = [
                "A", "I", "E", "U", "O", "KA", "KI", "KU", "KE", "KO",
                "SA", "SHI", "SU", "SE", "SO", "TA", "CHI", "TSU", "TE", "TO",
                "CHA", "CHU", "CHO", "NA", "NI", "NU", "NE", "NO", "NYA", "NYU",
                "NYO", "HA", "HI", "HU", "HE", "HO", "HYA", "HYU", "HYO", "MA",
                "MI", "MU", "ME", "MO", "MYA", "MYU", "MYO", "YA", "YU", "YO",
                "RA", "RI", "RU", "RE", "RO", "RYA", "RYU", "RYO", "WA", "WI",
                "WE", "WO", "GA", "GI", "GU", "GE", "GO", "ZA", "JI", "ZU",
                "ZE", "ZO", "DA", "JI", "DU", "DE", "DO", "BA", "BI", "BU",
                "BE", "BO", "PA", "PI", "PU", "PE", "PO", "N"
            ];
            while (name.length < maxChars) {
                let combo = combos[Math.floor(Math.random() * (combos.length - 1))];
                if (name.length == 0 && combo == "N")
                    continue;
                name += combo;
            }
            name = name[0] + name.substring(1, name.length).toLowerCase();
            return name;
        }
    }
    exports.default = NameGenerator;
});
define("ts/SquarePetEyeBlink", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SquarePetEyeBlink {
        constructor() {
            this.blinkDur = Math.floor(Math.random() * 10);
            this.blinkRem = 0;
            this.blinkFreq = 50 + Math.floor(Math.random() * 50);
            this.blinkLotto = Math.floor(Math.random() * this.blinkFreq);
        }
    }
    exports.default = SquarePetEyeBlink;
});
define("ts/SquarePetEyes", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SquarePetEyes {
        constructor(squarePetWidth, squarePetHeight) {
            this.eyeSpringBackMultiplier = .8;
            this.eyeDistFromCenter = 0;
            this.eyeDistFromCenterTarget = 0;
            this.eyeAngleTarget = 0;
            this.eyeAngle = 0; //po.getDirectionAngle();
            this.eyeSpeed = 0;
            this.eyeAccel = Math.PI / 360;
            this.eyeMarginX = squarePetWidth / 3;
            this.eyeMarginY = squarePetHeight / 4;
            this.eyeSize = Math.min(squarePetWidth, squarePetHeight) / 3 / 2;
            this.eyeMoveRarity = SquarePetEyes.minEyeMoveRarity + Math.floor(Math.random() * SquarePetEyes.maxEyeMoveRarity);
            this.eyeMoveLotto = SquarePetEyes.minEyeMoveRarity + Math.floor(Math.random() * this.eyeMoveRarity);
        }
    }
    exports.default = SquarePetEyes;
    SquarePetEyes.minEyeMoveRarity = 5;
    SquarePetEyes.maxEyeMoveRarity = 100;
});
define("ts/SquarePetSleep", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SquarePetSleep {
        constructor() {
            this.sleepingRem = 0;
            this.sleepingChanceMax = 2000;
            this.sleepingChance = Math.floor(Math.random() * this.sleepingChanceMax);
            this.sleepingGap = 100 + Math.floor(Math.random() * 500);
            this.zzzToggleFlipRem = 10;
            this.zzzToggleFlip = 0;
        }
    }
    exports.default = SquarePetSleep;
});
define("ts/SquarePet", ["require", "exports", "ts/Mathz", "ts/NameGenerator", "ts/PhysicsObject", "ts/SquarePetEyeBlink", "ts/SquarePetEyes", "ts/SquarePetSleep"], function (require, exports, Mathz_1, NameGenerator_1, PhysicsObject_1, SquarePetEyeBlink_1, SquarePetEyes_1, SquarePetSleep_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Mathz_1 = __importDefault(Mathz_1);
    NameGenerator_1 = __importDefault(NameGenerator_1);
    PhysicsObject_1 = __importDefault(PhysicsObject_1);
    SquarePetEyeBlink_1 = __importDefault(SquarePetEyeBlink_1);
    SquarePetEyes_1 = __importDefault(SquarePetEyes_1);
    SquarePetSleep_1 = __importDefault(SquarePetSleep_1);
    function getRandomSquarePetColor() {
        let colors = [
            'red', 'blue', 'yellow', 'green', 'white', 'black', 'orange', 'purple',
            'Cornsilk', 'Aqua', 'Crimson', 'DarkGoldenRod', 'DarkOliveGreen',
            'DarkOrchid', 'DarkMagenta', 'DarkSeaGreen', 'DeepSkyBlue', 'GreenYellow',
            'HotPink'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    class SquarePet extends PhysicsObject_1.default {
        constructor(pb) {
            super(pb.x + pb.width / 2, pb.y + pb.height / 2, 10 + Math.random() * 100, 10 + Math.random() * 100);
            this.name = NameGenerator_1.default.generateRomajiName(3, 3 + Math.random() * 10);
            this.color = getRandomSquarePetColor();
            this.secondaryColor = getRandomSquarePetColor();
            this.eyes = new SquarePetEyes_1.default(this.width, this.height);
            this.sleep = new SquarePetSleep_1.default();
            this.eyeBlink = new SquarePetEyeBlink_1.default();
            this.bounce = Math.random();
            this.chanceBumpRarity = 40 + Math.floor(Math.random() * 100);
            this.chanceBump = Math.floor(Math.random() * this.chanceBumpRarity);
            this.chanceBumpSpeed = 5 + Math.floor(Math.random() * 10);
            this.onPhysicsUpdateFunctions.push(this.physicsUpdateFunction);
            this.onBounceFunctions.push(this.bounceFunction);
            this.onDrawFunctions.push(this.drawFunction);
        }
        bounceFunction(p) {
            p.applyAcceleration(p.getDirectionAngle(), -(p.getSpeed() * .25));
            p.applyAcceleration(p.getDirectionAngle(), -(p.getSpeed() * .25));
        }
        isAwake() { return this.sleep.sleepingRem <= 0; }
        isAsleep() { return this.sleep.sleepingRem > 0; }
        sleepUpdate(p) {
            if (p.isAsleep()) {
                --p.sleep.sleepingRem;
                if (--p.sleep.zzzToggleFlipRem == 0) {
                    p.sleep.zzzToggleFlipRem = 10;
                    if (p.sleep.zzzToggleFlip == 0) {
                        p.sleep.zzzToggleFlip = 1;
                    }
                    else if (p.sleep.zzzToggleFlip == 1) {
                        p.sleep.zzzToggleFlip = 0;
                    }
                }
            }
            else {
                if (Math.floor(Math.random() * p.sleep.sleepingChanceMax) ==
                    p.sleep.sleepingChance) {
                    p.sleep.sleepingGap = 100 + Math.floor(Math.random() * 500);
                    p.sleep.sleepingRem = p.sleep.sleepingGap;
                }
            }
        }
        eyeBlinkUpdate(p) {
            if (p.isAwake()) {
                if (p.eyeBlink.blinkRem > 0) {
                    --p.eyeBlink.blinkRem;
                }
                else {
                    if (Math.floor(Math.random() * p.eyeBlink.blinkFreq) ==
                        p.eyeBlink.blinkLotto) {
                        p.eyeBlink.blinkRem = p.eyeBlink.blinkDur;
                    }
                }
            }
        }
        eyeUpdate(p) {
            let e = p.eyes;
            let pSpeed = p.getSpeed();
            let pAngle = p.getDirectionAngle();
            if (Math.abs(pSpeed) > p.chanceBumpSpeed / 3) {
                e.eyeAngleTarget = (e.eyeAngleTarget + pAngle) / 2;
                e.eyeDistFromCenterTarget = (e.eyeDistFromCenterTarget + (pSpeed / p.chanceBumpSpeed * (e.eyeSize / 2))) / 2;
            }
            if (Math.floor(Math.random() * e.eyeMoveRarity) == e.eyeMoveLotto) {
                e.eyeAngleTarget = (e.eyeAngleTarget + (-Math.PI + Math.random() * (Math.PI * 2)) / 2);
                e.eyeDistFromCenterTarget = (e.eyeDistFromCenterTarget + (Math.random() * (e.eyeSize / 2))) / 2;
            }
            e.eyeAngle = (e.eyeAngleTarget + e.eyeAngle) / 2;
            e.eyeDistFromCenter = (e.eyeDistFromCenterTarget + e.eyeDistFromCenter) / 2;
            Mathz_1.default.slowWrap(-Math.PI, Math.PI, e.eyeAngle);
            Mathz_1.default.slowWrap(-Math.PI, Math.PI, e.eyeAngleTarget);
            /*
                let speed = p.getSpeed();
                e.eyeAngleTarget = p.getDirectionAngle();
            */
            /*
            if (e.eyeAngle < e.eyeAngleTarget) {
              e.eyeSpeed += e.eyeAccel * (speed / p.chanceBumpSpeed);
              e.eyeAngle += e.eyeSpeed;
        
              if (e.eyeAngle >= e.eyeAngleTarget) {
                e.eyeAngle = e.eyeAngleTarget;
                e.eyeSpeed = 0;
              }
            } else if (e.eyeAngle > e.eyeAngleTarget) {
              e.eyeSpeed -= e.eyeAccel * (speed / p.chanceBumpSpeed);
              e.eyeAngle += e.eyeSpeed;
        
              if (e.eyeAngle <= e.eyeAngleTarget) {
                e.eyeAngle = e.eyeAngleTarget;
                e.eyeSpeed = 0;
              }
            }
            */
            // let diffAngle = angle - eyeAngle;
            //e.eyeDistFromCenter = Math.abs((e.eyeSpeed * 10 * (e.eyeSize / 2)));
            if (e.eyeDistFromCenter > e.eyeSize / 2)
                e.eyeDistFromCenter = e.eyeSize / 2;
        }
        bumpUpdate(p) {
            if (p.isAwake()) {
                if (Math.floor(Math.random() * p.chanceBumpRarity) == p.chanceBump) {
                    p.eyeBlink.blinkRem = p.eyeBlink.blinkDur;
                    p.applyAcceleration(Math.PI / 4 + Math.random() * (Math.PI / 4 * 3), p.chanceBumpSpeed);
                }
            }
        }
        physicsUpdateFunction(p) {
            p.sleepUpdate(p);
            p.eyeBlinkUpdate(p);
            p.bumpUpdate(p);
            p.eyeUpdate(p);
        }
        drawFunction(p, ctx) {
            // Create gradient
            var grd = ctx.createLinearGradient(p.x, p.y + p.height, p.x + p.width, p.y + p.height);
            // Set the square's gradient with its primary and secondary colors.
            grd.addColorStop(0, p.color);
            grd.addColorStop(1, p.secondaryColor); //'black');
            // Fill the square with gradient.
            ctx.fillStyle = grd;
            ctx.fillRect(p.x, p.y, p.width, p.height);
            // Calculate eye positions.
            let eyeX1 = p.x + p.eyes.eyeMarginX;
            let eyeX2 = p.x + p.width - p.eyes.eyeMarginX;
            let eyeY = p.y + p.eyes.eyeMarginY;
            // Determine the eye white color - sleeping or not?
            let eyeWhiteColor = (p.sleep.sleepingRem > 0 || p.eyeBlink.blinkRem > 0) ? 'black' : 'white';
            // Draw the first eye whites.
            ctx.beginPath();
            ctx.arc(eyeX1, eyeY, p.eyes.eyeSize, 0, 2 * Math.PI, false);
            ctx.lineWidth = 3;
            ctx.fillStyle = eyeWhiteColor;
            ctx.fill();
            // Draw the second eye whites.
            ctx.beginPath();
            ctx.arc(eyeX2, eyeY, p.eyes.eyeSize, 0, 2 * Math.PI, true);
            ctx.lineWidth = 3;
            ctx.fillStyle = eyeWhiteColor;
            ctx.fill();
            // Draw the first eye pupil.
            ctx.beginPath();
            ctx.arc(eyeX1 + Math.cos(p.eyes.eyeAngle) * p.eyes.eyeDistFromCenter, eyeY + Math.sin(p.eyes.eyeAngle) * p.eyes.eyeDistFromCenter, p.eyes.eyeSize / 2, 0, 2 * Math.PI, true);
            ctx.lineWidth = p.eyes.eyeSize / 4;
            ctx.fillStyle = '#000000';
            ctx.fill();
            // Draw the second eye pupil.
            ctx.beginPath();
            ctx.arc(eyeX2 + Math.cos(p.eyes.eyeAngle) * p.eyes.eyeDistFromCenter, eyeY + Math.sin(p.eyes.eyeAngle) * p.eyes.eyeDistFromCenter, p.eyes.eyeSize / 2, 0, 2 * Math.PI, true);
            ctx.lineWidth = p.eyes.eyeSize / 4;
            ctx.fillStyle = '#000000';
            ctx.fill();
            // Update Zz's if sleeping.
            if (p.isAsleep()) {
                let yOffset = 0;
                let xOffset = 0;
                if (p.sleep.zzzToggleFlip == 0) {
                    ctx.font = '15px serif';
                    yOffset = -10;
                }
                else {
                    ctx.font = "25px serif";
                    yOffset = -20;
                    xOffset = -10;
                }
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText("Z", p.x + xOffset, p.y + yOffset);
            }
        }
    }
    exports.default = SquarePet;
});
define("ts/PetGame", ["require", "exports", "ts/PhysicsBox", "ts/SquarePet"], function (require, exports, PhysicsBox_1, SquarePet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    PhysicsBox_1 = __importDefault(PhysicsBox_1);
    SquarePet_1 = __importDefault(SquarePet_1);
    class PetGame {
        constructor() {
            this.sleepTimeMs = 16;
        }
        drawBackground(color, canvas, context) {
            context.fillStyle = color;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
        run() {
            return __awaiter(this, void 0, void 0, function* () {
                let canvas = document.getElementById('draw_canvas');
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
                let context = canvas.getContext('2d');
                let boxes = [];
                let boxStartX = 100;
                let lastBoxX = boxStartX;
                let lastBoxY = 100;
                let boxWidth = 150;
                let boxHeight = 150;
                let boxSpacing = 30;
                // var img = new Image(50, 50);
                // img.src =
                // "https://animals.net/wp-content/uploads/2018/08/Tanuki-3-650x425.jpg";
                let addBox = () => {
                    let pb = new PhysicsBox_1.default(lastBoxX, lastBoxY, boxWidth, boxHeight);
                    let sp = new SquarePet_1.default(pb);
                    sp.onDrawFunctions.push((p, ctx) => {
                        // ctx.drawImage(img, p.x, p.y);
                        ctx.font = '15px serif';
                        ctx.fillStyle = '#acc0c3';
                        ctx.fillText(p.name, pb.x, pb.y - 10);
                    });
                    pb.addObject(sp);
                    lastBoxX += boxWidth + boxSpacing;
                    if (lastBoxX + boxWidth > canvas.width) {
                        lastBoxY += boxHeight + boxSpacing;
                        lastBoxX = boxStartX;
                    }
                    boxes.push(pb);
                };
                while (lastBoxY + boxHeight < canvas.height)
                    addBox();
                while (true) {
                    this.drawBackground('#3e4b4d', canvas, context);
                    for (var i = 0; i < boxes.length; ++i) {
                        boxes[i].updatePhysics();
                        boxes[i].drawAsRect('#a0a08f', '#63635a', context);
                        boxes[i].drawObjects(context);
                    }
                    yield new Promise(resolve => setTimeout(resolve, this.sleepTimeMs));
                }
            });
        }
    }
    exports.default = PetGame;
});
define("Pet", ["require", "exports", "ts/PetGame"], function (require, exports, PetGame_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    PetGame_1 = __importDefault(PetGame_1);
    let petGame = new PetGame_1.default();
    petGame.run();
});
