/*
 * Music and sample remote visualizer
 * A simple yet interactive wave form visualizer 
 * and text effect remote event receiver through xPlacesMobile
*/
// Page size according to browser view
int pageWidth = $(window).innerWidth();  // Width of canvas
int pageHeight = $(window).innerHeight();
float yoff = 0.0;        // 2nd dimension of perlin noise

int counter; 
final int DISPLAY_TIME = 3000; // 1000 ms = 1 seconds 
int lastTime;
float alphaVal = 255; 
float a = 5; 

String fadingText;

// Font properties
PFont font;
int textFontSize = 200;
int redColor = 255;
int greenColor = 255;
int blueColor = 255;

String[] files = {"http://kalb.it/drumpad/base"};
int numFiles = files.length;
int currentFile = 0;   // current file for audio = audioArray[0]
String[] soundFiles = {"http://kalb.it/drumpad/workit",
                  "http://kalb.it/drumpad/makeit",
                  "http://kalb.it/drumpad/doit",
                  "http://kalb.it/drumpad/makesus",
                  "http://kalb.it/drumpad/hour",
                  "http://kalb.it/drumpad/ever",
                  "http://kalb.it/drumpad/after",
                  "http://kalb.it/drumpad/workis",
                  "http://kalb.it/drumpad/over",
                  "http://kalb.it/drumpad/harder",
                  "http://kalb.it/drumpad/better",
                  "http://kalb.it/drumpad/faster",
                  "http://kalb.it/drumpad/stronger"};

String baseURL ="http://kalb.it/drumpad/";
String[] fileNames = {"workit", "makeit", "doit", "makesus", 
                      "hour", "ever", "after", "workis", "over", "harder", 
                      "better", "faster", "stronger"};                

int numSoundFiles = soundFiles.length;
String[] samples = { 
  "Work it", 
  "Make It",   
  "Do It", 
  "Make us",
  "Hour",
  "Ever",
  "After",
  "Work is",
  "Over",
  "Stronger",
  "Harder",
  "Better",
  "Faster",
  "Stronger"   
};
String fileExt;  // extension being used by the browser: .ogg or .mp3

// Global variables
Audio audio = new Audio();
int numAudio = 10; //The real samples number is 40 16HIGH1 16HIGH2 8LOW 
Audio[] audioArray = new Audio[numAudio];

int time;
String audioStatus;
boolean repeatLoop = false;  // Should the player loop?

lastAudio = -1;   // subscript of last audio element used     // optional

// Variables accessing getter/setter  from the JS environment
int getNumFiles () {return numFiles;}
String getSoundFiles () {return soundFiles;}
String getFileNames () {return fileNames;}
Audio[] getAudioArray () {return audioArray;}
Audio getAudio () {return audio;}
int getNumSoundFiles () {return numSoundFiles;}

void setFadingText(text) {
  fadingText = text;
}

// In setup()
void setup() {
  int i, y;
  // Setup the sketch
  size(pageWidth,pageHeight);
  smooth();
  fileExt = determineFileExt();
  
  if (audio == null) {
    noLoop();
    return;
  }

  frameRate(20);

  audio.preload = "none";    // wait until file is played to load it
  audio.addEventListener("loadstart", loadStart, false);
  audio.addEventListener("playing", playing, false);
  audio.addEventListener("pause", pause, false);
  audio.addEventListener("ended", ended, false);
  audio.addEventListener("error", error, false);

  audioArray[0] = audio;
  audio.preload = "none";    // wait until file is played to load it
  setSource(0, files[currentFile]);  // pick the initial audio file
  
  play(load(files[currentFile]));
  
  // Initialize font and color
  font = loadFont("LetterGothicStd-32.vlw"); 
	textFont(font); 
	textSize(textFontSize); 
	fill(redColor, greenColor, blueColor); 
	lastTime = millis();
	
}

void draw() {
	drawBGWave();
	
  if (audio == null) {
    text("Your browser does not handle the HTML 5 audio tag.  You ", 20, 30);
    text("may want to upgrade your browser to the current version.", 20, 60);
  return;
  }
	 showFadingText(fadingText);
}

