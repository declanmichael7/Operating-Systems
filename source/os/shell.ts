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

module TSOS {
    export class Shell {
        // Properties
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";
        constructor() {
        }

        public init() {
            var sc;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;


            //whereami
            sc = new ShellCommand(this.shellWhereAmI,
                                  "whereami",
                                  "- Tells you where you are.");
            this.commandList[this.commandList.length] = sc;

            //rescue
            sc = new ShellCommand(this.shellRescue,
                                  "rescue",
                                  "- Save the princess.");
            this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            //date
            sc = new ShellCommand(this.shellDate,
                                  "date",
                                  "- Displays the current date");
            this.commandList[this.commandList.length] = sc;

            //time
            sc = new ShellCommand(this.shellTime,
                                  "time",
                "- Displays the current time");
            this.commandList[this.commandList.length] = sc;

            //status <string>
            sc = new ShellCommand(this.shellStatus,
                                  "status",
                                  "<string>- Set your status");
            this.commandList[this.commandList.length] = sc;

            //gameover
           sc = new ShellCommand(this.shellGameOver,
                                  "gameover",
                                  "- Ends your game");
            this.commandList[this.commandList.length] = sc;

            //load
            sc = new ShellCommand(this.shellLoad,
                                  "load",
                                  "- Loads the program in the \'User input\' field");
            this.commandList[this.commandList.length] = sc;

            //run
            sc = new ShellCommand(this.shellRun,
                                  "run",
                                  "<pid>- Runs a program in memory");
            this.commandList[this.commandList.length] = sc;

            //runall
            sc = new ShellCommand(this.shellRunall,
                                  "runall",
                                  "- Runs all programs in memory");
            this.commandList[this.commandList.length] = sc;

            //clear
            sc = new ShellCommand(this.shellClear,
                                  "clear",
                                  "<0-2 or all> - Clears specified partitions of memory");
            this.commandList[this.commandList.length] = sc;

            //ps
            sc = new ShellCommand(this.shellPS,
                                  "ps",
                                  "- gives a list of all of the process IDs and their location");
            this.commandList[this.commandList.length] = sc;

            //quantum
            sc = new ShellCommand(this.shellQuantum,
                                  "quantum",
                                  "<num> - Sets the quantum for RR scheduling");
            this.commandList[this.commandList.length] = sc;

            //kill
            sc = new ShellCommand(this.shellKill,
                                  "kill",
                                  "<pid> - Terminates a running process");
            this.commandList[this.commandList.length] = sc;

            //setschedule
            sc = new ShellCommand(this.shellsetSchedule,
                                  "setschedule",
                                  "- Sets the Schedule Algorithm. RR, FCFS, or Priority");
            this.commandList[this.commandList.length] = sc;

            //getschedule
            sc = new ShellCommand(this.shellgetSchedule,
                "getschedule",
                "- Tells you what the current schedule algorithm is");
            this.commandList[this.commandList.length] = sc;


            //format
            sc = new ShellCommand(this.shellFormat,
                                  "format",
                                  "- Formats the disk so that it can be loaded");
            this.commandList[this.commandList.length] = sc;

            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(promptStr);
        }

        public handleInput(buffer) {
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
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
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
        }

        public parseInput(buffer): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "ver":
                        _StdOut.putText("ver tells you what version of the Operating System you are running.")
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
                    case "gameover":
                        _StdOut.putText("Tests what happens when the OS finds an error");
                        break;
                    case "load":
                        _StdOut.putText("Checks if the user code is valid, then loads it into memory if there's space");
                        break;
                    case "run":
                        _StdOut.putText("Executes a program in memory that you have loaded");
                        break;
                    case "runall":
                        _StdOut.putText("Executes all programs that are available to run");
                        break;
                    case "clear":
                        _StdOut.putText("Resets the given partition of memory to free up space for another program");
                        break;
                    case "ps":
                        _StdOut.putText("Lists all of the processes that have been loaded, and their status");
                        break;
                    case "quantum":
                        _StdOut.putText("Changes how often the CPU switches between processes during RR scheduling");
                        break;
                    case "kill":
                        _StdOut.putText("Stops a process that is currently running, and removes it from memory");
                        break;
                    case "setschedule":
                        _StdOut.putText("Sets how the CPU decides what order to run processes in");
                        break;
                    case "getschedule":
                        _StdOut.putText("Returns the current scheduling algorthm");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
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
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }       
        public shellWhereAmI(args) {
            _StdOut.putText("You are between your keyboard and your chair");
            _DiskDeviceDriver.krnDiskRollOut(1);
        }
      
