/* 
* @requires Vector2, Color, Particle
*/
function ParticleSystem() {
    // Private fields
    var that = this;
    var particles = new Array();

    // Public fields
    this.gravity = new Vector2(0, 100);
    this.effectors = new Array();


	// background
	var image = new Image();
	image.src = "img/bg.jpg";
	
    // Public methods
        
    this.emit = function(particle) {
        particles.push(particle);
    };

    this.simulate = function(dt) {
        aging(dt);			// 老化
        //applyGravity();	// 重力
        applyEffectors();	
        kinematics(dt);		// 運動學
    };

    this.render = function(ctx) {
		ctx.drawImage(image, 0, 0, 320, 460);
		
        for (var i in particles) {
            var p = particles[i];
            var alpha = 1 - p.age / p.life;
            ctx.fillStyle = "rgba("
                + Math.floor(p.color.r * 255) + ","
                + Math.floor(p.color.g * 255) + ","
                + Math.floor(p.color.b * 255) + ","
                + alpha.toFixed(2) + ")";
            ctx.beginPath();
            ctx.arc(p.position.x, p.position.y, p.size, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    }

    // Private methods
    
    function aging(dt) {
        for (var i = 0; i < particles.length; ) {
            var p = particles[i];
            p.age += dt;
            if (p.age >= p.life)
                kill(i);
            else
                i++;
        }
    }

    function kill(index) {
        if (particles.length > 1)
            particles[index] = particles[particles.length - 1];
        particles.pop();
    }

    function applyGravity() {
        for (var i in particles)
            particles[i].acceleration = that.gravity;
    }

    function applyEffectors() {
        for (var j in that.effectors) {
            var apply = that.effectors[j].apply;
            for (var i in particles)
                apply(particles[i]);    
        }
    }
    
    function kinematics(dt) {
        for (var i in particles) {
            var p = particles[i];
            p.position = p.position.add(p.velocity.multiply(dt));
            p.velocity = p.velocity.add(p.acceleration.multiply(dt));
        }
    }
}
