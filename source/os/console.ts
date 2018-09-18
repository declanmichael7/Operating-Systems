///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "") {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    //Before the buffer gets reset, put the command into the command history
                    previousCommand[previousCommand.length] = this.buffer;
                    // ... and reset our buffer.
                    this.buffer = "";
                    //Also, reset the command index so enter resets everything
                    commandIndex = 0;
                }
                else if (chr === String.fromCharCode(8)) { //Backspace
                    //Make sure we don't erase the prompt
                    if (this.currentXPosition > _DrawingContext.measureText(this.currentFont, this.currentFontSize, promptStr)) {
                        //Find the last character that was put on the screen
                        var previousChar: string = this.buffer.charAt(this.buffer.length - 1);
                        //Get the distance we have to go backwards
                        var distance = _DrawingContext.measureText(this.currentFont, this.currentFontSize, previousChar);
                        //Move us back to that point
                        this.currentXPosition = this.currentXPosition - distance;
                        //Clear the space
                        _DrawingContext.clearRect(this.currentXPosition,
                            (this.currentYPosition - (_DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize))),
                            distance,
                            (_DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin) +2); // I added the +2 because there was a pixel or two left over when trying to backspace [ or ]
                        //And remove the character from the buffer
                        this.buffer = this.buffer.slice(0, this.buffer.length - 1);
                    }
                }
                else if (chr === String.fromCharCode(38) && !isShifted) { //Up arrow (also, for some reason if you don't specify !isShifted, it prints off &)
                    //First, make sure you aren't going past where the command history can go
                    if (commandIndex < previousCommand.length) {
                        //First, you have to remove the command that is already there:
                        _DrawingContext.clearRect(_DrawingContext.measureText(this.currentFont, this.currentFontSize, promptStr), //but don't erase the prompt string
                            (this.currentYPosition - (_DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize))),
                            500,
                            (_DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin));
                        //Reset your position to just next to the prompt
                        this.currentXPosition = _DrawingContext.measureText(this.currentFont, this.currentFontSize, promptStr);
                        //And reset the buffer
                        this.buffer = "";
                        //Increase the commandIndex, so the more times the user presses up, the further back they go
                        commandIndex++;
                        //Draw the command on the screen and put in the buffer
                        this.putText(previousCommand[previousCommand.length - commandIndex]);
                        this.buffer = previousCommand[previousCommand.length - commandIndex];
                    }
                }
                else if (chr === String.fromCharCode(40) && !isShifted) { //Down arrow (also, for some reason if you don't specify !isShifted, it prints off "("  )
                    //First, make sure you aren't going past where the command history can go
                    if (commandIndex >= previousCommand.length) {
                        //First, you have to remove the command that is already there:
                        _DrawingContext.clearRect(_DrawingContext.measureText(this.currentFont, this.currentFontSize, promptStr), //but don't erase the prompt string
                            (this.currentYPosition - (_DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize))),
                            500,
                            (_DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin));
                        //Reset your position to just next to the prompt
                        this.currentXPosition = _DrawingContext.measureText(this.currentFont, this.currentFontSize, promptStr);
                        //And reset the buffer
                        this.buffer = "";
                        commandIndex--;
                        this.putText(previousCommand[previousCommand.length - commandIndex]);
                        this.buffer = previousCommand[previousCommand.length - commandIndex];
                    }
                }
                //And now for the punctuation. For some reason these weren't caught by the else below and weren't being written, so I specified them here
                else if (chr === String.fromCharCode(48) && isShifted) {
                    this.putText(")");
                    this.buffer += ")";
                }
                else if (chr === String.fromCharCode(49) && isShifted) {
                    this.putText("!");
                    this.buffer += "!";
                }
                else if (chr === String.fromCharCode(50) && isShifted) {
                    this.putText("@");
                    this.buffer += "@";
                }
                else if (chr === String.fromCharCode(51) && isShifted) {
                    this.putText("#");
                    this.buffer += "#";
                }
                else if (chr === String.fromCharCode(52) && isShifted) {
                    this.putText("$");
                    this.buffer += "$";
                }
                else if (chr === String.fromCharCode(53) && isShifted) {
                    this.putText("%");
                    this.buffer += "%";
                }
                else if (chr === String.fromCharCode(54) && isShifted) {
                    this.putText("^");
                    this.buffer += "^";
                }
                else if (chr === String.fromCharCode(55) && isShifted) {
                    this.putText("&");
                    this.buffer += "&";
                }
                else if (chr === String.fromCharCode(56) && isShifted) {
                    this.putText("*");
                    this.buffer += "*";
                }
                else if (chr === String.fromCharCode(57) && isShifted) {
                    this.putText("(");
                    this.buffer += "(";
                }
                else if (chr === String.fromCharCode(186) && isShifted) {
                    this.putText(":");
                    this.buffer += ":";
                }
                else if (chr === String.fromCharCode(186)) {
                    this.putText(";");
                    this.buffer += ";";
                }
                else if (chr === String.fromCharCode(187) && isShifted) {
                    this.putText("+");
                    this.buffer += "+";
                }
                else if (chr === String.fromCharCode(187)) {
                    this.putText("=");
                    this.buffer += "=";
                }
                else if (chr === String.fromCharCode(188) && isShifted) {
                    this.putText("<");
                    this.buffer += "<";
                }
                else if (chr === String.fromCharCode(188)) {
                    this.putText(",");
                    this.buffer += ",";
                }
                else if (chr === String.fromCharCode(189) && isShifted) {
                    this.putText("_");
                    this.buffer += "_";
                }
                else if (chr === String.fromCharCode(189)) {
                    this.putText("-");
                    this.buffer += "-";
                }
                else if (chr === String.fromCharCode(190) && isShifted) {
                    this.putText(">");
                    this.buffer += ">";
                }
                else if (chr === String.fromCharCode(190)) {
                    this.putText(".");
                    this.buffer += ".";
                }
                else if (chr === String.fromCharCode(191) && isShifted) {
                    this.putText("?");
                    this.buffer += "?";
                }
                else if (chr === String.fromCharCode(191)) {
                    this.putText("/");
                    this.buffer += "/";
                }
                else if (chr === String.fromCharCode(192) && isShifted) {
                    this.putText("~");
                    this.buffer += "~";
                }
                else if (chr === String.fromCharCode(192)) {
                    this.putText("`");
                    this.buffer += "`";
                }
                else if (chr === String.fromCharCode(219) && isShifted) {
                    this.putText("{");
                    this.buffer += "{";
                }
                else if (chr === String.fromCharCode(219)) {
                    this.putText("[");
                    this.buffer += "[";
                }
                else if (chr === String.fromCharCode(220) && isShifted) {
                    this.putText("|");
                    this.buffer += "|";
                }
                else if (chr === String.fromCharCode(220)) {
                    this.putText("\\");
                    this.buffer += "\\";  // "\" Is also an escape character, so we need two in order to not screw everything up
                }
                else if (chr === String.fromCharCode(221) && isShifted) {
                    this.putText("}");
                    this.buffer += "}";
                }
                else if (chr === String.fromCharCode(221)) {
                    this.putText("]");
                    this.buffer += "]";
                }
                else if (chr === String.fromCharCode(222) && isShifted) {
                    this.putText("\"");
                    this.buffer += "\""; // It was giving us problems earlier, but now we need "\". What a heartwarming story
                }
                else if (chr === String.fromCharCode(222)) {
                    this.putText("'");
                    this.buffer += "'";
                }
                else {
                    // This is a "normal" character, so ...
                    // ... make sure it doesn't need to go to the next line...
                    if (this.currentXPosition > 495) {
                        this.currentXPosition = 0;
                        this.currentYPosition += _DefaultFontSize +
                            _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                            _FontHeightMargin;
                    }
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
         }

        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;

            // TODO: Handle scrolling. (iProject 1)
        }
    }
 }
