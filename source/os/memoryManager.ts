///<reference path="../globals.ts" />

module TSOS {
    export class MemoryManager {
        constructor(public partition0: boolean = true) {
        }
        public allocate(process) {
            if (this.partition0) {
                this.partition0 = false;
                process.memLocation = 0;
            }
        }
        public deallocate(partition) {
            if (partition = 0) {
                this.partition0 = true;
            }
        }
    }
}