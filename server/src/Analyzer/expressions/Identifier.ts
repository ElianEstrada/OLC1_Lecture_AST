import { Instruction } from "../abstract/Instruction.js";
import { Node } from "../abstract/Node.js";
import Environment from "../tools/Environment.js";
import Exception from "../tools/Exception.js";
import ReturnType from "../tools/ReturnType.js";
import Symbol from "../tools/Symbol.js";
import Tree from "../tools/Tree.js";
import { type } from "../tools/Type.js";

export class Identifier implements Instruction {

    public id: string;
    public type: type;
    public value: string;
    public row: number;
    public column: number;

    constructor(id: string, row: number, column: number) {
        this.id = id;
        this.value = "";
        this.type = type.INT;
        this.row = row;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        let symbol: Symbol | undefined = table.getTable(this.id);

        if (symbol === undefined) {
            // Semantic Error
            return new ReturnType(type.INT, new Exception("Semantic", `The id: ${this.id} doesn't exist in current context`, this.row, this.column, table.name));
        }

        this.type = symbol.type;
        this.value = symbol.value;

        return new ReturnType(this.type, this.value);
    }

    interpret(tree: Tree, table: Environment) {
        
    }

    getCST(): Node {
        let node: Node = new Node("Indentifier");
        node.addChild(this.id);

        return node;
    }

    getAST(): Node {
        return new Node(this.id);
    }
}