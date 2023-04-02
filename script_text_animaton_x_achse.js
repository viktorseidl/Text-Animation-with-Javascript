window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log(ctx);

    class Particle {
        constructor(effect, x, y, color) {
            this.effect = effect;
            this.x = Math.random() * this.effect.canvasWidth;
            this.y = 0;
            this.color = color;
            this.originX = x;
            this.originY = y;
            this.size = this.effect.gap; // - 2; //bei minus wird das pixel umranded bei plus überlappt es
            this.dx = 0;
            this.dy = 0;
            this.vx = 0;
            this.vy = 0;
            this.force = 0;
            this.angle = 0;
            this.distance = 0;
            this.friction = Math.random() * 0.6 + 0.15;
            this.ease = Math.random() * 0.1 + 0.005;
        }
        draw() {
            this.effect.context.fillStyle = this.color;
            this.effect.context.fillRect(this.x, this.y, this.size, this.size);
        }
        update() {
            this.x += (this.originX - this.x) * this.ease;
            this.y += this.originY - this.y;
        }
    }
    /*
    50:28 / 1:22:17 */
    class Effect {
        constructor(context, canvasWidth, canvasHeight) {
            this.context = context;
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.textX = this.canvasWidth / 2;
            this.textY = this.canvasHeight / 2;
            this.fontSize = 100;
            this.gradientOne = 'aqua';
            this.gradientTwo = 'fuchsia';
            this.gradientThree = 'DodgerBlue';
            this.lineHeight = this.fontSize; //muss die selbe größe wie der text haben
            this.maxTextWidth = this.canvasWidth * 0.88;
            //particles text
            this.particles = [];
            this.gap = 3;
            this.mouse = {
                radius: 20000,
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
            gradient.addColorStop(0.1, this.gradientOne);  //gibt die teilung des Gradien an 0.0 start und 1.0 ende
            gradient.addColorStop(0.5, this.gradientTwo);  //gibt die teilung des Gradien an 0.0 start und 1.0 ende
            gradient.addColorStop(0.8, this.gradientThree);  //gibt die teilung des Gradien an 0.0 start und 1.0 ende
            this.context.fillStyle = gradient;
            this.context.textAlign = 'center';  //für das zentrieren des textes auf der x achse. Ansonsten würde der Text nach START ausgerichtet werden und wäre mehr nach rechts
            this.context.textBaseline = 'middle';  //für das zentrieren des textes auf der y achse. Ansonsten würde der Text nach START ausgerichtet werden und wäre mehr nach oben
            this.context.strokeStyle = 'LawnGreen';  //Farbe der Stroke ausgabe des textes
            this.context.lineWidth = 2; //Stroke breite angeben
            this.context.font = this.fontSize + 'px Helvetica'

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
            this.textY = this.canvasHeight / 2 - textHeight / 2;
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
            console.log(this.particles)
        }
        render() {
            this.particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
        }
    }
    const effect = new Effect(ctx, canvas.width, canvas.height);
    effect.wrapText("Hello, how are you today to se if it is multiline now its already to small to check out")
    effect.render();
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.render();
        requestAnimationFrame(animate);
    }
    animate();
    //const text = 'Hello, how are you today to se if it is multiline now its already to small to check out';
    //const textX = canvas.width / 2; //Koordinaten von links (Canvasbreite geteilt durch 2)
    //const textY = canvas.height / 2; //Koordinaten von Top (Canvashöhe geteilt durch 2)
    /*const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height); //(x koord, y koord, x koord, y koord)
    gradient.addColorStop(0.1, 'red');  //gibt die teilung des Gradien an 0.0 start und 1.0 ende
    gradient.addColorStop(0.5, 'fuchsia');  //gibt die teilung des Gradien an 0.0 start und 1.0 ende
    gradient.addColorStop(0.8, 'orange');  //gibt die teilung des Gradien an 0.0 start und 1.0 ende
    ctx.fillStyle = gradient; //'white';  //Farbe der Textausgabe
    ctx.strokeStyle = 'orangered';  //Farbe der Stroke ausgabe des textes
    ctx.lineWidth = 3; //Stroke breite angeben
    ctx.font = '80px Helvetica';
    ctx.textAlign = 'center';  //für das zentrieren des textes auf der x achse. Ansonsten würde der Text nach START ausgerichtet werden und wäre mehr nach rechts
    ctx.textBaseline = 'middle';  //für das zentrieren des textes auf der y achse. Ansonsten würde der Text nach START ausgerichtet werden und wäre mehr nach oben
    //ctx.letterSpacing = '100px';  //Abstand der Buchstaben (unterstützt nicht alle browser)
    //ctx.fillText(text, textX, textY); //Text ausgeben (Text, Position von links in pixel, Position von Top in pixel)
    //ctx.strokeText(text, textX, textY);   //Umrandung des Textes ausgeben (Text, Position von links in pixel, Position von Top in pixel)

    const maxTextWidth = canvas.width * 0.88;
    const lineHeight = 80; //muss die selbe größe wie der text haben
    const wrapText = (text) => {
        let linesArray = [];
        let lineCounter = 0;
        let line = '';
        let words = text.split(' ');
        for (let i = 0; i < words.length; i++) {
            let testLine = line + words[i] + ' ';
            //console.log(ctx.measureText(testLine).width);  // measureText().width misst die länge in pixel eines wortes 
            if (ctx.measureText(testLine).width > maxTextWidth) {
                line = words[i] + ' ';
                lineCounter++;
            } else {
                line = testLine;
            }
            linesArray[lineCounter] = line;
            //ctx.fillText(testLine, canvas.width / 2, canvas.height / 2 + i * 80);
        }
        let textHeight = lineHeight * lineCounter;
        let textY = canvas.height / 2 - textHeight / 2; //ist für die vertikale ausrichtung auf der Y axis
        linesArray.forEach((el, index) => {
            ctx.fillText(el, canvas.width / 2, textY + (index * lineHeight));  // Hier wird pro linie im array die ausgabe gemacht. Dabei sollte am ende mal die Textgröße multipliziert werden.
        })
    }

    wrapText('Hello, how are you today to se if it is multiline now its already to small to check out');*/
});