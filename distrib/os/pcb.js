/// <reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var Pcb = /** @class */ (function () {
        function Pcb(pid, memLocation, length, Priority, State, PC, Acc, Xreg, Yreg, Zflag) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = '0'; }
            if (Xreg === void 0) { Xreg = '0'; }
            if (Yreg === void 0) { Yreg = '0'; }
            if (Zflag === void 0) { Zflag = '0'; }
            this.pid = pid;
            this.memLocation = memLocation;
            this.length = length;
            this.Priority = Priority;
            this.State = State;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
        }
        return Pcb;
    }());
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
