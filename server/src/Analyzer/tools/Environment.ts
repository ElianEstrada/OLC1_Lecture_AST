import Exception from "./Exception.js";
import Symbol from "./Symbol.js";

export default class Environment {

    public name: string;
    public table: Map<string, Symbol>;
    public prev: Environment | undefined;

    constructor(prev?: Environment, name: string = "Global") {
        this.name = name;
        this.prev = prev;
        this.table = new Map<string, Symbol>();
    }

    public setTable(symbol: Symbol) {
        if (this.table.has(symbol.id)) {
            return new Exception("Semantic", `The variable ${symbol.id} already definited on scope`, symbol.row, symbol.column, this.name);
        }

        symbol.environment = this.name;
        this.table.set(symbol.id, symbol);

        return undefined;
    }

    public getTable(id: string) {
        let currentTable: Environment | undefined = this;

        while (currentTable != undefined) {
            if (currentTable.table.has(id)) {
                return currentTable.table.get(id);
            }

            currentTable = currentTable.prev;
        }

        return undefined;
    }

    public updateTable(symbol: Symbol) {
        let currentTable: Environment | undefined = this;

        while (currentTable != undefined) {
            if (currentTable.table.has(symbol.id)) {
                let currentSymbol: Symbol | undefined = currentTable.table.get(symbol.id);

                if (currentSymbol?.type === symbol.type) {
                    currentSymbol.value = symbol.value;
                    return undefined;
                }

                return new Exception("Semantic", `The variable: ${currentSymbol?.id} isn't at type: ${symbol.type}`, symbol.row, symbol.column, this.name);
            }

            currentTable = currentTable.prev;
        }

        return new Exception("Semantic", `The id: ${symbol.id} doesn't exist in current context`, symbol.row, symbol.column, this.name);
    }

}