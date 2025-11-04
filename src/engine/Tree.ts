export class Tree<D> {
  #parent: Tree<D> | null;
  #children: Tree<D>[];
  data: D;

  constructor(data: D) {
    this.data = data;
    this.#parent = null;
    this.#children = [];
  }

  get parent(): Readonly<Tree<D> | null> {
    return this.#parent;
  }
  get children(): ReadonlyArray<Readonly<Tree<D>>> {
    return this.#children;
  }

  addChild(data: D): Tree<D> {
    const child = new Tree<D>(data);
    child.#parent = this;
    this.#children.push(child);

    return child;
  }
}
