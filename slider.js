var autoplay = [true, false];
var currentslide = [1]
var slides = {};
var elements = {};
var wrappers = [];
var j = 0;
//Availlable types - slider, carousel, transit
var settings = {
    "global": {},
    "carouselone": {
        "type": "transit",
        "autoplay": false,
        "currentslide": 0,
        "transition": 0.3,
        "interval": 1,
        "direction": "down",
        "binded": "carouselthree",
        "elements": 1,
    },
    "carouselthree": {
        "type": "carousel",
        "autoplay": false,
        "currentslide": 0,
        "transition": 0.5,
        "interval": 3,
        "direction": "right",
        "bind": "carouselone",
        "elements": 3,
    },
    "carouselfour": {
        "type": "carousel",
        "autoplay": true,
        "currentslide": 0,
        "transition": 0.5,
        "interval": 3,
        "direction": "top",

        "elements": 1,
    },
    "carouselfive": {
        "type": "carousel",
        "autoplay": true,
        "currentslide": 0,
        "transition": 0.5,
        "interval": 3,
        "direction": "right",

        "elements": 1,
    },
    "carouselsix": {
        "type": "slider",
        "autoplay": true,
        "currentslide": 0,
        "transition": 0.5,
        "interval": 2,
        "direction": "right",

        "elements": 1,
    },
    "carouselseven": {
        "type": "carousel",
        "autoplay": true,
        "currentslide": 0,
        "transition": 0.5,
        "interval": 2,
        "direction": "right",

        "elements": 1,
    },
    "third": {
        "type": "carousel",
        "autoplay": true,
        "currentslide": 0,
        "transition": 0.5,

        "interval": 3,

        "direction": "right",
        "elements": 3,
    }
}
for (var i in settings) {
    //Preventing animation from being longer than interval
    if (settings[i].transition > settings[i].interval) {
        settings[i].transition = settings[i].interval
    }

    if (i != "global") {
        var temp, temp2;
        elements[i] = document.querySelector("#" + i);
        slides[i] = elements[i].querySelectorAll(".slide");
        Array.prototype.forEach.call(slides[i], function(element, j) {
            switch (settings[i].type) {
                case "slider":
                    if (ishorizontal(i)) {
                        setleft(element, (j - settings[i].currentslide) * elements[i].offsetWidth + "px");
                    } else {
                        settop(element, (j - settings[i].currentslide) * elements[i].offsetHeight + "px");
                    }
                    break;
                case "carousel":
                    if (settings[i].elements > slides[i].length) {
                        settings[i].elements = slides[i].length
                    } //protection for wrong settings;
                    if (j - settings[i].currentslide < 0) {

                        temp2 = (100 / settings[i].elements) + "%";
                        if (ishorizontal(i)) {
                            temp = (Math.abs(j - settings[i].currentslide) + settings[i].elements) * (elements[i].offsetWidth) / settings[i].elements + "px";
                            setleft(element, temp);
                            element.style.width = temp2;
                        } else {
                            temp = (Math.abs(j - settings[i].currentslide) + settings[i].elements) * (elements[i].offsetheight) / settings[i].elements + "px";
                            settop(element, temp);
                            element.style.height = temp2;
                        }
                    } else {
                        temp2 = (100 / settings[i].elements) + "%";
                        if (ishorizontal(i)) {
                            temp = (j - settings[i].currentslide) * (elements[i].offsetWidth) / settings[i].elements + "px";
                            setleft(element, temp);
                            element.style.width = temp2;
                        } else {
                            temp = (j - settings[i].currentslide) * (elements[i].offsetHeight) / settings[i].elements + "px";
                            settop(element, temp);
                            element.style.height = temp2;
                        }
                    }
                    break;
                default:
                    setleft(element, "0px");
                    settop(element, "0px");
                    element.style.display = "none";
                    if ((j - settings[i].currentslide) == 0) {
                        element.style.display = "block";
                    }
            }
            settimedelay(i, element);
        });
        if (settings[i].bind) {
            if (slides[i].length != slides[settings[i].bind].length) {
                alert("number of slides in binded sliders must match!")
            }
        }
        wrappers[j] = i;
        j++
    }
}
initautoplay();

function initautoplay() {
    Array.prototype.forEach.call(wrappers, function(el, j) {
        if (settings[el].autoplay && !settings[el].bind) {
            setInterval(function() {
                if (settings[el].direction == "left" || settings[el].direction == "down") {
                    triggermove(el, "prev");
                } else {
                    triggermove(el, "next");
                }
                if (settings[el].binded) {
                    settings[settings[el].binded].currentslide = settings[el].currentslide;
                }
            }, settings[el].interval * 1000);
        };
    })
}

