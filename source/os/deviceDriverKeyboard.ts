///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123))) {  // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if (
                ((keyCode >= 48) && (keyCode <= 57))||   // digits
                (keyCode == 32)                     ||   // space
                (keyCode == 8)                      ||   // backspace
                (keyCode == 9)                      ||   // tab
                (keyCode == 13)                     ||   // enter
                (keyCode == 38)                     ||   // up arrow
                (keyCode == 40)                     ||   // down arrow
                (keyCode == 20)                     ||   //Caps Lock
                (keyCode == 186)                    ||   // Semi-colon
                (keyCode == 187)                    ||   // Equal Sign
                (keyCode == 188)                    ||
                (keyCode == 189)                    ||   // Comma
                (keyCode == 190)                    ||   // Period
                (keyCode == 191)                    ||   // Forward slash
                (keyCode == 192)                    ||   // Grave accent (`)
                (keyCode == 219)                    ||   // Open Bracket
                (keyCode == 220)                    ||   // Back Slash
                (keyCode == 221)                    ||   // Close Bracket
                (keyCode == 222)                         // Single Quote
               ) {                         
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
        }
    }
}
