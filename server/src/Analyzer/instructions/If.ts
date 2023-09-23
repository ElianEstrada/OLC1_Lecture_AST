import { Instruction } from "../abstract/Instruction.js";
import { Node } from "../abstract/Node.js";
import Environment from "../tools/Environment.js";
import Exception from "../tools/Exception.js";
import ReturnType from "../tools/ReturnType.js";
import Tree from "../tools/Tree.js";
import { type } from "../tools/Type.js";

export class If implements Instruction {

    public expression: Instruction;
    public instructions: Array<Instruction>;
    public elseInstructions: Array<Instruction> | undefined;
    public elseIf: Instruction | undefined;
    public row: number;
    public column: number;


    constructor(expression: Instruction, instructions: Array<Instruction>, elseInstructions: Array<Instruction> | undefined, elseIf: Instruction | undefined, row: number, column: number) {
        this.expression = expression;
        this.instructions = instructions;
        this.elseInstructions = elseInstructions;
        this.elseIf = elseIf;
        this.row = row;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        return new ReturnType(type.INT, undefined);
    }

    interpret(tree: Tree, table: Environment) {
        let flag: ReturnType = this.expression.getValue(tree, table);
        console.log(flag.value);
        

        if (flag.value instanceof Exception) {
            // Semantic error
            return flag;
        }

        if (flag.type === type.BOOLEAN) {
            if (JSON.parse(String(flag.value))) {

                let newTable = new Environment(table, `If-${this.row}-${this.column}`);
                let instruction: any;

                for (let item of this.instructions) {
                    instruction = item.interpret(tree, newTable);

                    if (instruction instanceof Exception) {
                        // Semantic Error
                        tree.errors.push(instruction);
                        tree.updateConsole(instruction.toString());
                    }
                }
            } else if (this.elseInstructions !== undefined ){
                let newTable = new Environment(table, `Else-${this.row}-${this.column}`);
                let instruction: any;

                for (let item of this.elseInstructions) {
                    instruction = item.interpret(tree, newTable);

                    if (instruction instanceof Exception) {
                        // Semantic Error
                        tree.errors.push(instruction);
                        tree.updateConsole(instruction.toString());
                    }
                }
            } else if (this.elseIf !== undefined) {
                let result: any = this.elseIf.interpret(tree, table);

                if (result instanceof Exception) {
                    // Semantic Error
                    return result;
                }
            }
        } else {
            return new Exception("Semantic", `Expect a boolean type expression. Not ${flag.type}`, this.row, this.column, table.name);
        }
    }

    getCST(): Node {
        let node: Node = new Node("If");
        node.addChild("if");
        node.addChild("(");
        node.addChildsNode(this.expression.getCST());
        node.addChild(")");
        node.addChild("{");
        
        let instructions: Node = new Node("Instructions");
        for (let item of this.instructions) {
            instructions.addChildsNode(item.getCST());
        }

        node.addChildsNode(instructions);
        node.addChild("}");

        if(this.elseInstructions !== undefined) {
            let elseInstructions: Node = new Node("Else Instructions");
            node.addChild("else");
            node.addChild("{");

            for (let item of this.elseInstructions) {
                elseInstructions.addChildsNode(item.getCST());
            }

            node.addChildsNode(elseInstructions);
            node.addChild("}");
        }else if (this.elseIf !== undefined) {
            node.addChildsNode(this.elseIf.getCST());
        }

        return node;
    }

    getAST(): Node {
        
        let node: Node = new Node("If");
        node.addChildsNode(this.expression.getAST());
        
        let insTrue: Node = new Node("true");
        for (let item of this.instructions) {
            insTrue.addChildsNode(item.getAST());
        }

        node.addChildsNode(insTrue);

        if (this.elseInstructions !== undefined) {
            let insFalse: Node = new Node("false");

            for (let item of this.elseInstructions) {
                insFalse.addChildsNode(item.getAST());
            }

            node.addChildsNode(insFalse);
        } else if (this.elseIf !== undefined) {
            node.addChildsNode(this.elseIf.getAST());
        }


        return node;

    }

}