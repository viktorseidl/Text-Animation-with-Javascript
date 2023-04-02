# Text-Animation-with-Javascript

## Description

This repo includes an example of a particle text animation. The getContext() of the HTML5 build-in object was used for the animation.

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


