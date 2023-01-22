const canvasEl = document.querySelector("canvas"),
canvasCtx = canvasEl.getContext("2d"),

gapX = 10

//mapeia as posições do mouse
const mouse = {x: 0, y: 0}

    /// campo
const field ={
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function(){

   canvasCtx.fillStyle = "#222321"
   canvasCtx.fillRect(0, 0, this.w, this.h)
    }
}
   //linha central
const line = {
    w: 15,
    h: field.h,
    draw: function(){
        canvasCtx.fillStyle = "#ffff"
        canvasCtx.fillRect(field.w / 2 - this.w /2, 0, this.w, this.h
        )
    }
}

   //raquetes esquerda
const leftPaddle = {
    x: gapX,
    y: 100,
    w: line.w,
    h: 200,
    _move: function() {
        this.y = mouse.y - this.h / 2
    },
    draw: function(){
        canvasCtx.fillStyle = "#ffff"
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)

        this._move()
    }
}
  
   //raquetes direita
const rightPaddle = {
    x: field.w - line.w - gapX,
    y: 100,
    w: line.w,
    h: 200,
    speed: 1,
    _move: function() {

        if (this.y + this.h / 16 < ball.y + ball.r){
            this.y += this.speed
        } else{
            this.y -= this.speed
        }
    },
    _speedUp: function(){
        this.speed += 2

    },
    draw: function(){
        canvasCtx.fillStyle = "#ffff"
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)

        this._move()
    }
}
   /// placar do jogo
   const score ={
    human: 0 ,
    computer: 0,
    increaseHuman: function(){
        this.human++
    },
    increaseComputer: function(){
        this.computer++
    },  
    draw: function(){
        canvasCtx.font = "bold 72px Arial"
        canvasCtx.textAlign ="center"
        canvasCtx.textBaseline ="top"
        canvasCtx.fillStyle = "red"
        
        canvasCtx.fillText(this.human, field.w / 4, 50)
        canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2 , 50)
    }
}

   // criando a bola
const ball = {
    x: 0,
    y: 0,
    r: 20,
    speed: 5,
    directionX:1,
    directionY: 1,
    _calcPosition: function(){
        /// verificar se faz 1 ponto
        if(this.x > field.w - this.r - rightPaddle.w - gapX){
            //verifica se a raquete bateu na bola
            if( this.y + this.r > rightPaddle.y &&
                this.y - this.r < rightPaddle.y + rightPaddle.h
            ){
                ///rebate a bola
             this._reverseX()
            } else {
                score.increaseHuman()
                this._pointUp()
            }
        }

        // verifica se o jogador 2 fez ponto
        if(this.x < this.r + leftPaddle.w + gapX){
             //verifica se a raquete bateu na bola
             if( this.y + this.r > leftPaddle.y && 
                this.y - this.r < leftPaddle.y + leftPaddle.h
            ){
                ///rebate a bola
             this._reverseX()
            } else {
                score.increaseComputer()
                this._pointUp()
            }
        }

        if(
            ///verifica as laterais superior e inferior do campo
            (this.y - this.r < 0 && this.directionY < 0) ||
            (this.y > field.h - this.r && this.directionY > 0)
            ){

            ///rebate a bola invertebdo o sinal do eixo y
            this._reverseY()   
        }
    },
    _reverseX: function(){
        this.directionX *= -1
    },
    _reverseY: function(){
        this.directionY *= -1
    },
    _speedUp: function(){
        this.speed += 3
        rightPaddle._speedUp()

    },
    _pointUp: function() {
        this._speedUp()
        this.x = field.w / 2
        this.y = field.h / 2
    },
    

    _move: function(){
        this.x += this.directionX * this.speed
        this.y += this.directionY * this.speed
    },

    draw: function(){
        canvasCtx.fillStyle = "#ffff"
        canvasCtx.beginPath()
        canvasCtx.arc(this.x ,this.y,this.r,0,2 * Math.PI, false)
        canvasCtx.fill()

        this._calcPosition()
        this._move()

    },
}

function setup(){
   canvasEl.width = canvasCtx.width = field.w
   canvasEl.height = canvasCtx.height = field.h
}

function draw(){
   field.draw()
   line.draw()

   leftPaddle.draw()
   rightPaddle.draw()

   score.draw()

   ball.draw()
}

window.animateFrame =(function(){
    return(
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()

function main(){
    animateFrame(main)
    draw()
}

setup()
main()

canvasEl.addEventListener("mousemove", function(e){
    mouse.x = e.pageX
    mouse.y = e.pageY
})

window.setInterval(draw, 1000 / 60)