/**
 * 2021 - Sergio Soriano
 * https://github.com/sergiss
 * www.sergiosoriano.com
 */
const table = new Table(40, 40);
const astar = new AStar(table);

const canvas = document.querySelector("#table");
const ctx = canvas.getContext("2d");

var p1, p2 = [];

const clear = ()=> {
    p1 = null; p2 = [];
    table.clear();
    update();
}

const random = ()=> {
    
    do {
        table.clear();
        let n = table.getCols() * table.getRows() * 0.5;
        for(let i = 0; i < n; ++i) {
            table.getNode(Math.floor(Math.random() * table.getCols()), 
                          Math.floor(Math.random() * table.getRows())).obstacle = true;
        }

        p1 = [Math.floor(Math.random() * table.getCols()), Math.floor(Math.random() * table.getRows())];
        p2 = [Math.floor(Math.random() * table.getCols()), Math.floor(Math.random() * table.getRows())];

        table.getNode(...p1).obstacle = table.getNode(...p2).obstacle = false;

    } while(!update());

}

const update = ()=> {

    let result = false;
    
    const bounds = canvas.getBoundingClientRect();

    const w = bounds.width;
    const h = bounds.height;
    
    rw = (w - table.getCols()) / table.getCols();
    rh = (h - table.getRows()) / table.getRows();

    canvas.width  = w;
    canvas.height = h;

    ctx.fillStyle = "#444";
    ctx.fillRect(0, 0, rw * table.getCols() + table.getCols() - 1, rh * table.getRows() + table.getRows() - 1);
    
    let node;
    for(let x = 0; x < table.getCols(); ++x) {
        for(let y = 0; y < table.getRows(); ++y) {
            node = table.getNode(x, y);
            ctx.fillStyle = node.obstacle ? '#00AA00' : '#AAA';
            ctx.fillRect(x * rw + x, 
                         y * rh + y, 
                         rw, rh);
        }
    }

    if(p1 && p2) {
        let n1 = table.getNode(...p1);
        let n2 = table.getNode(...p2);

        const route = astar.route(n1, n2);
        if(route) {
            ctx.fillStyle = "#444";
            node = route[0];
            for(let i = 0; i < route.length; ++i) {
                node = route[i];
                ctx.fillRect(node.x * rw + node.x, 
                            node.y * rh + node.y, 
                            rw, rh);
            }
            result = true;
        }
    }

    if(p1) {
        ctx.fillStyle = '#00A';
        ctx.fillRect(p1[0] * rw + p1[0], 
                     p1[1] * rh + p1[1], 
                     rw, rh);
    }

    if(p2) {
        ctx.fillStyle = '#A00';
        ctx.fillRect(p2[0] * rw + p2[0], 
                     p2[1] * rh + p2[1], 
                     rw, rh);
    }
    return result;
}

const getCoords = (e)=> {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;
    return [Math.floor(x / (rw + 1)), Math.floor(y / (rh + 1))];
}

const setObstacle = (col, row, obstacle)=> {
    if(col < table.getCols() && row < table.getRows()) {
        mouseDown = true;
        cc = col; cr = row;
        table.getNode(col, row).obstacle = obstacle;
        update();
    } 
}

var mouseDown = false, cc = -1, cr = -1;
canvas.addEventListener("mouseup", (e)=> {
    if(e.button === 0) mouseDown = false;
    else if(e.button === 2) {
        if(p2) {
            p1 = getCoords(e);
            p2 = null;
        } else {
            p2 = getCoords(e);
        }
        update();       
    }
});

canvas.addEventListener("mousedown", (e)=> {
    e.preventDefault();
    if(e.button === 0) {
        let coords = getCoords(e);
        let [col, row] = coords; 
        setObstacle(col, row, !table.getNode(col, row).obstacle);
    } 
});

canvas.addEventListener("mousemove", (e)=> {
    if(mouseDown) {
        let coords = getCoords(e);
        let [col, row] = coords;     
        if(col != cc || row != cr) {
            setObstacle(col, row, true);
        }
    }
});

canvas.addEventListener("mouseleave", (e)=> {
    mouseDown = false;
});

canvas.addEventListener("contextmenu", (e)=> {
    e.preventDefault();
});


document.querySelector("#clear").addEventListener("click", clear);
document.querySelector("#rnd").addEventListener("click", random);

// update();
random();