// KISA
// Keep It Simple Audio version 6
// James Brink  brinkje@plu.edu
// 3/28/12  4/12/12   6/18/12

// The constants can be modified.
// Change it with $(window).height(); and $(window).width();
int width = $(window).width();  // Width of canvas
int height = $(window).height(); // Height of canvas

// It is assumed that both .ogg and .mp3 versions of the files are available
// in the same folder.  The file names must be complete URLs except for the
// ending .ogg or .mp3 which must be omitted. It will be added as needed for
// the browser.  Use the prefix "file:///" or "http:// as appropriate.
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

String[] chordFiles = {"http://personalpages.tds.net/~jimdani74/jenHum01",
                  "http://personalpages.tds.net/~jimdani74/jenHum02",
                  "http://personalpages.tds.net/~jimdani74/jenHum03"};
int numChordFiles = chordFiles.length;

String fileExt;  // extension being used by the browser: .ogg or .mp3

// Global variables
Audio audio = new Audio();
int numAudio = 10; //The real samples number is 40 16HIGH1 16HIGH2 8LOW 
Audio[] audioArray = new Audio[numAudio];

int time;
String audioStatus;
CircleButton playBtn, pauseBtn, stopBtn;
CircleButton volumeDownBtn, volumeUpBtn, timeDownBtn, timeUpBtn;
CircleButton[] soundFilesBtn = new CircleButton[numSoundFiles];
CircleButton chordBtn;
ToggleButton[] fileBtn = new ToggleButton[numFiles];
ToggleButton loopBtn, autoplayBtn;

boolean repeatLoop = false;  // Should the player loop?

int xSoundFiles = 388;  // Location of first sound file
int ySoundFiles = 195;
lastAudio = -1;   // subscript of last audio element used     // optional

// display items
//Display dis = new Display(audioArray, width, height, false);
//ToggleButton displayOnBtn;

// Variables accessing getter/setter  from the JS environment
int getNumFiles () {return numFiles;}
String getSoundFiles () {return soundFiles;}
String getFileNames () {return fileNames;}
Audio[] getAudioArray () {return audioArray;}
int getNumSoundFiles () {return numSoundFiles;}

void setup() {
  int i, y;
  // Setup the sketch
  size(width, height);
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

  playBtn = new CircleButton(130, 145, "Play");
  pauseBtn = new CircleButton(230, 145, "Pause");
  stopBtn = new CircleButton(330, 145, "Stop");
  volumeDownBtn = new CircleButton(165, 170, "Volume down");
  volumeUpBtn = new CircleButton(270, 170, "Volume up");
  timeDownBtn = new CircleButton(165, 195, "Time down");
  timeUpBtn = new CircleButton(270, 195, "Time up");
  loopBtn = new ToggleButton(165, 220, "Loop", true);
  autoplayBtn= new ToggleButton(270, 220, "Autoplay", true);
  y = 245;
  for (i = 0; i < numFiles; i++) {
    fileBtn[i] = new ToggleButton(20, y, files[i], false);
    y += 25;
  }
  fileBtn[currentFile].setState(true);

  audioArray[0] = audio;
  for (i = 0; i < numSoundFiles; i++) {
    soundFilesBtn[i] = new CircleButton(xSoundFiles, ySoundFiles,
         fileNames[i]);
    ySoundFiles += 25;
  }
  ySoundFiles += 25;  // leave a blank line
  chordBtn = new CircleButton(xSoundFiles, ySoundFiles, "Chord");
  ySoundFiles += 25;

  audioStatus = "";
  setSource(0, files[currentFile]);  // pick the initial audio file
  // display
  displayOnBtn = new ToggleButton(20, 20, "Display on/off", false);
} // setup

