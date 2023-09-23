export default class Exception {

    private type: string;
    private description: string;
    private row: number;
    private column: number;
    private environment: string | undefined;

    constructor(type: string, description: string, row: number, column: number, environment?: string) {
        this.type = type;
        this.description = description;
        this.row = row;
        this.column = column;
        this.environment = environment;
    }

    public getType(): string {
        return this.type;
    }

    public getDescription(): string {
        return this.description;
    }

    public getRow(): number {
        return this.row;
    }

    public getColumn(): number {
        return this.column;
    }

    public getEnvironment(): string | undefined {
        return this.environment;
    }

    public toString(): string {
        return `--> ${this.getType()} - ${this.getDescription()} in ${this.getEnvironment()} on [${this.getRow()}, ${this.getColumn()}]`;
    }

}