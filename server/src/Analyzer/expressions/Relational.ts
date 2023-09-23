import { Instruction } from "../abstract/Instruction.js";
import { Node } from "../abstract/Node.js";
import Environment from "../tools/Environment.js";
import Exception from "../tools/Exception.js";
import ReturnType from "../tools/ReturnType.js";
import Tree from "../tools/Tree.js";
import { relationalOperator, type } from "../tools/Type.js";

export class Relational implements Instruction {

    public exp1: Instruction;
    public exp2: Instruction;
    public operator: relationalOperator;
    public row: number;
    public column: number;

    constructor(exp1: Instruction, exp2: Instruction, operator: relationalOperator, row: number, column: number) {
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
            // Semantic Error
            return left;
        }

        right = this.exp2.getValue(tree, table);

        if (right.value instanceof Exception) {
            // Semantic Error
            return right;
        }

        if (Object.values(relationalOperator).includes(this.operator)) {
            return new ReturnType(type.BOOLEAN, this.operate(Number(left.value), Number(right.value), this.operator));
        } else {
            // Semantic Error
            return new ReturnType(type.INT, new Exception("Semantic", `The operator: ${this.operator} not be a relational operator`, this.row, this.column, table.name));
        }
    }

    operate(exp1: number, exp2: number, op: relationalOperator): string {
        switch(op){
            case relationalOperator.EQ:
                return String(exp1 == exp2).toLowerCase();
            case relationalOperator.NEQ:
                return String(exp1 != exp2).toLowerCase();
            case relationalOperator.GT:
                return String(exp1 > exp2).toLowerCase();
            case relationalOperator.GTE:
                return String(exp1 >= exp2).toLowerCase();
            case relationalOperator.LT:
                return String(exp1 < exp2).toLowerCase();
            case relationalOperator.LTE:
                return String(exp1 <= exp2).toLowerCase();
        }
    }

    interpret(tree: Tree, table: Environment) {
        
    }

    getCST(): Node {
        let node: Node = new Node("Relational Expression");
        node.addChildsNode(this.exp1.getCST());
        node.addChild(this.operator);
        node.addChildsNode(this.exp2.getCST());
        
        return node;
    }

    getAST(): Node {
        let node: Node = new Node(this.operator);
        node.addChildsNode(this.exp1.getAST());
        node.addChildsNode(this.exp2.getAST());

        return node;
    }

}