        public shellRescue(args) {
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
        }

        public shellDate(args) {
            _StdOut.putText("The current date is "+(DateTime.getMonth()+1)+"/"+DateTime.getDate());
        }

        public shellTime(args) {
            var Time = new Date();
            _StdOut.putText("The current time is " + Time.getHours() +":"+ Time.getMinutes() +":"+ Time.getSeconds());
        }


        public shellStatus(args) {
            if (args.length > 0) {
                StatusText = args.join(' ');
                _StdOut.putText("Status updated to: " + StatusText);
               document.getElementById("Status").innerHTML = "Status: " + StatusText;
            } else {
                _StdOut.putText("Usage: status <string>  Please supply a string");
            }
        }

        public shellGameOver(args) {
            _Kernel.krnTrapError("Manual Crash");
        }
        
        public shellLoad(args) {
            //A boolean to check if the command is valid. innocent until proven guilty
            var validCommand: boolean = true;
            program = (document.getElementById("taProgramInput") as HTMLTextAreaElement).value;
            if (program === "") {
                _StdOut.putText("There is no text in the input field");
                validCommand = false;
            }
            //Checks to make sure the program isn't too long
            else if (program.length > 770) {
                _StdOut.putText("That command is too long")
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
                        ((letter >= 97) && (letter <= 102))||
                         (letter== 32)){
                    }
                    else {
                        _StdOut.putText("Character at index " + (i+1) + " is invalid");
                        _StdOut.advanceLine();
                        validCommand = false;
                    }
                    i++;
                }
                if (validCommand) {
                    var priority;
                    if (args == "") {
                        //Just a default. 5 seemed like a nice round number, and there's plenty of room to put processes before
                        priority = 5;
                    }
                    else {
                        priority = parseInt(args);
                    }
                    if (_MemoryManager.partition0 || _MemoryManager.partition1 || _MemoryManager.partition2) {
                        
                        _Processes.push(new Pcb(processNum, null, null, priority, "Resident"));
                        _MemoryManager.assignMem(processNum);
                        _StdOut.putText("Process " + processNum + " is loaded in partition " + _Processes[processNum].memLocation);
                        i = 0;
                        var ind = 0;
                        var indHex: string;
                        var opCode: string;
                        while (i <= program.length) {
                            opCode = program.charAt(i - 1) + program.charAt(i);
                            if (((i - 1) % 3) == 0) {
                                if (ind <= 15) {
                                    var indHex = '0' + Utils.toHex(ind);
                                }
                                else {
                                    var indHex = Utils.toHex(ind);
                                }
                                _MemoryAccessor.writeMem(ind, _Processes[processNum].memLocation, opCode);
                                ind++;
                            }
                            i++
                        }
                        _Processes[processNum].length = ind - 1;
                        _Kernel.krnTrace("Length = " + _Processes[processNum].length);
                        for (i = _Processes[processNum].length; i < 255; i++) {
                            _MemoryAccessor.writeMem(i, _Processes[processNum].memLocation, '00');
                        }
                        i = 0;

                        console.log("Shell: Process " + processNum + " is " + _Processes[processNum].State);
                        Control.updatePCB();
                        processNum++;
                    }
                    else {
                        if (_Disk.isFormatted) {
                            var firstFrame = _DiskDeviceDriver.krnFindFreeFrame();
                            _DiskDeviceDriver.krnDiskLoad(_DiskDeviceDriver.krnFindFreeFrame(), program);
                            _Processes.push(new Pcb(processNum, parseInt(firstFrame), null, priority, "Disk"));
                            _Processes[processNum].length = program.length / 3;
                            _Kernel.krnTrace("Length = " + _Processes[processNum].length);
                            _StdOut.putText("Process " + processNum + " is loaded on the disk. First tsb is " + firstFrame);
                            Control.updatePCB();
                            processNum++;
                        }
                        else {
                            _StdOut.putText("Please format the disk first");
                        }
                    }
                }
            }
        }

        public shellRun(args) {
            if (args == "") {
                _StdOut.putText("Please give a process id");
                _StdOut.advanceLine();
            }
            else {
                if (_Processes[args] == undefined) {
                    _StdOut.putText("There is no process with that id");
                }
                else if (_Processes[args].State !== "Resident") {
                    _StdOut.putText("That process was " + _Processes[args].State);
                }
                else {
                    _CPU.runProgram(args);
                }
            }
        }

        public shellRunall() {
            _CPU.runProgram('all');
        }

        public shellClear(args) {
            if (args != "") {
                _MemoryAccessor.clearMem(args);
                if (args == "all") {
                    _StdOut.putText("All partitions clear");
                    i = 0;
                    while (i < _Processes.length) {
                        if (_Processes[i].State == "Resident") {
                            _Processes[i].State = "Unloaded";
                            _Processes[i].memLocation = null;
                        }
                        i++;
                    }
                }
                else {
                    _StdOut.putText("Partition " + args + " is clear");
                    i = 0;
                    while (i < _Processes.length) {
                        if (args == _Processes[i].memLocation) {
                            _Processes[i].State = "Unloaded";
                            _Processes[i].memLocation = null;
                        }
                        i++;
                    }
                }

            }
            else {
                _StdOut.putText("Please specify a partition to clear");
            }
            Control.updatePCB();
        }

        public shellPS() {
            i = 0;
            while (i < _Processes.length) {
                _StdOut.putText("Process " + _Processes[i].pid + " is " + _Processes[i].State);
                if (_Processes[i].State == "Resident") {
                    _StdOut.putText(" in Partition " + _Processes[i].memLocation);
                }
                _StdOut.advanceLine();
                i++;
            }
        }

        public shellQuantum(args) {
            if (args == "" || isNaN(args)) {
                _StdOut.putText("Please give a number");
            }
            else {
                _CPU.quantum = args;
                _StdOut.putText("The quantum is now " + _CPU.quantum);
            }
        }

        public shellKill(args) {
            if (readyQueue.indexOf(parseInt(args)) != -1) {
                _CPU.kill(args);
                _StdOut.putText("Process " + args + " has been " + _Processes[args].State);
            }
            else {
                console.log(args);
                console.log(readyQueue.indexOf(parseInt(args)));
                console.log(readyQueue.toString());
                _StdOut.putText("Please give a running pid");
            }
        }

        public shellsetSchedule(args) {
            if (args == "rr") {
                _CPU.Schedule = "RR";
                _StdOut.putText("The schedule is now " + _CPU.Schedule);
            }
            else if (args == "fcfs") {
                _CPU.Schedule = "FCFS";
                _StdOut.putText("The schedule is now " + _CPU.Schedule);
            }
            else if (args == "priority") {
                _CPU.Schedule = "Priority";
                _StdOut.putText("The schedule is now " + _CPU.Schedule);
            }
            else {
                _StdOut.putText("Please say either RR, FCFS, or Priority");
                console.log(args.toString());
            }
        }

        public shellgetSchedule() {
            _StdOut.putText("The current scheduler is " + _CPU.Schedule);
        }

        public shellFormat() {
            if (_Disk.isFormatted == true) {
                _StdOut.putText("The disk has already been formatted");
            }
            else {
                _DiskDeviceDriver.krnDiskFormat();
            }
        }
    }
}