///<reference path="../globals.ts" />

module TSOS {
    export class MemoryManager {
        constructor(public partition0: boolean = true) {
        }

        public allocate() {
            if (this.partition0) {
                this.partition0 = false;
            }
        }

        public deallocate(partition) {
            partition = true;
        }
    }
}