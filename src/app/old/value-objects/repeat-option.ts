export class RepeatOption {
    constructor(
        public id: string,
        public name: string,
        public noOfIntervals: number,
    ) {
    }

    getIntervalOptions(): number[] {
        return Array(this.noOfIntervals).fill(0).map((x, i) => i + 1);
    }
}