function triggermove(number, dir) {
    if (dir == "next") {
        settings[number].currentslide++;
    } else {
        settings[number].currentslide--;
    }
    //If slider has binded another, trigger the one binded to
    if (settings[number].binded) {
        settings[settings[number].binded].currentslide = settings[number].currentslide;
        moveslides(number, dir);
    } else if (settings[number].bind) {
        settings[settings[number].bind].currentslide = settings[number].currentslide;
        moveslides(settings[number].bind, dir);
    } else {
        moveslides(number, dir);
    }

}
//zmienić direction, bo bierze domyślnie dla w lewo	
function moveslides(number, dir) {
    //If we extend beyond elements, get back to the possible range
    if (settings[number].currentslide == slides[number].length) {
        settings[number].currentslide = 0;
    }
    if (settings[number].currentslide < 0) {
        settings[number].currentslide = slides[number].length - 1;
    }
    //If slider have binded second slider - trigger it
    if (settings[number].binded) {
        moveslides(settings[number].binded, dir);
    }

    switch (settings[number].type) {
        case "slider":
            Array.prototype.forEach.call(slides[number], function(element, j) {
                var temp = j - settings[number].currentslide
                if (ishorizontal(number)) {
                    setleft(element, temp * elements[number].offsetWidth + "px");

                } else {
                    settop(element, (temp) * elements[number].offsetHeight + "px");
                }
            });
            break;
        case "carousel":
            Array.prototype.forEach.call(slides[number], function(element, j) {
                var temp = j - settings[number].currentslide;
                if ((temp < -1) && (slides[number].length + temp) <= settings[number].elements) {
                    temp = slides[number].length + temp
                } else if (temp == slides[number].length - 1 && j == slides[number].length - 1) {
                    temp = -1;
                }

                if (temp > (settings[number].elements - 1) || temp < 0) {
                    if (!(dir == "prev" && temp == settings[number].elements) && !(dir == "next" && temp == -1)) {
                        //Set 0 animation time if it's not visible
                        settimedelayzero(number, element)
                    }
                } else {
                    settimedelay(number, element)
                }

                //Proper element moving
                // console.log(temp+"||"+settings[number].elements+"||"+j)
                if (dir == "prev" && temp == 0) {
                    settimedelayzero(number, element)
                    if (ishorizontal(number)) {
                        setleft(element, (-1) * (elements[number].offsetWidth) / settings[number].elements + "px");
                        setTimeout(function() {
                            settimedelay(number, element)
                            setleft(element, "0px");
                        }, 0);
                    } else {
                        settop(element, (-1) * (elements[number].offsetHeight) / settings[number].elements + "px");
                        setTimeout(function() {
                            settimedelay(number, element)
                            settop(element, "0px");
                        }, 0);
                    }
                } else if (dir == "next" && temp == settings[number].element - 1) {
                    settimedelayzero(number, element)
                    if (ishorizontal(number)) {
                        setleft(element, (settings[number].elements) * (elements[number].offsetWidth) / settings[number].elements + "px");
                        setTimeout(function() {
                            settimedelay(number, element)
                            setleft(element, (temp) * (elements[number].offsetWidth) / settings[number].elements + "px");
                        }, 0);
                    } else {
                        settop(element, (settings[number].elements) * (elements[number].offsetHeight) / settings[number].elements + "px");
                        setTimeout(function() {
                            settimedelay(number, element)
                            settop(element, (temp) * (elements[number].offsetWidth) / settings[number].elements + "px");
                        }, 0);
                    }
                } else {
                    if (ishorizontal(number)) {
                        setleft(element, (temp) * (elements[number].offsetWidth) / settings[number].elements + "px");
                    } else {
                        settop(element, (temp) * (elements[number].offsetHeight) / settings[number].elements + "px");
                    }
                }
            });
            break;
        default:
            Array.prototype.forEach.call(slides[number], function(element, j) {
                var temp = j - settings[number].currentslide;
                if ((temp) == 0) {
                    element.style.display = "block";
                    fadeIn(element);
                } else {
                    fadeOut(element)
                }
            });
    }
};

function settop(element, val) {
    element.style.top = val;
}

function setleft(element, val) {
    element.style.left = val;
}

function ishorizontal(number) {
    if (settings[number].direction == "left" || settings[number].direction == "right") {
        return true;
    } else {
        return false
    }

}

function fadeIn(el) {
    el.style.opacity = 0;
    var last = +new Date();
    var tick = function() {
        el.style.opacity = +el.style.opacity + (new Date() - last) / 200;
        last = +new Date();
        if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 100);
        }
    };
    tick();
}

function fadeOut(el) {
    el.style.opacity = 0;
    var last = +new Date();
    var tick = function() {
        el.style.opacity = el.style.opacity - (new Date() - last) / 200;
        last = +new Date();

        if (+el.style.opacity > 0) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 100);
        } else {}
    };
    tick();
}

function settimedelayzero(number, element) {
    element.style.transitionDuration = "0s";
    element.style.WebkitTransitionDuration = "0s";
}

function settimedelay(number, element) {
    element.style.transitionDuration = settings[i].transition + "s";
    element.style.WebkitTransitionDuration = settings[i].transition + "s";
}