document.addEventListener("DOMContentLoaded", function () {
    var elem = document.querySelector(".sidenav");
    M.Sidenav.init(elem);
    var instance = M.Sidenav.getInstance(elem);
    var themeSwitch1 = document.getElementById("themeSwitch1");
    var themeSwitch2 = document.getElementById("themeSwitch2");
    themeSwitch1.onchange = () => {
        document.documentElement.classList.toggle("dark-theme");
        themeSwitch2.querySelector("input").checked = !themeSwitch2.querySelector("input").checked;
    };
    themeSwitch2.onchange = () => {
        document.documentElement.classList.toggle("dark-theme");
        themeSwitch1.querySelector("input").checked = !themeSwitch1.querySelector("input").checked;
    };

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark-theme");
        themeSwitch1.querySelector("input").checked = true;
        themeSwitch2.querySelector("input").checked = true;
    }

    var canvas = document.querySelector("canvas");
    var cx = canvas.getContext("2d");

    var cv = {};

    cv.w = 320;
    cv.h = 320;

    canvas.width = cv.w;
    canvas.height = cv.h;

    var p = {};

    p.w = 20;
    p.h = 20;
    p.x = cv.w / 2;
    p.y = cv.h / 2;
    p.vx = 0;
    p.vy = 0;
    p.b = [];

    var sx = 0;
    var sy = 0;
    var mx = 0;
    var my = 0;
    var dx = 0;
    var dy = 0;

    var f = {};
    f.w = 20;
    f.h = 20;
    f.x = 0;
    f.y = 0;

    function s() {
        cx.fillRect(p.x, p.y, p.w, p.h);
        gf();
    }

    function l() {
        if (p.x + p.vx >= 0 && p.y + p.vy >= 0 && p.x + p.w + p.vx <= cv.w && p.y + p.h + p.vy <= cv.h) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.b[0] != undefined) {
                let bvx = p.vx;
                let bvy = p.vy;
                let ovx = p.vx;
                let ovy = p.vy;
                for (let i = 0; i < p.b.length; i++) {
                    p.b[i].x += p.b[i].vx;
                    p.b[i].y += p.b[i].vy;
                    ovx = p.b[i].vx;
                    ovy = p.b[i].vy;
                    p.b[i].vx = bvx;
                    p.b[i].vy = bvy;
                    bvx = ovx;
                    bvy = ovy;
                }
            }
        }
        if (p.x == f.x && p.y == f.y) {
            gf();
            if (p.b[0] == undefined) {
                p.b.push({
                    x: p.x,
                    y: p.y,
                    vx: 0,
                    vy: 0
                });
            } else {
                p.b.push({
                    x: p.b[p.b.length - 1].x,
                    y: p.b[p.b.length - 1].y,
                    vx: 0,
                    vy: 0
                });
            }
        }
        cx.clearRect(0, 0, cv.w, cv.h);
        cx.fillStyle = "black";
        cx.fillRect(0, 0, cv.w, cv.h);
        cx.fillStyle = "limegreen";
        cx.fillRect(p.x, p.y, p.w, p.h);
        if (p.b[0] != undefined) {
            for (let i = 0; i < p.b.length; i++) {
                cx.fillRect(p.b[i].x, p.b[i].y, p.w, p.h);
            }
        }
        cx.fillStyle = "red";
        cx.fillRect(f.x, f.y, f.w, f.h);
        setTimeout(l, 1000);
    }

    canvas.ontouchstart = function (e) {
        let t = e.touches[e.touches.length - 1];
        let cr = canvas.getBoundingClientRect();
        sx = t.pageX - cr.left;
        sy = t.pageY - cr.top;
    };
    canvas.ontouchmove = function (e) {
        let t = e.touches[e.touches.length - 1];
        let cr = canvas.getBoundingClientRect();
        mx = t.pageX - cr.left;
        my = t.pageY - cr.top;
        dx = 0;
        dy = 0;
        dx = mx > sx ? mx - sx : dx;
        dx = mx < sx ? mx + sx : dx;
        dy = my > sy ? my - sy : dy;
        dy = my < sy ? my + sy : dy;
        if (dx > dy) {
            if (mx > sx && p.vx != -20) {
                p.vx = 20;
                p.vy = 0;
            }
            if (mx < sx && p.vx != 20) {
                p.vx = -20;
                p.vy = 0;
            }
        }
        if (dx < dy) {
            if (my > sy && p.vy != -20) {
                p.vx = 0;
                p.vy = 20;
            }
            if (my < sy && p.vy != 20) {
                p.vx = 0;
                p.vy = -20;
            }
        }
    };
    window.onkeyup = function (e) {
        switch (e.key) {
            case "ArrowRight":
                p.vx = 20;
                p.vy = 0;
                break;
            case "ArrowLeft":
                p.vx = -20;
                p.vy = 0;
                break;
            case "ArrowDown":
                p.vx = 0;
                p.vy = 20;
                break;
            case "ArrowUp":
                p.vx = 0;
                p.vy = -20;
                break;
        }
    }

    function gf() {
        do {
            f.x = getRandomInt(1, 15) * 20;
            f.y = getRandomInt(1, 15) * 20;
        } while (f.x == p.x && f.y == p.y);
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    };

    s();
    l();

});

document.addEventListener("keydown", (e) => {
    e = e || window.event;
    if (e.keyCode == 116) {
        e.preventDefault();
    }

    document.documentElement.requestFullscreen();

});