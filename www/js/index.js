/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
var screenW=320;
var screenH=460;
var ps=null;
var dt=0.01;
var oldMousePosition=0;
var newMousePosition=0;
var score=0;

var app = {
	
	
    // Application Constructor
    initialize: function() {
		console.log("initialize");
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
		console.log("bindEvents");
        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener("touchmove", function (e) { e.preventDefault(); return false; }, false);
    },
    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      
        console.log('Received Event: ' + id);
		app.init();
	},
	init: function() {
		
		console.log('init');

		oldMousePosition=Vector2.zero;
		newMousePosition=Vector2.zero;
		//console.log('oldMousePosition(' + oldMousePosition + ")" );
		//console.log('newMousePosition(' + newMousePosition + ")" );

		var canvas = document.getElementById("canvas1");
		var cx = canvas.getContext("2d");
		
		console.log('test 1');
		ps = new ParticleSystem();
		ps.effectors.push(new ChamberBox(0, 0, screenW, screenH));
		console.log('test 2');
		
		start("canvas1", app.step);
		console.log('test 3');

		canvas.addEventListener("touchmove", function(evt) {
			
			if( evt.touches[0].pageX > 78 && evt.touches[0].pageY > 146 && evt.touches[0].pageX < 248 && evt.touches[0].pageY < 407 ) {
				
				//console.log('in');
				newMousePosition = new Vector2( evt.touches[0].pageX, evt.touches[0].pageY);
				oldMousePosition = newMousePosition;
				
				var velocity = newMousePosition.subtract(oldMousePosition).multiply(10);
				velocity = velocity.add(app.sampleDirection(0, Math.PI * 2).multiply(20));
				var color = app.sampleColor(Color.red, Color.white);
				var life = app.sampleNumber(1, 2);    
				var size = app.sampleNumber(20, 50);
				ps.emit(new Particle(newMousePosition, velocity, life, color, size));
				
		
				score++;
			}
		}, false);

    },
	sampleDirection: function(angle1, angle2) {
		var t = Math.random();
		var theta = angle1 * t + angle2 * (1 - t);
		return new Vector2(Math.cos(theta), Math.sin(theta));
	},
	sampleColor: function(color1, color2) {
		var t = Math.random();
		return color1.multiply(t).add(color2.multiply(1 - t));
	},
	sampleNumber: function(value1, value2) {
		var t = Math.random();
		return value1 * t + value2 * (1 - t);
	},
	step: function() {
		//var velocity = newMousePosition.subtract(oldMousePosition).multiply(10);
		//velocity = velocity.add(app.sampleDirection(0, Math.PI * 2).multiply(20));
		
		ps.simulate(dt);
	
		ctx.fillStyle="rgba(255, 255, 255, 0.1)";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ps.render(ctx);
		
			
		ctx.fillStyle = '#f00';
		ctx.font = 'italic bold 32px sans-serif';
		ctx.textBaseline = 'bottom';
		ctx.fillText('泡泡數：' + score, 10, 50);
		
	}

	
};
