# Text-Animation-with-Javascript

![Screenshot](https://github.com/viktorseidl/Text-Animation-with-Javascript/blob/main/screenshot.jpg)

## Description

This repo includes an example of a particle text animation. The getContext() of the HTML5 build-in object was used for the animation.

[Working Demo](https://itsnando.com/animation/index.html).

### Particle configurations

The particle class contains various attributes that allow you to set the size, width, ... according to your own ideas.

```javascript
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
```
+  this.x
    - This.x is responsible for aligning the particles along the X direction.  
    - Math.random() * this.effect.canvasWidth; results in a fly-in from the left.       
    - Math.random() *4; results in a fly-in from the right. 
    - Math.random() *14; results in a fly-in from the bottom to right to center.
+  this.y 
    - This.y is responsible for aligning the particles along the Y direction.  
    - this.effect.canvasHeight; results in a fly-in from bottom.       
    - 0; results in a fly-in from the top.
+  this.size
    - this.size is responsible for either setting a gap or not.
    - this.effect.gap - 3; this.effect.gap - 3; sets a total distance between particles of 3 pixels.
    - this.effect.gap; this.effect.gap; puts the particles together without any gaps.
+  this.friction
    - this.friction this.friction ensures the distribution of the particles. The higher the value, the further the particles are distributed. The value should be no more than 0.95 and less than 0.05.
+  this.ease
    - this.ease takes care of restoring the text. The lower the value, the slower the text is restored. The higher, the faster the particles move back into place. The value should be no more than 0.2 and less than 0.005.

### Text configurations

The text settings are in the Effect class. Various settings such as gradient, color,... can be set there.

```javascript
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
           
        }       
    }
```
+  this.fontSize
    - is responsible for the size of the text. The value should be no more than 30 for Mobile and 280 for Desktop for best performance. 
+  this.gradientOne,this.gradientTwo, this.gradientThree 
    - this.gradientOne,this.gradientTwo, this.gradientThree returns the colors in hex format to the object. The gradient can be changed to fewer or more gradients within the wrapText() function.
+  this.lineHeight 
    - this.lineHeight sets the line height. this should be the same size as the text.
+  this.gap 
    - this.gap sets the block size of the text pixels. This should be no less than 1 and a maximum of 15 for best performance.
+  this.mouse
    - this.mouse {radius} is responsible for the size of the effect capture with the mouse pointer.

