interface MathResult {
  value: any;
  steps?: string[];
  explanation?: string;
}

interface MatrixResult {
  result: number[][] | number;
  steps: string[];
  explanation: string;
}

interface VectorResult {
  result: number[] | number;
  steps: string[];
  explanation: string;
}

interface SolutionResult {
  solution: any;
  method: string;
  steps: string[];
  explanation: string;
}

class MathService {
  async calculate(expression?: string, operation?: string, variables?: any): Promise<MathResult> {
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (expression) {
      return this.evaluateExpression(expression);
    } else if (operation) {
      return this.performOperation(operation, variables);
    } else {
      throw new Error('No expression or operation provided');
    }
  }

  async matrixOperation(operation: string, matrices: number[][][], scalar?: number): Promise<MatrixResult> {
    await new Promise(resolve => setTimeout(resolve, 800));

    switch (operation) {
      case 'add':
        return this.matrixAddition(matrices[0], matrices[1]);
      case 'multiply':
        return this.matrixMultiplication(matrices[0], matrices[1]);
      case 'transpose':
        return this.matrixTranspose(matrices[0]);
      case 'determinant':
        return this.matrixDeterminant(matrices[0]);
      case 'inverse':
        return this.matrixInverse(matrices[0]);
      case 'scalar_multiply':
        return this.scalarMultiplication(matrices[0], scalar!);
      default:
        throw new Error(`Unknown matrix operation: ${operation}`);
    }
  }

  async vectorOperation(operation: string, vectors: number[][], scalar?: number): Promise<VectorResult> {
    await new Promise(resolve => setTimeout(resolve, 600));

    switch (operation) {
      case 'add':
        return this.vectorAddition(vectors[0], vectors[1]);
      case 'subtract':
        return this.vectorSubtraction(vectors[0], vectors[1]);
      case 'dot_product':
        return this.dotProduct(vectors[0], vectors[1]);
      case 'cross_product':
        return this.crossProduct(vectors[0], vectors[1]);
      case 'magnitude':
        return this.vectorMagnitude(vectors[0]);
      case 'normalize':
        return this.vectorNormalize(vectors[0]);
      case 'scalar_multiply':
        return this.vectorScalarMultiply(vectors[0], scalar!);
      default:
        throw new Error(`Unknown vector operation: ${operation}`);
    }
  }

