///<reference path="../globals.ts" />

module TSOS {
    export class MemoryAccessor {
        constructor(
        ) { }
        public writeMem(position, partition, opCode) {
            _Memory[partition][position] = opCode;
            Control.updateMemory(position, partition);
        }
        public readMem(position, partition) {
            return _Memory[partition][position];
        }
        public clearMem() {
            _Memory.init();
        }
    }
}