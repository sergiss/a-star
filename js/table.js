/**
 * 2021 - Sergio Soriano
 * https://github.com/sergiss
 * www.sergiosoriano.com
 */
class Table extends Grid {
    
  constructor(cols, rows) {
    super();
    this.cols = cols;
    this.rows = rows;
    this.clear();
  }

  getCols() {
    return this.cols;
  }

  getRows() {
    return this.rows;
  }

  getNode(x, y) {
    return this.nodes[x + y * this.cols];
  }

  clear() {
    this.nodes = [];

    for(let y, x = 0; x < this.cols; ++x) {
      for(y = 0; y < this.rows; ++y) {
        this.nodes[x + y * this.cols] = new Node(x, y);
      }
    }
  }

}
