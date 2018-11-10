///<reference path="../globals.ts" />

module TSOS {
    export class MemoryAccessor {
        constructor(
        ) { }
        public writeMem(position, partition, opCode) {
            _Memory[position + (partition * 255)] = opCode;
            Control.updateMemory(position, partition);
        }
        public readMem(position, partition) {
            return _Memory[position + (partition * 256)];
        }
    }
}