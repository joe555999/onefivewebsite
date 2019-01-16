alert("建議使用Google Chrome遊玩");


/*限制網頁縮放*/
var scrollFunc=function(e){ 
    e=e || window.event; 
    if(e.wheelDelta && event.ctrlKey){//IE/Opera/Chrome 
        event.returnValue=false;
    }else if(e.detail){//Firefox 
        event.returnValue=false; 
    } 
 }  
 
 if(document.addEventListener){ 
    document.addEventListener('DOMMouseScroll',scrollFunc,false); 
 }//W3C

 window.onmousewheel=document.onmousewheel=scrollFunc;//IE/Opera/Chrome/Safari 




/*變數指定*/
$(function() {

    var anim_id;


    var container = $('#container');
    var car = $('#car');
    var car_1 = $('#car_1');
    var car_2 = $('#car_2');
    var car_3 = $('#car_3');
    var line_1 = $('#line_1');
    var line_2 = $('#line_2');
    var line_3 = $('#line_3');
    var restart_div = $('#restart_div');
    var restart_btn = $('#restart');
    var score = $('#score');


    var container_left = parseInt(container.css('left'));
    var container_width = parseInt(container.width());
    var container_height = parseInt(container.height());
    var car_width = parseInt(car.width());
    var car_height = parseInt(car.height());


    var game_over = false;

    var score_counter = 1;

    var speed = 2;
    var line_speed = 5;

    var move_right = false;
    var move_left = false;
    var move_up = false;
    var move_down = false;



    /* 移動小車 */
    //按下箭頭
    $(document).on('keydown', function(e) {
        e = e || window.event;
        if (game_over === false) {
            var key = e.which || e.keyCode || e.charCode;
            if (key === 37 && move_left === false) {
                move_left = requestAnimationFrame(left);
            } else if (key === 39 && move_right === false) {
                move_right = requestAnimationFrame(right);
            } else if (key === 38 && move_up === false) {
                move_up = requestAnimationFrame(up);
            } else if (key === 40 && move_down === false) {
                move_down = requestAnimationFrame(down);
            }
        }
    });

    //放開箭頭
    $(document).on('keyup', function(e) {
        e = e || window.event;
        if (game_over === false) {
            var key = e.which || e.keyCode || e.charCode;
            if (key === 37) {
                cancelAnimationFrame(move_left);
                move_left = false;
            } else if (key === 39) {
                cancelAnimationFrame(move_right);
                move_right = false;
            } else if (key === 38) {
                cancelAnimationFrame(move_up);
                move_up = false;
            } else if (key === 40) {
                cancelAnimationFrame(move_down);
                move_down = false;
            }
        }
    });

    //按下箭頭的時的移動距離
    function left() {
        if (game_over === false && parseInt(car.css('left')) > 0) {
            car.css('left', parseInt(car.css('left')) - 5);
            move_left = requestAnimationFrame(left);
        }
    }

    function right() {
        if (game_over === false && parseInt(car.css('left')) < container_width - car_width) {
            car.css('left', parseInt(car.css('left')) + 5);
            move_right = requestAnimationFrame(right);
        }
    }

    function up() {
        if (game_over === false && parseInt(car.css('top')) > 0) {
            car.css('top', parseInt(car.css('top')) - 3);
            move_up = requestAnimationFrame(up);
        }
    }

    function down() {
        if (game_over === false && parseInt(car.css('top')) < container_height - car_height) {
            car.css('top', parseInt(car.css('top')) + 3);
            move_down = requestAnimationFrame(down);
        }
    }

    /* 移動障礙車和車道線*/
    anim_id = requestAnimationFrame(repeat);

    function repeat() {
        if (collision(car, car_1) || collision(car, car_2) || collision(car, car_3)) {
            stop_the_game();
            return;
        }

        score_counter++;

        //成績跑速
        if (score_counter % 20 == 0) {
            score.text(parseInt(score.text()) + 1);
        }

        //車速、車道線速
        if (score_counter % 100 == 0) {
            speed++;
            line_speed++;
        }

        car_down(car_1);
        car_down(car_2);
        car_down(car_3);

        line_down(line_1);
        line_down(line_2);
        line_down(line_3);

        anim_id = requestAnimationFrame(repeat);
    }

    function car_down(car) {
        var car_current_top = parseInt(car.css('top'));
        if (car_current_top > container_height) {
            car_current_top = -200;
            var car_left = parseInt(Math.random() * (container_width - car_width));
            car.css('left', car_left);
        }
        car.css('top', car_current_top + speed);
    }

    function line_down(line) {
        var line_current_top = parseInt(line.css('top'));
        if (line_current_top > container_height) {
            line_current_top = -300;
        }
        line.css('top', line_current_top + line_speed);
    }

    restart_btn.click(function() {
        location.reload();
    });

    function stop_the_game() {
        game_over = true;
        cancelAnimationFrame(anim_id);
        cancelAnimationFrame(move_right);
        cancelAnimationFrame(move_left);
        cancelAnimationFrame(move_up);
        cancelAnimationFrame(move_down);
        restart_div.slideDown();
        restart_btn.focus();
    }



    /*碰撞時的處理*/
    function collision($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }



});



/*背景*/
var canvas2 = document.querySelector("canvas");
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight
var context = canvas2.getContext('2d');
var r,cx, cy, radgrad;

var drawCircles = function(){
    //消褪現有的內容
    context.fillStyle = 'rgba(153, 153, 153, 0.5)';
    context.fillRect(0, 0, canvas2.width, canvas2.height);

    //繪製新球體
    for(var i=0; i<360; i+=15){
        //隨機取得位置和半徑
        cx = Math.random()*canvas2.width;
        cy = Math.random()*canvas2.height;
        r = Math.random()*canvas2.width/10.0;

        //定義放射狀漸層
        radgrad = context.createRadialGradient(
            0+(r* 0.15), 0-(r*0.25), r/3.0,
            0, 0, r
            );
        radgrad.addColorStop(0.0, 'hsl('+i+', 100%, 75%)');
        radgrad.addColorStop(0.9, 'hsl('+i+', 100%, 50%)');
        radgrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

        //畫圓
        context.save();
        context.translate(cx, cy);
        context.beginPath();
        context.moveTo(0+r, 0);
        context.arc(0, 0, r, 0, Math.PI*2.0, 0);
        context.fillStyle = radgrad;
        context.fill();
        context.restore();
    }
};
drawCircles();//繪製球體

/*在固定速度開始/停止動畫(視窗載入時自動開始)*/
var pulse = 40;
var running = null;
window.onload=function(){
        running = window.setInterval(
            "drawCircles()", 60000/pulse
            );
};