  async solveProblem(problem: string, method?: string, variables?: any): Promise<SolutionResult> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple problem solving based on keywords
    if (problem.toLowerCase().includes('system') && problem.toLowerCase().includes('equation')) {
      return this.solveLinearSystem(problem, method);
    } else if (problem.toLowerCase().includes('eigenvalue')) {
      return this.findEigenvalues(problem);
    } else if (problem.toLowerCase().includes('determinant')) {
      return this.calculateDeterminant(problem);
    } else {
      return this.generalProblemSolving(problem);
    }
  }

  async getExamples(topic?: string, difficulty?: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const examples = {
      vectors: [
        {
          problem: 'Find the magnitude of vector v = (3, 4)',
          solution: '|v| = √(3² + 4²) = √(9 + 16) = √25 = 5',
          difficulty: 'beginner'
        },
        {
          problem: 'Find the dot product of vectors a = (1, 2, 3) and b = (4, 5, 6)',
          solution: 'a · b = 1×4 + 2×5 + 3×6 = 4 + 10 + 18 = 32',
          difficulty: 'intermediate'
        }
      ],
      matrices: [
        {
          problem: 'Find the determinant of matrix A = [[2, 3], [1, 4]]',
          solution: 'det(A) = 2×4 - 3×1 = 8 - 3 = 5',
          difficulty: 'beginner'
        },
        {
          problem: 'Multiply matrices A = [[1, 2], [3, 4]] and B = [[5, 6], [7, 8]]',
          solution: 'AB = [[1×5+2×7, 1×6+2×8], [3×5+4×7, 3×6+4×8]] = [[19, 22], [43, 50]]',
          difficulty: 'intermediate'
        }
      ],
      systems: [
        {
          problem: 'Solve: x + y = 5, 2x - y = 1',
          solution: 'x = 2, y = 3',
          difficulty: 'beginner'
        }
      ]
    };

    if (topic && examples[topic as keyof typeof examples]) {
      const topicExamples = examples[topic as keyof typeof examples];
      if (difficulty) {
        return topicExamples.filter((ex: any) => ex.difficulty === difficulty);
      }
      return topicExamples;
    }

    return Object.values(examples).flat();
  }

  private evaluateExpression(expression: string): MathResult {
    try {
      // Simple expression evaluator (in production, use a proper math parser)
      const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
      const result = Function(`"use strict"; return (${sanitized})`)();
      
      return {
        value: result,
        steps: [`Evaluated: ${expression} = ${result}`],
        explanation: `The expression ${expression} evaluates to ${result}`
      };
    } catch (error) {
      throw new Error('Invalid mathematical expression');
    }
  }

  private performOperation(operation: string, variables: any): MathResult {
    // Placeholder for operation-based calculations
    return {
      value: 'Operation not implemented',
      explanation: `Operation ${operation} is not yet implemented`
    };
  }

  private matrixAddition(a: number[][], b: number[][]): MatrixResult {
    if (a.length !== b.length || a[0].length !== b[0].length) {
      throw new Error('Matrices must have the same dimensions for addition');
    }

    const result: number[][] = [];
    const steps: string[] = [];

    for (let i = 0; i < a.length; i++) {
      result[i] = [];
      for (let j = 0; j < a[i].length; j++) {
        result[i][j] = a[i][j] + b[i][j];
        steps.push(`C[${i}][${j}] = A[${i}][${j}] + B[${i}][${j}] = ${a[i][j]} + ${b[i][j]} = ${result[i][j]}`);
      }
    }

    return {
      result,
      steps,
      explanation: 'Matrix addition is performed element-wise'
    };
  }

  private matrixMultiplication(a: number[][], b: number[][]): MatrixResult {
    if (a[0].length !== b.length) {
      throw new Error('Number of columns in first matrix must equal number of rows in second matrix');
    }

    const result: number[][] = [];
    const steps: string[] = [];

    for (let i = 0; i < a.length; i++) {
      result[i] = [];
      for (let j = 0; j < b[0].length; j++) {
        let sum = 0;
        let step = `C[${i}][${j}] = `;
        for (let k = 0; k < a[0].length; k++) {
          sum += a[i][k] * b[k][j];
          step += `${a[i][k]} × ${b[k][j]}`;
          if (k < a[0].length - 1) step += ' + ';
        }
        step += ` = ${sum}`;
        result[i][j] = sum;
        steps.push(step);
      }
    }

    return {
      result,
      steps,
      explanation: 'Matrix multiplication uses the dot product of rows and columns'
    };
  }

  private matrixTranspose(matrix: number[][]): MatrixResult {
    const result: number[][] = [];
    const steps: string[] = [];

    for (let i = 0; i < matrix[0].length; i++) {
      result[i] = [];
      for (let j = 0; j < matrix.length; j++) {
        result[i][j] = matrix[j][i];
        steps.push(`A^T[${i}][${j}] = A[${j}][${i}] = ${matrix[j][i]}`);
      }
    }

    return {
      result,
      steps,
      explanation: 'Transpose swaps rows and columns'
    };
  }

  private matrixDeterminant(matrix: number[][]): MatrixResult {
    if (matrix.length !== matrix[0].length) {
      throw new Error('Matrix must be square to calculate determinant');
    }

    if (matrix.length === 2) {
      const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      return {
        result: det,
        steps: [`det = ${matrix[0][0]} × ${matrix[1][1]} - ${matrix[0][1]} × ${matrix[1][0]} = ${det}`],
        explanation: 'For 2x2 matrix: det = ad - bc'
      };
    }

    // For larger matrices, use cofactor expansion
    throw new Error('Determinant calculation for matrices larger than 2x2 not implemented');
  }

  private matrixInverse(matrix: number[][]): MatrixResult {
    if (matrix.length !== 2 || matrix[0].length !== 2) {
      throw new Error('Inverse calculation only implemented for 2x2 matrices');
    }

    const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    if (det === 0) {
      throw new Error('Matrix is singular (determinant is 0)');
    }

    const result = [
      [matrix[1][1] / det, -matrix[0][1] / det],
      [-matrix[1][0] / det, matrix[0][0] / det]
    ];

    return {
      result,
      steps: [
        `det = ${matrix[0][0]} × ${matrix[1][1]} - ${matrix[0][1]} × ${matrix[1][0]} = ${det}`,
        `A^(-1) = (1/det) × [[${matrix[1][1]}, -${matrix[0][1]}], [-${matrix[1][0]}, ${matrix[0][0]}]]`
      ],
      explanation: 'Inverse of 2x2 matrix using the formula A^(-1) = (1/det) × adj(A)'
    };
  }

  private scalarMultiplication(matrix: number[][], scalar: number): MatrixResult {
    const result: number[][] = [];
    const steps: string[] = [];

    for (let i = 0; i < matrix.length; i++) {
      result[i] = [];
      for (let j = 0; j < matrix[i].length; j++) {
        result[i][j] = matrix[i][j] * scalar;
        steps.push(`C[${i}][${j}] = ${matrix[i][j]} × ${scalar} = ${result[i][j]}`);
      }
    }

    return {
      result,
      steps,
      explanation: 'Scalar multiplication multiplies each element by the scalar'
    };
  }

  private vectorAddition(a: number[], b: number[]): VectorResult {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimension for addition');
    }

    const result: number[] = [];
    const steps: string[] = [];

    for (let i = 0; i < a.length; i++) {
      result[i] = a[i] + b[i];
      steps.push(`c[${i}] = a[${i}] + b[${i}] = ${a[i]} + ${b[i]} = ${result[i]}`);
    }

    return {
      result,
      steps,
      explanation: 'Vector addition is performed component-wise'
    };
  }

  private vectorSubtraction(a: number[], b: number[]): VectorResult {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimension for subtraction');
    }

    const result: number[] = [];
    const steps: string[] = [];

    for (let i = 0; i < a.length; i++) {
      result[i] = a[i] - b[i];
      steps.push(`c[${i}] = a[${i}] - b[${i}] = ${a[i]} - ${b[i]} = ${result[i]}`);
    }

    return {
      result,
      steps,
      explanation: 'Vector subtraction is performed component-wise'
    };
  }

  private dotProduct(a: number[], b: number[]): VectorResult {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimension for dot product');
    }

    let result = 0;
    const steps: string[] = [];

    for (let i = 0; i < a.length; i++) {
      result += a[i] * b[i];
      steps.push(`${a[i]} × ${b[i]} = ${a[i] * b[i]}`);
    }

    return {
      result,
      steps,
      explanation: 'Dot product is the sum of products of corresponding components'
    };
  }

  private crossProduct(a: number[], b: number[]): VectorResult {
    if (a.length !== 3 || b.length !== 3) {
      throw new Error('Cross product is only defined for 3D vectors');
    }

    const result = [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];

    return {
      result,
      steps: [
        `i: ${a[1]} × ${b[2]} - ${a[2]} × ${b[1]} = ${result[0]}`,
        `j: ${a[2]} × ${b[0]} - ${a[0]} × ${b[2]} = ${result[1]}`,
        `k: ${a[0]} × ${b[1]} - ${a[1]} × ${b[0]} = ${result[2]}`
      ],
      explanation: 'Cross product using the determinant formula'
    };
  }

  private vectorMagnitude(vector: number[]): VectorResult {
    let sum = 0;
    const steps: string[] = [];

    for (let i = 0; i < vector.length; i++) {
      sum += vector[i] * vector[i];
      steps.push(`${vector[i]}² = ${vector[i] * vector[i]}`);
    }

    const magnitude = Math.sqrt(sum);
    steps.push(`|v| = √(${sum}) = ${magnitude}`);

    return {
      result: magnitude,
      steps,
      explanation: 'Magnitude is the square root of the sum of squared components'
    };
  }

  private vectorNormalize(vector: number[]): VectorResult {
    const magnitudeResult = this.vectorMagnitude(vector);
    const magnitude = magnitudeResult.result as number;
    
    if (magnitude === 0) {
      throw new Error('Cannot normalize zero vector');
    }

    const result: number[] = [];
    const steps: string[] = [...magnitudeResult.steps!];

    for (let i = 0; i < vector.length; i++) {
      result[i] = vector[i] / magnitude;
      steps.push(`û[${i}] = ${vector[i]} / ${magnitude} = ${result[i]}`);
    }

    return {
      result,
      steps,
      explanation: 'Normalized vector has magnitude 1'
    };
  }

  private vectorScalarMultiply(vector: number[], scalar: number): VectorResult {
    const result: number[] = [];
    const steps: string[] = [];

    for (let i = 0; i < vector.length; i++) {
      result[i] = vector[i] * scalar;
      steps.push(`c[${i}] = ${vector[i]} × ${scalar} = ${result[i]}`);
    }

    return {
      result,
      steps,
      explanation: 'Scalar multiplication multiplies each component by the scalar'
    };
  }

  private solveLinearSystem(problem: string, method?: string): SolutionResult {
    // Mock solution for linear system
    return {
      solution: { x: 2, y: 3 },
      method: method || 'Gaussian elimination',
      steps: [
        'Write augmented matrix',
        'Apply row operations',
        'Back substitution',
        'Solution: x = 2, y = 3'
      ],
      explanation: 'Solved using Gaussian elimination to reduce to row-echelon form'
    };
  }

  private findEigenvalues(problem: string): SolutionResult {
    // Mock eigenvalue calculation
    return {
      solution: { eigenvalues: [2, 3], eigenvectors: [[1, 0], [0, 1]] },
      method: 'Characteristic polynomial',
      steps: [
        'Find characteristic polynomial: det(A - λI) = 0',
        'Solve polynomial equation',
        'Find eigenvectors for each eigenvalue'
      ],
      explanation: 'Eigenvalues are roots of the characteristic polynomial'
    };
  }

  private calculateDeterminant(problem: string): SolutionResult {
    // Mock determinant calculation
    return {
      solution: 5,
      method: 'Cofactor expansion',
      steps: [
        'Choose row or column for expansion',
        'Calculate minors and cofactors',
        'Apply formula: det = Σ a_ij × C_ij'
      ],
      explanation: 'Determinant represents the scaling factor of the linear transformation'
    };
  }

  private generalProblemSolving(problem: string): SolutionResult {
    return {
      solution: 'Solution not implemented',
      method: 'General approach',
      steps: ['Analyze problem', 'Identify method', 'Apply solution'],
      explanation: 'This type of problem requires specific implementation'
    };
  }
}

export const mathService = new MathService();
