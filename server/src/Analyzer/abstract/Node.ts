export class Node {
    public childs: Array<Node>;
    public value: string;

    constructor(value: string) {
        this.value = value;
        this.childs = [];
    }

    addChild(value: string) {
        this.childs.push(new Node(value));
    }

    addChilds(childs: Array<Node>) {
        for (let item of childs) {
            this.childs.push(item);
        }
    }

    addChildsNode(child: Node) {
        this.childs.push(child);
    }
}