void draw() {
  // Draws the sketch on the canvas
  background(#FFFFFF);
  fill(#FF0000);
  if (audio == null) {
    text("Your browser does not handle the HTML 5 audio tag.  You ", 20, 30);
    text("may want to upgrade your browser to the current version.", 20, 60);
  return;
  }

  textAlign(CENTER);
  text("iDaft Tribute", width/2, 30);
  text("Source file: " + audio.src, width/2, 60);
  text("Status: " + audioStatus, width/2, 80);
  text("Current time: " + round(audio.currentTime)
       + " sec.   Length: " + round(audio.duration)+ " sec.", width/2, 100);
  text("Volume (0 to 1): " + round(10 * audio.volume)/10.0, width/2, 120);

  playBtn.draw();
  pauseBtn.draw();
  //stopBtn.draw();
  //volumeDownBtn.draw();
  //volumeUpBtn.draw();
  //timeDownBtn.draw();
  //timeUpBtn.draw();
  //loopBtn.draw();
  //autoplayBtn.draw();
  for (i = 0; i < numFiles; i++) {
    fileBtn[i].draw();
  }

  // draw sound and chord buttons
  //fill(#DDDD99);
  //rect(xSoundFiles - 18, ySoundFiles - 143, 119, 133);
  for (i = 0; i < numSoundFiles; i++) {
    soundFilesBtn[i].draw();
  }
  chordBtn.draw();
  /*
  if (lastAudio > 0)                         // optional
    text("Last audio player: " + lastAudio,  // optional
        xSoundFiles - 10, ySoundFiles - 47); // optional
  */
  // draw the display items
  dis.draw();
  displayOnBtn.draw();
}  // draw

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

void play(int num) {
  if (num >= 0 && num < numAudio) {
    audioArray[num].play();
    lastAudio = num;                        // optional
  }
}  // play

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
  // error event processing
  audioStatus = "Error";
}  // error

void mouseClicked(){ 
  // Mouse clicked event processing
  double v, t;
  int i;
  int[] chordPlayer = new int[numChordFiles];
  if (playBtn.isOver()) {
    audio.play();
  } else if (pauseBtn.isOver()) {
    audio.pause();
  } else if (stopBtn.isOver()) {
    stop();
  } else if (volumeUpBtn.isOver()) {
    v = audio.volume + 0.1;
    adjustVolume(v);
  } else if (volumeDownBtn.isOver()) {
    v = audio.volume - 0.1;
    adjustVolume(v);
  } else if (timeUpBtn.isOver()) {
    t = audio.currentTime + 0.1 * audio.duration;
    audio.currentTime = constrain(t, 0, audio.duration);
  } else if (timeDownBtn.isOver()) {
    t = audio.currentTime - 0.1 * audio.duration;
    audio.currentTime = constrain(t, 0, audio.duration);
  } else if (loopBtn.isOver()) {
    loopBtn.toggleState();
    repeatLoop = loopBtn.getState();
  } else if (autoplayBtn.isOver()) {
    autoplayBtn.toggleState();
    audio.autoplay = autoplayBtn.getState();
  } else if (chordBtn.isOver()) {
    for (i = 0; i < numChordFiles; i++)
      chordPlayer[i] = load(chordFiles[i]);
    /*** don't do this - it stall the program! ***
    while(audioArray[chordPlayer[0]].readyState != 4
          || audioArray[[chordPlayer[1]].readyState != 4
          || audioArray[[chordPlayer[2]].readyState != 4) {
    // waste time
    }
    */
    for (i = 0; i < numChordFiles; i++)
      play(chordPlayer[i]);
  } else if (displayOnBtn.isOver()) {
    displayOnBtn.toggleState();
    dis.turnDisplayOn(displayOnBtn.getState());
  } else {
    for (i = 0; i < numFiles; i++) {
      if (fileBtn[i].isOver()) {
        setRadioButton(fileBtn, i);
        currentFile = i;
        setSource(0, files[currentFile]);
        return;
      }
    }
    for (i = 0; i < numSoundFiles; i++) {
      if (soundFilesBtn[i].isOver()) {
        play(load(soundFiles[i]))
      }
    }
  }

}  // mouseClicked

void setRadioButton(ToggleButton[] btnArray, int i)  {
  int j;
  for (j = 0; j < numFiles; j++)
    btnArray[j].setState(false);
  btnArray[i].setState(true);
} // setRadioButton

void adjustVolume(double v) {
  int i;
  v = constrain(v, 0, 1);
  for (i = 0; i < numAudio; i++) {
     if (audioArray[i] != 0)
       audioArray[i].volume = v;
  }
}  // adjustVolume
