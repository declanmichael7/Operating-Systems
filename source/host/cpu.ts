///<reference path="../globals.ts" />

/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            _Kernel.krnTrace(_Memory[this.PC]);
            //LDA
            if (_Memory[this.PC] == 'A9') {
                this.Acc = _Memory[this.PC + 1];
                document.getElementById('Acc').innerHTML = "" + this.Acc;
                this.PC = this.PC + 1;
                _Kernel.krnTrace('Acc = ' + this.Acc);
            }
            //LDA
            else if (_Memory[this.PC] == 'AD') {
                this.Acc = _Memory[Utils.toDecimal(_Memory[this.PC + 1])];
                this.PC = this.PC + 1;
                document.getElementById('Acc').innerHTML = "" + this.Acc;
            }
            //STA
            else if (_Memory[this.PC] == '8D') {
                _Memory[Utils.toHex(_Memory[this.PC + 1])] = this.Acc;
                document.getElementById(Utils.toHex(_Memory[this.PC + 1])).innerHTML = "" + this.Acc;
                this.PC = this.PC + 1;
            }
            //LDX
            else if (_Memory[this.PC] == 'A2') {
                this.Xreg = _Memory[this.PC + 1];
                document.getElementById('Xreg').innerHTML = "" + this.Xreg;
                this.PC = this.PC + 1;
                _Kernel.krnTrace('Xreg = ' + this.Xreg);
            }
            //LDX
            else if (_Memory[this.PC] == 'AE') {
                this.Xreg = _Memory[Utils.toDecimal(_Memory[this.PC + 1])];
                this.PC = this.PC + 1;
                document.getElementById('Xreg').innerHTML = "" + this.Xreg;
            }
            this.PC++;
            document.getElementById('PC').innerHTML = "" + this.PC;
            if (this.PC > _Memory.lengthUsed) {
                this.isExecuting = false;
                _Process1.state = 'Complete';
                //Reset the values of everything
                this.init();
                //update the CPU table
                document.getElementById('PC').innerHTML = "" + 0;
                document.getElementById('Acc').innerHTML = "" + 0;
                document.getElementById('Xreg').innerHTML = "" + 0;
                document.getElementById('Yreg').innerHTML = "" + 0;
                document.getElementById('Zflag').innerHTML = "" + 0;

            }
        }

        public runProgram(pid) {
            _Process1.state = "Running";
            _CPU.isExecuting = true;
        }
    }
}
