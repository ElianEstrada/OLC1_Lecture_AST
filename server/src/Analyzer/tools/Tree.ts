import { Node } from "../abstract/Node.js";
import Environment from "./Environment.js";
import Exception from "./Exception.js";

export default class Tree {

    public instructions: Array<any>; // change late
    public errors: Array<Exception>;
    public console: string;
    public globalTable: Environment | undefined;
    public dot: string;
    private count: number;

    constructor(instructions: Array<any>) {
        this.instructions = instructions;
        this.console = '';
        this.errors = [];
        this.dot = '';
        this.count = 0;
    }

    public updateConsole(input: string) {
        this.console += `${input}\n`;
    }

    public getDot(root: Node, flag: boolean = true) { //change late
        this.dot = "";
        this.dot += `digraph {\nranksep="${flag ? 2 : 1}";\nbgcolor = "#090B10";\nedge[color="#56cdff"];\nnode [style="filled" fillcolor = "#0F111A" fontcolor = "white" color = "#007acc"];\n`;
        this.dot += `n0[label="${root.value.replace("\"", "\\\"")}"];\n`;
        this.count = 1;
        this.travelCst("n0", root);
        this.dot += "}";
        return this.dot;
    }

    public travelCst(idRoot: any, nodeRoot: Node) {
        for(let item of nodeRoot.childs){
            let name_child = `n${this.count}`;
            this.dot += `${name_child} [label = "${item.value.replace("\"", "\\\"")}"];\n`;
            this.dot += `${idRoot} -> ${name_child};\n`;
            this.count++;
            this.travelCst(name_child, item);
        }
    }

}