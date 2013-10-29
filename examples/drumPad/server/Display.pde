// Display (for KISA 6 and above)
// Can be used with nearly any Processing.js program that has
// an array of Audio objects.
// Displays info on audio array elements
// James Brink  brinkje@plu.edu
// 4/4/12

// Displays information about an array of Audio objects.
// The information shown for each object is 
//   Source file URL  (or "unused" if the object is nill)
//   Current location (moving triangle and line)
//   Buffered ranges (bar graph)
//   Seekable ranges (bar graph)
// In addition, the colors of the bars depend upon the Network
// and Ready states.

public class Display {
  Audio[] audioArray;
  int baseWidth, extendedWidth;
  int baseHeight, extendedHeight;
  boolean displayOn;
  
  // Colors and strings for the KeyChart explaing bar colors
  color[] networkColors = {#FF0000, #00FF00, #FFFF00, #CCCCCC, #000000};
  color[] readyColors = {#CC0000, #FFAA00, #CCCC00, #FFAAAA, #00CC00};
  String[] networkLabels = {"Network empty", "Network idle", "Network loading",
            "Network no source"};
  String[] readyLabels = {"Have nothing", "Have meta data", 
            "Have current data", "Have future data", "Have enough data"};

  public Display(Audio[] a, int w, int h, boolean on) {
    /* Parameters:
     * a:  An audio array to be displayed
     * w:  The width of the canvas before the display is added
     * h:  The height of the canvas before the display is added
     * on:  Boolean:  Should the display be shown (true or false)
    */
    audioArray = a;
    baseWidth = w;
    baseHeight = h;
    displayOn = on;
    setSize();
  }  // constructor Display

  void setSize() {
    if (displayOn) {
      extendedWidth = baseWidth + 500;
      extendedHeight = max(baseHeight + 210, audioArray.length * 72);
      size(extendedWidth, extendedHeight);
    } else {
      size(baseWidth, baseHeight);
    }
  }  // setSize
  
  public void turnDisplayOn(boolean on) {
    /* Parameter
     * on:  Boolean: turn the display on (true) or off (false)
     */
    displayOn = on;
    setSize();
  } // turnDisplayOn

  void drawKeyChart() {
    // draw the chart explaining bar colors
    int wide = 130;
    int xLBorder = 80;
    int xLeft = xLBorder+10;
    int xCenter = xLeft+wide+10;
    int xRight = xCenter+wide-10;
    int xRBorder = xRight+10;
    int borderWide = xRBorder - xLBorder;
    int y = baseHeight + 40;
    int i;
    stroke(#000000);
    fill(#000000);
    text("Bar Colors represent the specified state", xLeft, y);
    y += 25;
    
    fill(#CCCCFF);
    rect(xLBorder, y - 20, borderWide, 160);
    line(xCenter - 10, y - 20, xCenter - 10, y + 140);
    fill(#000000); 
    text("Network state", xLeft, y);
    text("Ready state", xCenter, y);
    y += 20;
    text("(Buffered bar)", xLeft, y);
    text("(Seekable bar)", xCenter, y);

    y += 2;
    line(xLBorder, y, xRBorder, y);
    y += 20;
    for (i = 0; i < 5; i++) {
      if (i < 4) {
        fill(networkColors[i]);
        rect(xLeft, y - 11, 12, 12);
        fill(#000000);
        text(networkLabels[i], xLeft+17, y);
        line(xLBorder, y+5, xRBorder, y+5);
      }
      fill(readyColors[i]);
      rect(xCenter, y - 11, 12, 12);
      fill(#000000);
      text(readyLabels[i], xCenter+17, y);
      
      y += 22;

    } 
  } // drawKeyChart

  public void draw() {
    // draw the display only if there is an audioArray
    // and the display is turned on by KISA6
    if (audioArray != null && displayOn) {
      fill(#000000);
      displayPlots();
      drawKeyChart();
    }
  }  // draw


  void displayPlots() {
    int i;
    int x, y;
    x = 500;
    y = 10;
    textAlign(LEFT);
    for (i = 0; i < audioArray.length; i++) {
      drawPlot(i, x, y);
      y += 72;
    }
  } // displayPlots

  void drawPlot(int i, int x, int y) {
    if (audioArray[i] != 0)
      text(i + ": " + audioArray[i].src, x, y);
    else
      text(i + ": " + "Unused", x, y);
    if (audioArray[i] == null || audioArray[i] == 0) {
      return;
    } 

    y += 20;
    x += 30;
    try {
      y += 17;
      text("Buffered " + i, x, y);
      timeRangeBar(audioArray[i].buffered, x+80, y, 280, 17, audioArray[i].duration,
              networkColors[audioArray[i].networkState]);
      y += 17;
      text("Seekable " + i, x, y);
  
      timeRangeBar(audioArray[i].seekable, x+80, y, 280, 17, audioArray[i].duration,
              readyColors[audioArray[i].readyState]);
      y -= 34;
      text("Current " + i, x, y);
      locationLine(audioArray[i].currentTime, x+80, y, 280,
               17, audioArray[i].duration, #C0C0FF)

    } catch (e) {
      text(e, 500, y);
    }
  } // drawPlot

  void timeRangeBar(TimeRange tr, int x, int y, int wide,
                 int high, double duration, color c)
  { // Shows the ranges described by the TimeRange structure in a bar graph
    // tr = the TimeRange stucture,
    // x, y = the upper left corner of the box for the bar graph
    // wide, high = the width and height of the box the bar graph
    // duration = the duration of the audio file (in seconds)
    // c the color of the bar.
    int i;
    double ratio;
    double begin, stop;

    if (tr == null)
      text("N/A", x, y);
    else {
      // draw box representing the complete time of the audio file
      fill(#FFFFFF);
      rect(x, y-15, wide, high);
      // draw the bars specified by the TimeRange structure
      fill(c);
      ratio = wide/duration;
      try { //process each of the ranges separately
        for (i = 0; i < tr.length; i++) {
          begin = tr.start(i) * ratio;
          stop = tr.end(i) * ratio;
          rect(x+begin, y-15, (stop - begin), high);
        }
      } catch (e) {
        // ignore errors
      }
      // add the end time of the last range as text
      fill(#000000);
      try {
        text("  " + roundTo(tr.end(tr.length-1)), x, y);
      } catch (e) {
      }

    }
  } // timeRangeBar

  void locationLine(double currentTime, int x, int y, int wide,
                 int high, double duration, color c)
  { // Works in conjunction with TimeRangeBar.  Draws a
    // triangle and a line representing the currentTime
    // currentTime = the current time
    // x, y = the upper left corner of the box for the bar graph
    // wide, high = the width and height of the box the bar graph
    // duration = the duration of the audio file (in seconds)
    // c the color of the triangle.
    double ratio;
    double begin, center, stop;
    try {
      if (duration != 0)
        ratio = wide/duration;
      else
        ratio = 0;
      center = currentTime * ratio;
      begin = center - 9;
      stop = center + 9;
      fill(c);
      triangle(x+begin, y-(high-3), x+stop, y-(high-3), x+center, y+2);
      fill(#000000);
      stroke(#0000FF);
      line(x+center, y+3, x+center, y+37); // 37 = (2*17) + 3
      stroke(#000000);
      text("  " + roundTo(currentTime), x, y);
    } catch (e) {
    text("Exception: " +e, x, y);
    }
  } // locationLine

  double roundTo(double x) {
    // rounds to nearest 1000th
    return round(1000 * x) / 1000;
  }  // roundTo
} // class Display