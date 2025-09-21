export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  topics: string[];
  prerequisites?: string[];
  learningObjectives: string[];
  keyConcepts: string[];
  exampleQuestions: string[];
}

export interface CurriculumTopic {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
  order: number;
}

export const curriculumData: CurriculumTopic[] = [
  {
    id: 'vectors',
    name: 'Vectors and Vector Spaces',
    description: 'Introduction to vectors, vector operations, and vector spaces',
    icon: 'ArrowRight',
    color: 'blue',
    order: 1,
    lessons: [
      {
        id: 'vectors-intro',
        title: 'Introduction to Vectors',
        description: 'Learn what vectors are and how to represent them',
        difficulty: 'beginner',
        estimatedTime: '15 minutes',
        topics: ['vector definition', 'vector representation', 'magnitude', 'direction'],
        learningObjectives: [
          'Understand what a vector represents',
          'Learn to represent vectors in 2D and 3D',
          'Calculate vector magnitude and direction',
          'Distinguish between vectors and scalars'
        ],
        keyConcepts: ['magnitude', 'direction', 'components', 'unit vector'],
        exampleQuestions: [
          'What is a vector and how is it different from a scalar?',
          'How do I find the magnitude of vector (3, 4)?',
          'What is a unit vector and how do I create one?'
        ]
      },
      {
        id: 'vector-operations',
        title: 'Vector Operations',
        description: 'Addition, subtraction, and scalar multiplication of vectors',
        difficulty: 'beginner',
        estimatedTime: '20 minutes',
        topics: ['vector addition', 'vector subtraction', 'scalar multiplication', 'dot product'],
        prerequisites: ['vectors-intro'],
        learningObjectives: [
          'Add and subtract vectors geometrically and algebraically',
          'Multiply vectors by scalars',
          'Understand the geometric meaning of vector operations',
          'Calculate dot products and understand their significance'
        ],
        keyConcepts: ['vector addition', 'scalar multiplication', 'dot product', 'commutativity'],
        exampleQuestions: [
          'How do I add two vectors (1, 2) and (3, 4)?',
          'What is the dot product of (2, 3) and (4, 1)?',
          'What does the dot product tell us about two vectors?'
        ]
      },
      {
        id: 'vector-spaces',
        title: 'Vector Spaces',
        description: 'Introduction to vector spaces and subspaces',
        difficulty: 'intermediate',
        estimatedTime: '25 minutes',
        topics: ['vector space axioms', 'subspaces', 'span', 'linear independence'],
        prerequisites: ['vector-operations'],
        learningObjectives: [
          'Understand the definition of a vector space',
          'Identify subspaces of vector spaces',
          'Find the span of a set of vectors',
          'Determine linear independence of vectors'
        ],
        keyConcepts: ['vector space', 'subspace', 'span', 'linear independence', 'basis'],
        exampleQuestions: [
          'What makes a set of vectors a vector space?',
          'How do I check if vectors are linearly independent?',
          'What is the span of vectors (1, 0) and (0, 1)?'
        ]
      }
    ]
  },
  {
    id: 'matrices',
    name: 'Matrices and Matrix Operations',
    description: 'Matrix algebra, properties, and applications',
    icon: 'Grid3X3',
    color: 'green',
    order: 2,
    lessons: [
      {
        id: 'matrix-basics',
        title: 'Matrix Basics',
        description: 'Introduction to matrices and basic operations',
        difficulty: 'beginner',
        estimatedTime: '20 minutes',
        topics: ['matrix definition', 'matrix notation', 'matrix addition', 'scalar multiplication'],
        learningObjectives: [
          'Understand matrix notation and terminology',
          'Add and subtract matrices',
          'Multiply matrices by scalars',
          'Identify special types of matrices'
        ],
        keyConcepts: ['matrix', 'dimensions', 'entries', 'zero matrix', 'identity matrix'],
        exampleQuestions: [
          'What is a 2×3 matrix?',
          'How do I add two matrices?',
          'What is the identity matrix?'
        ]
      },
      {
        id: 'matrix-multiplication',
        title: 'Matrix Multiplication',
        description: 'Learn how to multiply matrices and understand the properties',
        difficulty: 'intermediate',
        estimatedTime: '25 minutes',
        topics: ['matrix multiplication', 'properties', 'non-commutativity', 'associativity'],
        prerequisites: ['matrix-basics'],
        learningObjectives: [
          'Multiply matrices correctly',
          'Understand when matrix multiplication is defined',
          'Recognize that matrix multiplication is not commutative',
          'Apply matrix multiplication to solve problems'
        ],
        keyConcepts: ['matrix multiplication', 'dimension compatibility', 'non-commutative', 'associative'],
        exampleQuestions: [
          'How do I multiply a 2×3 matrix by a 3×4 matrix?',
          'Why is matrix multiplication not commutative?',
          'What are the dimensions of the product of A×B?'
        ]
      },
      {
        id: 'matrix-inverse',
        title: 'Matrix Inverses',
        description: 'Finding and using matrix inverses',
        difficulty: 'intermediate',
        estimatedTime: '30 minutes',
        topics: ['inverse matrix', 'determinant', 'singular matrices', 'Gauss-Jordan elimination'],
        prerequisites: ['matrix-multiplication'],
        learningObjectives: [
          'Understand what a matrix inverse is',
          'Find inverses of 2×2 and 3×3 matrices',
          'Use determinants to check invertibility',
          'Apply matrix inverses to solve linear systems'
        ],
        keyConcepts: ['inverse', 'determinant', 'singular', 'nonsingular', 'Gauss-Jordan'],
        exampleQuestions: [
          'How do I find the inverse of a 2×2 matrix?',
          'What does it mean for a matrix to be singular?',
          'How can I use matrix inverses to solve Ax = b?'
        ]
      }
    ]
  },
  {
    id: 'linear-systems',
    name: 'Systems of Linear Equations',
    description: 'Solving linear systems using various methods',
    icon: 'Calculator',
    color: 'purple',
    order: 3,
    lessons: [
      {
        id: 'gaussian-elimination',
        title: 'Gaussian Elimination',
        description: 'Learn to solve linear systems using row operations',
        difficulty: 'intermediate',
        estimatedTime: '30 minutes',
        topics: ['augmented matrix', 'row operations', 'echelon form', 'back substitution'],
        learningObjectives: [
          'Set up augmented matrices for linear systems',
          'Perform elementary row operations',
          'Reduce matrices to row echelon form',
          'Solve systems using back substitution'
        ],
        keyConcepts: ['augmented matrix', 'row operations', 'echelon form', 'pivot', 'back substitution'],
        exampleQuestions: [
          'How do I solve a 3×3 system using Gaussian elimination?',
          'What are the three types of row operations?',
          'How do I know if a system has no solution?'
        ]
      },
      {
        id: 'matrix-equations',
        title: 'Matrix Equations',
        description: 'Express and solve linear systems as matrix equations',
        difficulty: 'intermediate',
        estimatedTime: '25 minutes',
        topics: ['Ax = b', 'matrix equations', 'solution sets', 'homogeneous systems'],
        prerequisites: ['gaussian-elimination'],
        learningObjectives: [
          'Express linear systems as matrix equations',
          'Understand the relationship between Ax = b and linear systems',
          'Solve homogeneous and non-homogeneous systems',
          'Interpret solution sets geometrically'
        ],
        keyConcepts: ['matrix equation', 'homogeneous', 'particular solution', 'general solution'],
        exampleQuestions: [
          'How do I write a linear system as Ax = b?',
          'What is the difference between homogeneous and non-homogeneous systems?',
          'How do I find all solutions to Ax = 0?'
        ]
      }
    ]
  },
  {
    id: 'projections',
    name: 'Orthogonal Projections',
    description: 'Projecting vectors onto subspaces and least squares',
    icon: 'Target',
    color: 'orange',
    order: 4,
    lessons: [
      {
        id: 'orthogonal-vectors',
        title: 'Orthogonal Vectors',
        description: 'Understanding orthogonality and orthogonal sets',
        difficulty: 'intermediate',
        estimatedTime: '20 minutes',
        topics: ['orthogonal vectors', 'orthogonal sets', 'orthonormal sets', 'Pythagorean theorem'],
        learningObjectives: [
          'Recognize orthogonal vectors',
          'Understand orthogonal and orthonormal sets',
          'Apply the Pythagorean theorem in vector spaces',
          'Use orthogonality to simplify calculations'
        ],
        keyConcepts: ['orthogonal', 'orthonormal', 'Pythagorean theorem', 'orthogonal complement'],
        exampleQuestions: [
          'How do I check if two vectors are orthogonal?',
          'What is an orthonormal set?',
          'How do orthogonal vectors relate to the Pythagorean theorem?'
        ]
      },
      {
        id: 'vector-projections',
        title: 'Vector Projections',
        description: 'Projecting one vector onto another',
        difficulty: 'intermediate',
        estimatedTime: '25 minutes',
        topics: ['projection formula', 'projection vector', 'orthogonal component', 'projection matrix'],
        prerequisites: ['orthogonal-vectors'],
        learningObjectives: [
          'Calculate projections of one vector onto another',
          'Find orthogonal components',
          'Understand the geometric meaning of projections',
          'Apply projections to solve problems'
        ],
        keyConcepts: ['projection', 'orthogonal component', 'projection formula', 'projection matrix'],
        exampleQuestions: [
          'How do I project vector b onto vector a?',
          'What is the difference between the projection and the orthogonal component?',
          'How can I use projections to find the closest point?'
        ]
      },
      {
        id: 'least-squares',
        title: 'Least Squares Approximation',
        description: 'Finding best-fit solutions to overdetermined systems',
        difficulty: 'advanced',
        estimatedTime: '35 minutes',
        topics: ['overdetermined systems', 'normal equations', 'least squares solution', 'residuals'],
        prerequisites: ['vector-projections'],
        learningObjectives: [
          'Understand overdetermined linear systems',
          'Derive and solve normal equations',
          'Find least squares solutions',
          'Interpret residuals and goodness of fit'
        ],
        keyConcepts: ['overdetermined', 'normal equations', 'least squares', 'residuals', 'goodness of fit'],
        exampleQuestions: [
          'How do I find the least squares solution to Ax = b?',
          'What are normal equations and why are they useful?',
          'How do I measure the quality of a least squares fit?'
        ]
      }
    ]
  },
  {
    id: 'eigenvalues',
    name: 'Eigenvalues and Eigenvectors',
    description: 'Characteristic values and vectors of matrices',
    icon: 'Zap',
    color: 'red',
    order: 5,
    lessons: [
      {
        id: 'eigenvalue-intro',
        title: 'Introduction to Eigenvalues',
        description: 'Understanding eigenvalues and eigenvectors',
        difficulty: 'intermediate',
        estimatedTime: '25 minutes',
        topics: ['eigenvalue definition', 'eigenvector definition', 'characteristic equation', 'eigenvalue properties'],
        learningObjectives: [
          'Understand what eigenvalues and eigenvectors represent',
          'Find eigenvalues by solving characteristic equations',
          'Find eigenvectors for given eigenvalues',
          'Recognize the geometric meaning of eigenvalues'
        ],
        keyConcepts: ['eigenvalue', 'eigenvector', 'characteristic equation', 'eigenspace'],
        exampleQuestions: [
          'What is an eigenvalue and how do I find it?',
          'How do I find eigenvectors for a given eigenvalue?',
          'What does an eigenvalue tell us about a matrix transformation?'
        ]
      },
      {
        id: 'eigenvalue-properties',
        title: 'Eigenvalue Properties',
        description: 'Important properties and applications of eigenvalues',
        difficulty: 'advanced',
        estimatedTime: '30 minutes',
        topics: ['eigenvalue sum', 'eigenvalue product', 'similarity', 'diagonalization'],
        prerequisites: ['eigenvalue-intro'],
        learningObjectives: [
          'Understand the relationship between eigenvalues and trace/determinant',
          'Recognize when matrices are similar',
          'Learn about diagonalization',
          'Apply eigenvalue properties to solve problems'
        ],
        keyConcepts: ['trace', 'determinant', 'similarity', 'diagonalization', 'eigenvalue sum'],
        exampleQuestions: [
          'How do eigenvalues relate to the trace and determinant?',
          'What does it mean for two matrices to be similar?',
          'When can a matrix be diagonalized?'
        ]
      },
      {
        id: 'applications',
        title: 'Applications of Eigenvalues',
        description: 'Real-world applications in science and engineering',
        difficulty: 'advanced',
        estimatedTime: '35 minutes',
        topics: ['stability analysis', 'principal component analysis', 'vibrations', 'population dynamics'],
        prerequisites: ['eigenvalue-properties'],
        learningObjectives: [
          'Apply eigenvalues to stability analysis',
          'Understand PCA and its connection to eigenvalues',
          'Model vibrations using eigenvalues',
          'Recognize eigenvalue applications in various fields'
        ],
        keyConcepts: ['stability', 'PCA', 'vibrations', 'population dynamics', 'applications'],
        exampleQuestions: [
          'How do eigenvalues determine system stability?',
          'What is principal component analysis and how does it use eigenvalues?',
          'How can eigenvalues model natural frequencies?'
        ]
      }
    ]
  },
  {
    id: 'linear-transformations',
    name: 'Linear Transformations',
    description: 'Mappings between vector spaces and their properties',
    icon: 'Move',
    color: 'indigo',
    order: 6,
    lessons: [
      {
        id: 'transformation-basics',
        title: 'Linear Transformation Basics',
        description: 'Understanding linear transformations and their properties',
        difficulty: 'intermediate',
        estimatedTime: '25 minutes',
        topics: ['linear transformation definition', 'linearity properties', 'kernel', 'range'],
        learningObjectives: [
          'Understand what makes a transformation linear',
          'Verify linearity of given transformations',
          'Find the kernel and range of transformations',
          'Recognize geometric examples of linear transformations'
        ],
        keyConcepts: ['linear transformation', 'linearity', 'kernel', 'null space', 'range'],
        exampleQuestions: [
          'What makes a transformation linear?',
          'How do I find the kernel of a linear transformation?',
          'What is the difference between kernel and range?'
        ]
      },
      {
        id: 'matrix-representations',
        title: 'Matrix Representations',
        description: 'Representing linear transformations with matrices',
        difficulty: 'intermediate',
        estimatedTime: '30 minutes',
        topics: ['standard matrix', 'matrix of transformation', 'coordinate vectors', 'change of basis'],
        prerequisites: ['transformation-basics'],
        learningObjectives: [
          'Find the standard matrix of a linear transformation',
          'Understand the relationship between transformations and matrices',
          'Work with coordinate vectors',
          'Handle change of basis for transformations'
        ],
        keyConcepts: ['standard matrix', 'coordinate vector', 'change of basis', 'matrix representation'],
        exampleQuestions: [
          'How do I find the matrix representation of a linear transformation?',
          'What is the standard matrix and how do I construct it?',
          'How do coordinate vectors relate to transformations?'
        ]
      }
    ]
  }
];

export const getTopicById = (id: string): CurriculumTopic | undefined => {
  return curriculumData.find(topic => topic.id === id);
};

export const getLessonById = (topicId: string, lessonId: string): Lesson | undefined => {
  const topic = getTopicById(topicId);
  return topic?.lessons.find(lesson => lesson.id === lessonId);
};

export const getAllTopics = (): CurriculumTopic[] => {
  return curriculumData.sort((a, b) => a.order - b.order);
};

