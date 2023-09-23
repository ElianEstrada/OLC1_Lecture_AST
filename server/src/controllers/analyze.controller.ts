import { Request, Response } from "express"
import Tree from "../Analyzer/tools/Tree.js";
import Environment from "../Analyzer/tools/Environment.js";
import { Instruction } from "../Analyzer/abstract/Instruction.js";
// @ts-ignore
import { grammar, errors, clean_errors } from '../Analyzer/grammar.js'
import { Node } from "../Analyzer/abstract/Node.js";

interface outParse {
    "console": string,
    "cst": string,
    "ast": string
}

export const analyze = (req: Request, res: Response) => {
    const { code } =  req.body;

    let out = interpret(code);

    res.json({
        "console": out.console,
        "cst": out.cst,
        "ast": out.ast
    });
}

const interpret = (bufferStrem: string): outParse => {
    let tree: Tree | null;
    let globalTable: Environment | null;

    let instructions: Array<Instruction>;

    clean_errors();

    instructions = grammar.parse(bufferStrem);
    
    tree = new Tree(instructions);
    globalTable = new Environment(undefined, undefined);
    tree.globalTable = globalTable;

    for (let instruction of tree.instructions) {
        let value: any = instruction.interpret(tree, globalTable);
    }

    let rootCst:Node = new Node("Root");
    let instruction: Node = new Node("Instructions");

    for (let item of tree.instructions) {
        instruction.addChildsNode(item.getCST());
    }
    rootCst.addChildsNode(instruction);

    let graph = tree.getDot(rootCst);

    let rootAst: Node = new Node("Root");
    let value: Node = new Node("Instructions");

    for (let item of tree.instructions) {
        value.addChildsNode(item.getAST());
    }

    rootAst.addChildsNode(value);

    let ast = tree.getDot(rootAst, false);
    
    return {
        "console": tree.console,
        "ast": ast,
        "cst": graph
    }
    
}