import { type } from "./Type"

export default class ReturnType {

    public type: type;
    public value: any;

    constructor(type: type, value: any) {
        this.type = type;
        this.value = value;
    }

    public toString(): string {
        return this.value;
    }

}