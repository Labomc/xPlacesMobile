class CircleButton {
  // Used to draw labeled button
  int centerX, centerY;
  String label;
  int radius = 9;
  int diameter;
  color col = #f3f2e2;
  CircleButton(int centerXX, int centerYY, String labelL) {
    // Constructor (centerXX, centerYY) is the center of the circle.
    // labelL is the button's label shown on its right.
    centerX = centerXX;
    centerY = centerYY;
    label = labelL
    ellipseMode(CENTER);
    diameter = 2 * radius;
  }

  boolean isOver() {
    // Determines the mouse is over the circle.
    return sq(mouseX - centerX) + sq(mouseY - centerY) <= sq(radius);
  }

  void draw() {
    // Draws the circle button with its labelon the right
    fill(col);
    ellipse(centerX, centerY, diameter, diameter);
    fill(0);
    textAlign(CORNER);
    text(label, centerX + radius + 5, centerY + 5);
  }

  void setLabel(String s) {
    label = s;
  }

}  // end of CircleButton class

class ToggleButton extends CircleButton{
  boolean state;
  color trueCol = #f3f2e2;
  color falseCol = #f3f2e2;

  ToggleButton(int centerXX, int centerYY, String labelL,
              boolean isTrue)
  {
    super(centerXX, centerYY, labelL);
    state = isTrue;
    setColor();
  } // constructor ToggleButton
  
  void setColor() {
    // this method is intended to only be used "internally"
    if (state)
      col = trueCol;
    else
      col = falseCol;
  } // setColor      

  boolean getState() {
    return state;
  } // getState

  void setState(boolean isTrue) {
    state = isTrue;
    setColor();
  } // setState
  
  void toggleState() {
    state = !state;
    setColor();        
  }  // toggleState
} // end of ToggleButton class

/**
 * A global function that allows toggle buttons to 
 * be used as radio buttons
 */
void setRadioButton(ToggleButton[] btnArray, int i)  {
  int j;
  for (j = 0; j < btnArray.length; j++)
    btnArray[j].setState(false);
  btnArray[i].setState(true);
} // setRadioButton  
