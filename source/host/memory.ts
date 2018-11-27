///<reference path="../globals.ts" />

module TSOS {
    export class Memory {
        constructor() {
        }

        public init() {
            var j = 0;
            i = 0;
            while (j < 3) {
                _Memory[j] = [];
                while (i < 256) {
                    _MemoryAccessor.writeMem(i, j, '00');
                    i++;
                }
                j++;
                i = 0;
            }
        }
    }
}