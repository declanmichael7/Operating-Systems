///<reference path="../globals.ts" />

module TSOS {
    export class MemoryManager {
        constructor(public partition0: boolean = true,
                    public partition1: boolean = true,
                    public partition2: boolean = true,
                    public memLoaded: boolean = true) {
        }
        public assignMem(pid) {
            this.memLoaded = true;
            if (this.partition0) {
                this.partition0 = false;
                _Processes[pid].memLocation = 0;
            }
            else if (this.partition1) {
                this.partition1 = false;
                _Processes[pid].memLocation = 1;
            }
            else if (this.partition2) {
                this.partition2 = false;
                _Processes[pid].memLocation = 2;
            }
            else {
                this.memLoaded = false;
            }
        }

    }
}