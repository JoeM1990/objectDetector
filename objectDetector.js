let video = null; // video element
let detector = null; // detector object
let detections = []; // store detection result
let videoVisibility = true;
let detecting = false;

// global HTML element
const toggleVideoEl = document.getElementById('toggleVideoEl');
const toggleDetectingEl = document.getElementById('toggleDetectingEl');

// set cursor to wait until video elment is loaded
document.body.style.cursor = 'wait';


function preload() {
 
  detector = ml5.objectDetector('cocossd');
  console.log('detector object is loaded');

//   video.hide();
}


function setup() {
  // create canvas element with 640 width and 480 height in pixel
  createCanvas(640, 480);
  // Creates a new HTML5 <video> element that contains the audio/video feed from a webcam.
  // The element is separate from the canvas and is displayed by default.
  video = createCapture(VIDEO);
  video.size(640, 480);
  console.log('video element is created');
  video.elt.addEventListener('loadeddata', function() {
    // set cursor back to default
    if (video.elt.readyState >= 2) {
      document.body.style.cursor = 'default';
      console.log('video element is ready! Click "Start Detecting" to see the magic!');
    }
  });
}


function draw() {
  if (!video || !detecting) return;
  // draw video frame to canvas and place it at the top-left corner
  image(video, 0, 0);
  // draw all detected objects to the canvas
  for (let i = 0; i < detections.length; i++) {
    drawResult(detections[i]);
  }
}


function drawResult(object) {
  drawBoundingBox(object);
  drawLabel(object);
}


function drawBoundingBox(object) {
  // Sets the color used to draw lines.
  stroke('green');
  // width of the stroke
  strokeWeight(4);
  // Disables filling geometry
  noFill();
  // draw an rectangle
  // x and y are the coordinates of upper-left corner, followed by width and height
  rect(object.x, object.y, object.width, object.height);
}


function drawLabel(object) {
  // Disables drawing the stroke
  noStroke();
  // sets the color used to fill shapes
  fill('white');
  // set font size
  textSize(24);
  // draw string to canvas
  text(object.label, object.x + 10, object.y + 24);
}


function onDetected(error, results) {
  if (error) {
    console.error(error);
  }
  detections = results;
  // keep detecting object
  if (detecting) {
    detect(); 
  }
}

function detect() {
  // instruct "detector" object to start detect object from video element
  // and "onDetected" function is called when object is detected
  detector.detect(video, onDetected);
}

function toggleVideo() {
  if (!video) return;
  if (videoVisibility) {
    video.hide();
    toggleVideoEl.innerText = 'Show Video';
  } else {
    video.show();
    toggleVideoEl.innerText = 'Hide Video';
  }
  videoVisibility = !videoVisibility;
}

function toggleDetecting() {
  if (!video || !detector) return;
  if (!detecting) {
    detect();
    toggleDetectingEl.innerText = 'Stop Detecting';
  } else {
    toggleDetectingEl.innerText = 'Start Detecting';
  }
  detecting = !detecting;
}