window.addEventListener('load', () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d', {
        willReadFrequently: true
    });
    canvas.width = window.innerWidth; //to get canvas width document.querySelector('#canvas').offsetWidth;
    canvas.height = window.innerHeight; //to get canvas height document.querySelector('#canvas').offsetHeight; 
    //console.log(ctx);

    class Particle {
        constructor(effect, x, y, color) {
            this.effect = effect;
            this.x = Math.random() * this.effect.canvasWidth;//Math.random() *4;//Math.random() * this.effect.canvasWidth;// Math.random() * this.effect.canvasWidth; // 4 is from right 14 makes cool flyin effect
            this.y = this.effect.canvasHeight //if paticles from top comming then 0 if from bottom then this.effect.canvasHeight
            this.color = color;
            this.originX = x;
            this.originY = y;
            this.size = this.effect.gap - 3; //bei minus wird das pixel umranded bei plus überlappt es  //Mobile -0.1 Desktop -0.5
            this.dx = 0;
            this.dy = 0;
            this.vx = 0;
            this.vy = 0;
            this.force = 0;
            this.angle = 0;
            this.distance = 0;
            this.friction = 0.95; //Math.random() * 0.6 + 0.15;
            this.ease = 0.15; //Math.random() * 0.2 + 0.005;
        }
        draw() {
            this.effect.context.fillStyle = this.color;
            this.effect.context.fillRect(this.x, this.y, this.size, this.size);
        }
        update() {
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            this.distance = this.dx * this.dx + this.dy * this.dy;
            this.force = - this.effect.mouse.radius / this.distance;

            if (this.distance < this.effect.mouse.radius) {
                this.angle = Math.atan2(this.dy, this.dx);
                this.vx += this.force * Math.cos(this.angle);
                this.vy += this.force * Math.sin(this.angle);
            }

            this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
            //this.y += this.originY - this.y;
            this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
        }
    }

    class Effect {
        constructor(context, canvasWidth, canvasHeight) {
            this.context = context;
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.textX = this.canvasWidth / 2;
            this.textY = this.canvasHeight / 2;
            this.fontSize = 180; //Mobile 30 Desktop 180
            this.gradientOne = '#00FF00';
            this.gradientTwo = '#00FF33';
            this.gradientThree = 'GoldenRod';
            this.lineHeight = this.fontSize; //muss die selbe größe wie der text haben
            this.maxTextWidth = this.canvasWidth * 0.88;
            this.verticalOffset = -10;
            //particles text
            this.particles = [];
            this.gap = 6; //Mobile 1 Desktop 3
            this.mouse = {
                radius: 20000, //Mobile 5000 Desktop 20000
                x: 0,
                y: 0
            }
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
                //console.log(this.mouse.x, this.mouse.y);
            });
        }
        wrapText(text) {
            const gradient = this.context.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight); //(x koord, y koord, x koord, y koord)
            gradient.addColorStop(0.2, this.gradientOne);  //gibt die teilung des Gradien an 0.0 start und 1.0 ende
            gradient.addColorStop(0.5, this.gradientTwo);  //gibt die teilung des Gradien an 0.0 start und 1.0 ende
            gradient.addColorStop(0.7, this.gradientThree);  //gibt die teilung des Gradien an 0.0 start und 1.0 ende
            this.context.fillStyle = gradient;
            this.context.textAlign = 'center';  //für das zentrieren des textes auf der x achse. Ansonsten würde der Text nach START ausgerichtet werden und wäre mehr nach rechts
            this.context.textBaseline = 'middle';  //für das zentrieren des textes auf der y achse. Ansonsten würde der Text nach START ausgerichtet werden und wäre mehr nach oben
            this.context.strokeStyle = '#f8fafc';  //Farbe der Stroke ausgabe des textes
            this.context.lineWidth = 3; //Stroke breite angeben  //mobile 0.5 Desktop 2
            this.context.font = this.fontSize + 'px Kanit'; //font must be forced by css on the canvas before it can be used here

            // multiline text
            let linesArray = [];
            let words = text.split(' ');
            let lineCounter = 0;
            let line = '';
            for (let i = 0; i < words.length; i++) {
                let testLine = line + words[i] + ' ';
                //console.log(ctx.measureText(testLine).width);  // measureText().width misst die länge in pixel eines wortes 
                if (this.context.measureText(testLine).width > this.maxTextWidth) {
                    line = words[i] + ' ';
                    lineCounter++;
                } else {
                    line = testLine;
                }
                linesArray[lineCounter] = line;
            }
            let textHeight = this.lineHeight * lineCounter;
            this.textY = this.canvasHeight / 2 - textHeight / 2 + this.verticalOffset;
            linesArray.forEach((el, index) => {
                this.context.fillText(el, this.textX, this.textY + (index * this.lineHeight));
                this.context.strokeText(el, this.textX, this.textY + (index * this.lineHeight));
            });
            this.convertToParticles();
        }
        convertToParticles() {
            this.particles = [];
            const pixels = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight).data;
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            //console.log(pixels);
            for (let y = 0; y < this.canvasHeight; y += this.gap) {
                for (let x = 0; x < this.canvasWidth; x += this.gap) {
                    const index = (y * this.canvasWidth + x) * 4; //mal 4 weil 4 elemente ein pixel darstellen = red green blue alpha
                    const alpha = pixels[index + 3]; //der alpha wert wird geprüft, wenn 0 dann ist an dieser stelle nichts
                    if (alpha > 0) {
                        const red = pixels[index];
                        const green = pixels[index + 1];
                        const blue = pixels[index + 2];
                        const color = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
                        this.particles.push(new Particle(this, x, y, color));
                    }
                }
            }
            //console.log(this.particles)
        }
        render() {
            this.particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
        }
        resize(width, height) {
            this.canvasWidth = width;
            this.canvasHeight = height;
            this.textX = this.canvasWidth / 2;
            this.textY = this.canvasHeight / 2;
            this.maxTextWidth = this.canvasWidth * 0.88;
        }
    }
    const effect = new Effect(ctx, canvas.width, canvas.height);
    effect.wrapText("NFTISMUS")
    effect.render();

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.render();
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        effect.resize(canvas.width, canvas.height);
        effect.wrapText("NFTISMUS NFT MARKETPLACE")
    });

});