void play(int num) {
  if (num >= 0 && num < numAudio) {
    audioArray[num].play();
    lastAudio = num;       // optional
  }
}  // play

void stop() {
  // Called stop playing the file by pausing it and setting the
  // time back to 0;
  audio.pause();
  audio.currentTime = 0;
  audioStatus = "Stopped";
}  // stop

void loadStart() {
  // LoadStart event processing
  audioStatus = "Loading";
}  // loadStart

void playing() {
  // Playing event processing
  audioStatus = "Playing";
}  // playing

void pause() {
  // Pause event processing.
  // There is no stop event but a "stop" causes a pause.  This
  // method checks to see if the current time = 0. If so it assumes
  // stopped
  if (audio.currentTime == 0)
    audioStatus = "Stopped";
  else
    audioStatus = "Paused";
}  // pause

void ended() {
  int j;
  // Ending event processing
  if (repeatLoop) {
    currentFile = (currentFile+1) % numFiles;
    setSource(0, files[currentFile]);
    setRadioButton(fileBtn, currentFile);
    audio.play();
  } else {
    audioStatus = "Finished playing";
  }
}  // ended

int load(String fileName) {
  // Determines the first available audioArray object,
  // loads the file into it and returns the subscript of that
  // Audio object.  The audio element must be created if it has
  // not been used before (=0).  If it has been used and the play
  // has been completed, then audioArray[i].ended will be true.
  int i;
  // find the first audio player that is not in use
  for (i = 1; i < numAudio; i++)
  {
    if (audioArray[i] == 0 // audioArray[i] has not been used
          || audioArray[i].ended)  // audioArray[i] is finished playing
    {
      // if needed, initialize the audioArray element
      if (audioArray[i] == 0) {
        audioArray[i] = new Audio();
        audioArray[i].addEventListener("playing", playing, false);
        audioArray[i].volume = audio.volume;
      }
      // set the source unless audio player already is using the file
      if (audioArray[i].src != fileName + fileExt) {
        setSource(i, fileName);
      }
      // return the player number
      return i;
    }
  }
  return -1;  // All the audioArray elements are in use
}  // load

String determineFileExt() {
  // returns the file extension that will be used
  String desiredExt;
  Audio aud = new Audio();
  if (aud.canPlayType && aud.canPlayType("audio/ogg")) {
    desiredExt = ".ogg";
  } else {
    desiredExt = ".mp4";
  }
  return desiredExt;
}  // determineFileExt

void error() {
  // error event processingsho
  audioStatus = "Error";
}  // error

void setSource(int num, String url) {
  // Called to set the source file.  Do not include the file extension
  // in the url.  It will be added here.  "num" specifies subscript of
  // the audio object that will be used.
  if (num >= 0 && num < numAudio) {
    audioArray[num].setAttribute("src", url + fileExt);
    if (num == 0)
      audioStatus = "File selected";
  }
} // setSource


void showFadingText(fadingText) {
	//Show fading text
  if (millis() - lastTime >= DISPLAY_TIME) {  // Time to display next image 

  	counter = int(random(samples.length)); 
		alphaVal = 255; 
		lastTime = millis();

	} 
	  fill(redColor, greenColor, blueColor, alphaVal);
    stroke(0);
	  textSize(textFontSize); 
	  text(fadingText, (pageWidth/2)-300, 200); 
	  alphaVal -= a; 
}
	


void drawBGWave() {
	background(51);

  fill(255);
  // We are going to draw a polygon out of the wave points
  beginShape(); 
  
  float xoff = 0;       // 2D Noise
 
  // Iterate over horizontal pixels
  for (float x = 0; x <= pageWidth; x += 0.5) {
    // Calculate a y value according to noise, map to 
    float y = map(noise(xoff, yoff), 0, 1, 200,500); // 2D Noise
 
    // Set the vertex
    vertex(x, y); 
    // Increment x dimension for noise
    xoff += 0.05;
  }
  // increment y dimension for noise
  yoff += 0.01;
  vertex(pageWidth, pageHeight);
  vertex(0, pageHeight);
  endShape(CLOSE);
}
