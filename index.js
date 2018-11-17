const _    = require('lodash');

// const puzzle = [
//     [1,2,3,4,5,6,7,8,9],
//     [4,5,6,7,8,9,1,2,3],
//     [7,8,9,1,2,3,4,5,6],
//     [2,3,4,5,6,7,8,9,1],
//     [5,6,7,8,9,1,2,3,4],
//     [8,9,1,2,3,4,5,6,7],
//     [3,4,5,6,7,8,9,1,2],
//     [6,7,8,9,1,2,3,4,5],
//     [9,1,2,3,4,5,6,7,8],
// ];

console.log = function () {
};

class Solver {
    constructor() {

        this.puzzle = [
            [8, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 3, 6, 0, 0, 0, 0, 0],
            [0, 7, 0, 0, 9, 0, 2, 0, 0],
            [0, 5, 0, 0, 0, 7, 0, 0, 0],
            [0, 0, 0, 0, 4, 5, 7, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 3, 0],
            [0, 0, 1, 0, 0, 0, 0, 6, 8],
            [0, 0, 8, 5, 0, 0, 0, 1, 0],
            [0, 9, 0, 0, 0, 0, 4, 0, 0],
        ];

        //
        // this.puzzle = [
        //     [0, 0, 3, 0, 0, 0, 0, 0, 0],
        //     [1, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [7, 8, 9, 1, 2, 3, 0, 0, 0],
        //     [2, 3, 4, 5, 0, 7, 8, 9, 0],
        //     [5, 0, 7, 8, 9, 1, 0, 0, 0],
        //     [8, 9, 0, 2, 3, 0, 0, 0, 0],
        //     [3, 4, 5, 6, 7, 8, 0, 0, 2],
        //     [0, 0, 8, 9, 1, 0, 3, 4, 5],
        //     [9, 1, 2, 3, 4, 5, 6, 7, 8],
        // ];
        //
    }

    getRowOptions(r, puzzle = this.puzzle) {
        const row     = puzzle[r];
        const options = [];
        for (let i = 1; i < 10; i++) {
            if (row.indexOf(i) === -1) {
                options.push(i);
            }
        }

        console.log('row options', r, options);

        return options;

    }

    getColOptions(c, puzzle = this.puzzle) {
        const col = [];
        for (let i = 0; i < 9; i++) {
            col.push(puzzle[i][c]);
        }

        // console.log('col',col);
        const options = [];

        for (let i = 1; i < 10; i++) {
            if (col.indexOf(i) === -1) {
                options.push(i);
            }
        }

        console.log('col options', c, options);

        return options;
    }

    getBlockOptions(r, c, puzzle = this.puzzle) {
        const block   = [];
        const options = [];

        const rowStart = Math.floor(r / 3) * 3;
        const colStart = Math.floor(c / 3) * 3;

        for (let i = rowStart; i < rowStart + 3; i++) {
            for (let j = colStart; j < colStart + 3; j++) {
                if (puzzle[i][j]) {
                    block.push(puzzle[i][j]);
                }
            }
        }

        for (let i = 1; i < 10; i++) {
            if (block.indexOf(i) === -1) {
                options.push(i);
            }
        }

        console.log('block options', r, c, options);

        return options;
    }


    getCellOptions(r, c, puzzle = this.puzzle) {
        const rowOptions   = this.getRowOptions(r, puzzle);
        const colOptions   = this.getColOptions(c, puzzle);
        const blockOptions = this.getBlockOptions(r, c, puzzle);

        const options = _.intersection(rowOptions, colOptions, blockOptions);

        console.log('cellOptions', r, c, options);

        return options;
    }

    getOrderedCellOptions(puzzle = this.puzzle) {
        const options = [];

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {

                if (puzzle[r][c] === 0) {
                    options.push({r, c, options: this.getCellOptions(r, c, puzzle)});
                }

            }
        }

        const orderedCellOptions = _.sortBy(options, (o) => o.options.length);

        console.log('orderedCellOptions', orderedCellOptions);

        return orderedCellOptions;
    }

    fillCell(puzzle, r, c, val) {
        const clonedPuzzle = _.cloneDeep(puzzle);
        clonedPuzzle[r][c] = val;
        return clonedPuzzle;
    }

    findSolution(puzzle, solutions, i=0) {
        // console.info('findSolution',i);

        const blankCells = this.getOrderedCellOptions(puzzle);
        console.log('blankCells', blankCells);
        console.log('puzzle', puzzle);




        if (blankCells.length === 0) {
            solutions.push(puzzle);

            console.info('solutions.length', solutions.length);
            // this.printSolution(puzzle, this.puzzle);

            return;
        }

        for (let i = 0; i < blankCells.length; i++) {
            const blankCell = blankCells[i];

            if (blankCell.options.length === 0) {
                console.log('return early');
                return;

            } else if (blankCell.options.length === 1) {

                this.findSolution(
                    this.fillCell(
                        puzzle,
                        blankCell.r,
                        blankCell.c,
                        blankCell.options[0],
                    ),
                    solutions,
                );

                break;

            }
            if (blankCell.options.length > 1) {

                for (let j = 0; j < blankCell.options.length; j++) {
                    const option = blankCell.options[j];

                    this.findSolution(
                        this.fillCell(
                            puzzle,
                            blankCell.r,
                            blankCell.c,
                            option,
                        ),
                        solutions,
                        i+1
                    );
                }
                break;
            }

        }

    }

    solve() {

        const solutions = [];
        this.findSolution(this.puzzle, solutions);

        return solutions;
    }

    printSolution(solution, puzzle) {
        console.info();
        console.info('-------------------------');
        for (let r = 0; r < 9; r++) {


            const line = ['|'];


            for (let c = 0; c < 9; c++) {
                line.push(
                    (puzzle[r][c] === 0 ? '\x1b[32m' : '\x1b[31m')
                    + solution[r][c]
                    + '\x1b[0m',
                );

                if((c+1) % 3 === 0){
                    line.push('|');
                }
            }
            console.info(line.join(' '));
            if((r+1) % 3 === 0){
                console.info('-------------------------');
            }
        }
    }
}

const solver    = new Solver();
const solutions = solver.solve();


console.info('solutions:');
solutions.forEach((solution) => solver.printSolution(solution, solver.puzzle));
console.info('found ' + solutions.length + ' solutions');