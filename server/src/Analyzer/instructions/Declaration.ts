import { Instruction } from "../abstract/Instruction.js";
import { Node } from "../abstract/Node.js";
import Environment from "../tools/Environment.js";
import Exception from "../tools/Exception.js";
import ReturnType from "../tools/ReturnType.js";
import Symbol from "../tools/Symbol.js";
import Tree from "../tools/Tree.js";
import { type } from "../tools/Type.js";

export class Declaration implements Instruction {

    public type: type;
    public id: string;
    public expression: Instruction;
    public row: number;
    public column: number;

    constructor(type: type, id: string, expression: Instruction, row: number, column: number) {
        this.type = type;
        this.id = id;
        this.expression = expression;
        this.row = row;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        return new ReturnType(type.INT, undefined);
    }

    interpret(tree: Tree, table: Environment) {
        let value: ReturnType;
        let symbol: Symbol;

        value = this.expression.getValue(tree, table);

        if (value.value instanceof Exception) {
            // Semantic error
            return value.value;
        }

        if (this.type !== value.type) {
            // Semantic error
            return new Exception("Semantic", `The type: ${value.type} don't be assigned to variable of type: ${this.type}`, this.row, this.column, table.name);
        }

        let result: any = table.setTable(new Symbol(this.id, this.type, value.value, this.row, this.column, table.name));

        if (result instanceof Exception) {
            return result;
        }

        return undefined;
    }

    getCST(): Node {
        let node: Node = new Node("Declaration");
        node.addChild(this.type);
        node.addChild(this.id);
        node.addChild('=');
        node.addChildsNode(this.expression.getCST());

        return node;
    }

    getAST(): Node {
        let node: Node = new Node('=');
        node.addChild(this.type);
        node.addChild(this.id);
        node.addChildsNode(this.expression.getAST());

        return node;
    }
}