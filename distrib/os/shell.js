///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = /** @class */ (function () {
        function Shell() {
            // Properties
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            //whereami
            sc = new TSOS.ShellCommand(this.shellWhereAmI, "whereami", "- Tells you where you are.");
            this.commandList[this.commandList.length] = sc;
            //rescue
            sc = new TSOS.ShellCommand(this.shellRescue, "rescue", "- Save the princess.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            //date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the current date");
            this.commandList[this.commandList.length] = sc;
            //time
            sc = new TSOS.ShellCommand(this.shellTime, "time", "- Displays the current time");
            this.commandList[this.commandList.length] = sc;
            //status <string>
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string>- Set your status");
            this.commandList[this.commandList.length] = sc;
            //gameover
            sc = new TSOS.ShellCommand(this.shellGameOver, "gameover", "- Ends your game");
            this.commandList[this.commandList.length] = sc;
            //load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Loads the program in the \'User input\' field");
            this.commandList[this.commandList.length] = sc;
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "ver":
                        _StdOut.putText("ver tells you what version of the Operating System you are running.");
                        break;
                    case "help":
                        _StdOut.putText("help displays a list of (hopefully) valid commands.");
                        break;
                    case "shutdown":
                        _StdOut.putText("shutdown disables the OS");
                        break;
                    case "cls":
                        _StdOut.putText("cls clears the text off of the screen");
                        break;
                    case "man":
                        _StdOut.putText("man, the command you are using now, gives you details on each command");
                        break;
                    case "trace":
                        _StdOut.putText("Disables messages in the host log");
                        break;
                    case "rot13":
                        _StdOut.putText("rot13 shifts each character in your input 13 characters");
                        break;
                    case "prompt":
                        _StdOut.putText("prompt changes the symbol on the left");
                        break;
                    case "whereami":
                        _StdOut.putText("Tells you where you are");
                        break;
                    case "rescue":
                        _StdOut.putText("Defeat Bowser and save the princess (possibly)");
                        break;
                    case "date":
                        _StdOut.putText("Displays the current date, according to your computer's clock");
                        break;
                    case "time":
                        _StdOut.putText("Displays the current time, according to your computer's clock");
                        break;
                    case "status":
                        _StdOut.putText("Update your status (Mario isn't always saving the world)");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellWhereAmI = function (args) {
            _StdOut.putText("You are between your keyboard and your chair");
        };
        Shell.prototype.shellRescue = function (args) {
            if (RescueCount < 7) {
                _StdOut.putText("Sorry, but our princess is in another castle!");
                RescueCount++;
            }
            else if (RescueCount >= 7 && _SarcasticMode) {
                _StdOut.putText("You already rescued the princess, genius");
            }
            else if (RescueCount >= 7) {
                _StdOut.putText("Thank you! Your quest is over");
            }
        };
        Shell.prototype.shellDate = function (args) {
            _StdOut.putText("The current date is " + (DateTime.getMonth() + 1) + "/" + DateTime.getDate());
        };
        Shell.prototype.shellTime = function (args) {
            var Time = new Date();
            _StdOut.putText("The current time is " + Time.getHours() + ":" + Time.getMinutes() + ":" + Time.getSeconds());
        };
        Shell.prototype.shellStatus = function (args) {
            if (args.length > 0) {
                StatusText = args.join(' ');
                _StdOut.putText("Status updated to: " + StatusText);
                document.getElementById("Status").innerHTML = "Status: " + StatusText;
            }
            else {
                _StdOut.putText("Usage: status <string>  Please supply a string");
            }
        };
        Shell.prototype.shellGameOver = function (args) {
            _Kernel.krnTrapError("Manual Crash");
        };
        Shell.prototype.shellLoad = function (args) {
            //A boolean to check if the command is valid. innocent until proven guilty
            var validCommand = true;
            program = document.getElementById("taProgramInput").value;
            if (program === "") {
                _StdOut.putText("There is no text in the input field");
                validCommand = false;
            }
            else {
                i = 0;
                var letter;
                while (i < program.length) {
                    letter = program.charCodeAt(i);
                    //If it isn't 0-9 or A-F, or a space
                    if (((letter >= 48) && (letter <= 57)) ||
                        ((letter >= 65) && (letter <= 70)) ||
                        ((letter >= 97) && (letter <= 102)) ||
                        letter == 32) {
                        //We'll have something to do in here once we do more than just validate the code. For now, it will be left empty
                    }
                    else {
                        _StdOut.putText("Character at index " + i + " is invalid");
                        _StdOut.advanceLine();
                        validCommand = false;
                    }
                    i++;
                }
                if (validCommand) {
                    _StdOut.putText("Command is validated");
                }
            }
        };
        return Shell;
    }());
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
