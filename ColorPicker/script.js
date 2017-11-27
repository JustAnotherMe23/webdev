

function setup() {
	for(var i = 0; i < boxes.length; i++) {
		if(i === place) {
			boxes[i].removeEventListener("click", handler1);
		} else {
			boxes[i].removeEventListener("click", handler2);
		}
	}

	place = Math.floor(Math.random() * max);

	for(var i = 0; i < max; i++) {
		r = Math.floor(Math.random() * 256);
		g = Math.floor(Math.random() * 256);
		b = Math.floor(Math.random() * 256);

		boxes[i].style.background = "rgb(" + r + ", " + g + ", " + b + ")";
		if(place === i) {
			rF = r;
			gF = g;
			bF = b;

			document.querySelector("#rNum").innerHTML = rF;
			document.querySelector("#gNum").innerHTML = gF;
			document.querySelector("#bNum").innerHTML = bF;
		}
		boxes[i].classList.remove("clear");
	}

	for(var i = 0; i < boxes.length; i++) {
		if(i === place) {
			boxes[i].addEventListener("click", handler1);
		} else {
			boxes[i].addEventListener("click", handler2);
		}

		document.querySelector("#result").innerHTML = "Guess Again!";
		document.querySelector("#result").classList.add("clear");
	}
}

handler1 = function() {
	for(var j = 0; j < boxes.length; j++) {
		boxes[j].style.background = "rgb(" + rF + ", " + gF + ", " + bF + ")";
	}
	document.querySelector("#title").style.background = "rgb(" + rF + ", " + gF + ", " + bF + ")";
	document.querySelector("#result").innerHTML = "Correct!";
	document.querySelector("#result").classList.remove("clear");
}

handler2 = function() {
		this.classList.add("clear");
		document.querySelector("#result").classList.remove("clear");
	}

var rF = 0;
var gF = 0;
var bF = 0;
var place = 0;
var max = 6;
var boxes = document.querySelectorAll(".box");

setup();

document.querySelector("#easy").addEventListener("click", function() {
	max = 3;
	document.querySelector("#secondRow").classList.add("clear");
	setup();
});

document.querySelector("#hard").addEventListener("click", function() {
	max = 6;
	document.querySelector("#secondRow").classList.remove("clear");
	setup();
});

document.querySelector("#new").addEventListener("click", function() {
	setup();
});