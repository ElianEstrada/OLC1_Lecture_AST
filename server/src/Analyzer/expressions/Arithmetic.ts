import { Instruction } from "../abstract/Instruction.js";
import { Node } from "../abstract/Node.js";
import Environment from "../tools/Environment.js";
import Exception from "../tools/Exception.js";
import ReturnType from "../tools/ReturnType.js";
import Tree from "../tools/Tree.js";
import { type } from "../tools/Type.js";

export class Arithmetic implements Instruction {

    public operator: string;
    public exp1: Instruction;
    public exp2: Instruction;
    //public value: ReturnType;
    //public type: type;
    public row: number;
    public column: number;

    constructor(exp1: Instruction, exp2: Instruction, operator: string, row: number, column: number) {
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.operator = operator;
        this.row = row;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        let left: ReturnType;
        let right: ReturnType;

        left = this.exp1.getValue(tree, table);

        if (left.value instanceof Exception) {
            // Semantic error
            return left;
        }

        right = this.exp2.getValue(tree, table);

        if (right.value instanceof Exception) {
            // Semantic Error
            return right;
        }

        switch(this.operator) {
            case "+": 
                return new ReturnType(type.INT, Number(left.value) + Number(right.value));
            case "-":
                return new ReturnType(type.INT, Number(left.value) - Number(right.value));
            case "*":
                return new ReturnType(type.INT, Number(left.value) * Number(right.value));
            case "/":
                return Number(right.value) === 0 ? new ReturnType(type.INT, new Exception("Semantic", `Can't divide for 0`, this.row, this.column, table.name)) : new ReturnType(type.INT, Number(left.value) / Number(right.value));
            default:
                return new ReturnType(type.INT, new Exception("Semantic", `The operator: ${this.operator} not is valid`, this.row, this.column, table.name));
        }
    }

    interpret(): any{

    }

    getCST(): Node {
        let node: Node = new Node("Arithmetic Expression");
        node.addChildsNode(this.exp1.getCST());
        node.addChild(this.operator.toString());
        node.addChildsNode(this.exp2.getCST());

        return node;
    }

    getAST(): Node {
        let node: Node = new Node(this.operator.toString());
        node.addChildsNode(this.exp1.getAST());
        node.addChildsNode(this.exp2.getAST());

        return node;
    }

}