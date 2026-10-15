import { Topic, QuizQuestion, TextbookPassage, Achievement } from '../types/studyverse';

export const CURRICULUM_TOPICS: Topic[] = [
  // --- CLASS 6 & 7 FOUNDATION PREREQUISITE TOPICS ---
  {
    id: 'math-6-fractions-ops',
    title: 'Fractions & Operations on Rational Quantities',
    classLevel: 6,
    subject: 'Mathematics',
    chapter: 'Class 6 Ch 7: Fractions',
    prerequisiteTopicIds: [],
    learningObjectives: [
      'Find the Least Common Multiple (LCM) of denominators to combine unlike fractions',
      'Multiply an entire equation by the LCM to clear fractional denominators cleanly',
    ],
    estimatedMinutes: 12,
    difficulty: 'Easy',
    isFoundationTopic: true,
    whyPrerequisiteMatters:
      'Class 8 linear equations frequently include fractional coefficients like (x/2) + (x/3) = 5. Clearing denominators with the LCM prevents arithmetic mistakes.',
    lessonSummary:
      'When two fractions have different denominators, we cannot add their numerators directly. By finding the Least Common Multiple (LCM) of the denominators, we convert them into equivalent fractions—or in an equation, multiply every term on both sides by the LCM to eliminate fractions altogether.',
    keyFormulasOrRules: [
      'a/b + c/d = (ad + bc) / bd',
      'To clear denominators in x/a + x/b = c, multiply every term on both sides by LCM(a, b).',
    ],
    workedExample: {
      problem: 'Simplify and solve: x/2 + x/3 = 10',
      steps: [
        'Find LCM of denominators 2 and 3, which is 6.',
        'Multiply both sides of the equation by 6: 6*(x/2) + 6*(x/3) = 6*10.',
        'Simplify: 3x + 2x = 60 -> 5x = 60 -> x = 12.',
      ],
      conclusion: 'Clearing fractions first converts a complex fractional equation into a 1-step integer equation.',
    },
    ncertReference: {
      bookTitle: 'NCERT Mathematics Class VI',
      chapterNumber: 7,
      pageRange: 'pp. 135–158',
    },
  },
  {
    id: 'math-7-simple-eq',
    title: 'Simple Equations: Balancing & Transposing Terms',
    classLevel: 7,
    subject: 'Mathematics',
    chapter: 'Class 7 Ch 4: Simple Equations',
    prerequisiteTopicIds: ['math-6-fractions-ops'],
    learningObjectives: [
      'Understand an equation as a balanced weighing scale where LHS equals RHS',
      'Transpose terms across the equality sign by inverting operations (+ to -, * to /)',
    ],
    estimatedMinutes: 15,
    difficulty: 'Easy',
    isFoundationTopic: true,
    whyPrerequisiteMatters:
      'Before solving Class 8 equations with variables on both sides, you must reliably transpose constants and variable terms without sign errors.',
    lessonSummary:
      'An equation remains balanced only if the exact same operation is applied to both sides. Transposing a term from one side of the "=" sign to the other is a shortcut for adding or subtracting that term on both sides—which means its sign MUST flip (+ becomes -, and - becomes +).',
    keyFormulasOrRules: [
      'If x + a = b, then x = b - a (addition becomes subtraction on transposition).',
      'If ax = b (with a != 0), then x = b / a (multiplication becomes division).',
    ],
    workedExample: {
      problem: 'Solve for y: 4y - 7 = 13',
      steps: [
        'Transpose -7 from LHS to RHS so its sign changes to +7: 4y = 13 + 7.',
        'Simplify RHS: 4y = 20.',
        'Divide both sides by 4: y = 20 / 4 = 5.',
      ],
      conclusion: 'Verify by substituting y = 5 into LHS: 4(5) - 7 = 20 - 7 = 13 = RHS.',
    },
    ncertReference: {
      bookTitle: 'NCERT Mathematics Class VII',
      chapterNumber: 4,
      pageRange: 'pp. 77–92',
    },
  },
  {
    id: 'math-7-algebraic-terms',
    title: 'Algebraic Terms, Like Terms & Distributive Property',
    classLevel: 7,
    subject: 'Mathematics',
    chapter: 'Class 7 Ch 12: Algebraic Expressions',
    prerequisiteTopicIds: [],
    learningObjectives: [
      'Distinguish like terms (same variables and powers) from unlike terms',
      'Apply the distributive law a(b + c) = ab + ac accurately including negative signs',
    ],
    estimatedMinutes: 15,
    difficulty: 'Easy',
    isFoundationTopic: true,
    whyPrerequisiteMatters:
      'Multiplying polynomials and expanding identities in Class 8 relies on distributing every term outside brackets across every term inside brackets.',
    lessonSummary:
      'Only like terms (such as 3xy and -7xy) can be added or subtracted by combining their numerical coefficients. When multiplying a term across parentheses, multiply the outside factor with EVERY term inside the parentheses, paying careful attention to negative signs.',
    keyFormulasOrRules: [
      'Distributive Law: a(b + c) = ab + ac',
      'Sign Rule: (-a)(b - c) = -ab + ac',
    ],
    workedExample: {
      problem: 'Expand and simplify: 3x(2x - 5) - 4x^2',
      steps: [
        'Distribute 3x across (2x - 5): (3x * 2x) + (3x * -5) = 6x^2 - 15x.',
        'Combine like terms (6x^2 and -4x^2): (6 - 4)x^2 - 15x = 2x^2 - 15x.',
      ],
      conclusion: 'Always multiply the outside factor with the second term inside the bracket too!',
    },
    ncertReference: {
      bookTitle: 'NCERT Mathematics Class VII',
      chapterNumber: 12,
      pageRange: 'pp. 229–246',
    },
  },
  {
    id: 'sci-7-motion-time',
    title: 'Force Direction, Motion & Surface Area Basics',
    classLevel: 7,
    subject: 'Science',
    chapter: 'Class 7 Ch 9: Motion and Time',
    prerequisiteTopicIds: [],
    learningObjectives: [
      'Understand how forces change speed or direction of motion',
      'Measure unit area in square metres (m^2) and convert cm^2 to m^2',
    ],
    estimatedMinutes: 12,
    difficulty: 'Easy',
    isFoundationTopic: true,
    whyPrerequisiteMatters:
      'Class 8 Force and Pressure requires combining net forces (same vs opposite directions) and dividing perpendicular force by contact area.',
    lessonSummary:
      'An object changes its speed or direction when an unbalanced force acts on it. When forces act along the same line, forces in the same direction add together while forces in opposite directions subtract.',
    keyFormulasOrRules: [
      'Net Force (same direction) = F1 + F2',
      'Net Force (opposite directions) = |F1 - F2| in the direction of the larger force',
    ],
    workedExample: {
      problem: 'Two students push a heavy crate east with 40 N and 35 N, while friction opposes with 15 N west. Find the net force.',
      steps: [
        'Total eastward push = 40 N + 35 N = 75 N.',
        'Subtract opposing westward friction: 75 N - 15 N = 60 N east.',
      ],
      conclusion: 'Net force is 60 N towards the east.',
    },
    ncertReference: {
      bookTitle: 'NCERT Science Class VII',
      chapterNumber: 9,
      pageRange: 'pp. 143–156',
    },
  },
  {
    id: 'sci-6-electric-circuits',
    title: 'Electric Circuits: Conductors vs Insulators',
    classLevel: 6,
    subject: 'Science',
    chapter: 'Class 6 Ch 9: Electricity and Circuits',
    prerequisiteTopicIds: [],
    learningObjectives: [
      'Identify closed vs open circuit paths',
      'Distinguish electrical conductors (metals, electrolytes) from insulators',
    ],
    estimatedMinutes: 12,
    difficulty: 'Easy',
    isFoundationTopic: true,
    whyPrerequisiteMatters:
      'To understand how electric current causes chemical effects in liquids in Class 8, you first need to know how closed circuits and conductivity work.',
    lessonSummary:
      'Electric current flows from the positive terminal to the negative terminal of a cell only when the circuit path is unbroken and consists of conducting materials.',
    keyFormulasOrRules: [
      'Conductors allow charge flow; insulators block charge flow.',
      'A bulb glows or a magnetic needle deflects only when the circuit is closed.',
    ],
    workedExample: {
      problem: 'Why does a circuit tester bulb not glow when its free ends touch a plastic ruler?',
      steps: [
        'Plastic is an electrical insulator with no free charge carriers.',
        'The circuit remains effectively open, preventing current flow.',
      ],
      conclusion: 'Replacing the plastic ruler with a metal key closes the circuit and lights the bulb.',
    },
    ncertReference: {
      bookTitle: 'NCERT Science Class VI',
      chapterNumber: 9,
      pageRange: 'pp. 116–124',
    },
  },

  // --- CLASS 8 CORE TOPICS ---
  {
    id: 'math-8-linear-eq',
    title: 'Linear Equations in One Variable',
    classLevel: 8,
    subject: 'Mathematics',
    chapter: 'Class 8 Ch 2: Linear Equations in One Variable',
    prerequisiteTopicIds: ['math-7-simple-eq', 'math-6-fractions-ops'],
    learningObjectives: [
      'Solve linear equations having the variable on both sides (LHS and RHS)',
      'Reduce fractional linear equations using the LCM of denominators',
      'Formulate and solve word problems using single-variable equations',
    ],
    estimatedMinutes: 25,
    difficulty: 'Medium',
    isFoundationTopic: false,
    lessonSummary:
      'In Class 8, linear equations can have variable terms on both sides of the equality sign, such as 5x - 7 = 2x + 8, or fractional forms like (x - 3)/4 + x/2 = 6. Solve them systematically: first clear any fractions using the LCM of denominators, then transpose all variable terms to the LHS and constants to the RHS (flipping the sign of every transposed term), and finally divide by the coefficient of x.',
    keyFormulasOrRules: [
      'General form: ax + b = cx + d  =>  (a - c)x = d - b  =>  x = (d - b) / (a - c)',
      'Sign inversion on transposition: + becomes -; - becomes +',
      'Always verify your root by substituting x back into LHS and RHS independently.',
    ],
    workedExample: {
      problem: 'Solve: 5x - 7 = 2x + 8',
      steps: [
        'Transpose 2x from RHS to LHS (becomes -2x): 5x - 2x - 7 = 8.',
        'Transpose -7 from LHS to RHS (becomes +7): 3x = 8 + 7 = 15.',
        'Divide both sides by 3: x = 15 / 3 = 5.',
        'Check: LHS = 5(5) - 7 = 18; RHS = 2(5) + 8 = 18. LHS = RHS!',
      ],
      conclusion: 'x = 5 is the verified solution.',
    },
    ncertReference: {
      bookTitle: 'NCERT Mathematics Class VIII',
      chapterNumber: 2,
      pageRange: 'pp. 19–36',
    },
  },
  {
    id: 'math-8-algebraic-expr',
    title: 'Algebraic Expressions and Identities',
    classLevel: 8,
    subject: 'Mathematics',
    chapter: 'Class 8 Ch 8: Algebraic Expressions and Identities',
    prerequisiteTopicIds: ['math-7-algebraic-terms'],
    learningObjectives: [
      'Multiply monomials, binomials, and trinomials using the distributive law',
      'Apply standard algebraic identities (a+b)^2, (a-b)^2, and (a+b)(a-b)',
      'Avoid the common misconception of writing (a+b)^2 as a^2 + b^2',
    ],
    estimatedMinutes: 25,
    difficulty: 'Medium',
    isFoundationTopic: false,
    lessonSummary:
      'An algebraic identity is an equality that holds true for all values of its variables. When squaring a binomial (a + b)^2, multiplying (a + b)(a + b) by the distributive property gives a^2 + ab + ba + b^2 = a^2 + 2ab + b^2. Never forget the middle term 2ab!',
    keyFormulasOrRules: [
      'Identity I: (a + b)^2 = a^2 + 2ab + b^2',
      'Identity II: (a - b)^2 = a^2 - 2ab + b^2',
      'Identity III: (a + b)(a - b) = a^2 - b^2',
      'General Identity: (x + a)(x + b) = x^2 + (a + b)x + ab',
    ],
    workedExample: {
      problem: 'Expand (3x - 4y)^2 using a suitable identity.',
      steps: [
        'Use Identity II: (a - b)^2 = a^2 - 2ab + b^2 with a = 3x and b = 4y.',
        'Compute a^2 = (3x)^2 = 9x^2.',
        'Compute middle term -2ab = -2 * (3x) * (4y) = -24xy.',
        'Compute b^2 = (4y)^2 = 16y^2.',
      ],
      conclusion: '(3x - 4y)^2 = 9x^2 - 24xy + 16y^2.',
    },
    ncertReference: {
      bookTitle: 'NCERT Mathematics Class VIII',
      chapterNumber: 8,
      pageRange: 'pp. 93–108',
    },
  },
  {
    id: 'sci-8-force-pressure',
    title: 'Force and Pressure',
    classLevel: 8,
    subject: 'Science',
    chapter: 'Class 8 Ch 8: Force and Pressure',
    prerequisiteTopicIds: ['sci-7-motion-time'],
    learningObjectives: [
      'Calculate resultant force for forces acting along the same or opposite directions',
      'Use Pressure = Force / Area (in Pascals) to explain everyday phenomena',
      'Explain liquid pressure and atmospheric pressure behavior',
    ],
    estimatedMinutes: 20,
    difficulty: 'Medium',
    isFoundationTopic: false,
    lessonSummary:
      'Force is a push or pull resulting from interaction between two objects. The effectiveness of a force depends not only on its magnitude but also on the area over which it acts. Pressure is defined as perpendicular force per unit area (P = F / A). Because Area is in the denominator, reducing contact area increases pressure dramatically for the same force.',
    keyFormulasOrRules: [
      'Pressure (P) = Force (F) / Area (A)',
      '1 Pascal (Pa) = 1 Newton / 1 m^2',
      'Liquids exert equal pressure at the same depth, and pressure increases with depth.',
    ],
    workedExample: {
      problem: 'A force of 120 N acts perpendicularly on a surface of area 0.04 m^2. Calculate the pressure.',
      steps: [
        'Write the formula: P = F / A.',
        'Substitute F = 120 N and A = 0.04 m^2: P = 120 / 0.04.',
        'Multiply numerator and denominator by 100: P = 12000 / 4 = 3000 Pa.',
      ],
      conclusion: 'The pressure exerted on the surface is 3000 Pa (or 3 kPa).',
    },
    ncertReference: {
      bookTitle: 'NCERT Science Class VIII',
      chapterNumber: 8,
      pageRange: 'pp. 95–112',
    },
  },
  {
    id: 'sci-8-chemical-effects',
    title: 'Chemical Effects of Electric Current',
    classLevel: 8,
    subject: 'Science',
    chapter: 'Class 8 Ch 11: Chemical Effects of Electric Current',
    prerequisiteTopicIds: ['sci-6-electric-circuits'],
    learningObjectives: [
      'Explain why tap water conducts electricity while distilled water does not',
      'Describe chemical reactions at electrodes (gas bubbles, color changes, metal deposition)',
      'Understand the process and practical uses of electroplating',
    ],
    estimatedMinutes: 20,
    difficulty: 'Medium',
    isFoundationTopic: false,
    lessonSummary:
      'While metals conduct electricity via free electrons, conducting liquids (electrolytes) conduct current via dissolved ions (acids, bases, or salts). Passing an electric current through an electrolyte causes chemical reactions at the electrodes—a phenomenon used in electroplating to coat one metal with another (such as chromium on car parts or zinc on iron).',
    keyFormulasOrRules: [
      'Pure distilled water has no dissolved salts -> poor conductor.',
      'Adding acid, base, or salt creates free mobile ions -> good conductor (electrolyte).',
      'In electroplating, the object to be coated is connected to the negative terminal (cathode).',
    ],
    workedExample: {
      problem: 'During copper electroplating of an iron key using copper sulphate solution, which terminal is connected to the iron key?',
      steps: [
        'Copper ions (Cu^2+) in solution carry a positive charge.',
        'Positive Cu^2+ ions are attracted to the negatively charged electrode (cathode).',
        'Therefore, connect the iron key to the negative terminal of the battery.',
      ],
      conclusion: 'Copper deposits as a thin coat over the iron key at the cathode.',
    },
    ncertReference: {
      bookTitle: 'NCERT Science Class VIII',
      chapterNumber: 11,
      pageRange: 'pp. 134–145',
    },
  },
  {
    id: 'eng-8-active-passive',
    title: 'Active and Passive Voice Transformation',
    classLevel: 8,
    subject: 'English',
    chapter: 'Class 8 Grammar: Active & Passive Voice',
    prerequisiteTopicIds: [],
    learningObjectives: [
      'Identify subject, transitive verb, and object in active sentences',
      'Convert sentences into passive voice while preserving tense using be + past participle (V3)',
    ],
    estimatedMinutes: 15,
    difficulty: 'Easy',
    isFoundationTopic: false,
    lessonSummary:
      'In Active Voice, the subject performs the action. In Passive Voice, the object of the active verb becomes the grammatical subject, and the verb takes the form [appropriate tense of "to be" + Past Participle (V3)].',
    keyFormulasOrRules: [
      'Simple Present Passive: am / is / are + V3',
      'Simple Past Passive: was / were + V3',
      'Present Continuous Passive: am / is / are + being + V3',
    ],
    workedExample: {
      problem: 'Convert to Passive Voice: "The students solved the diagnostic quiz."',
      steps: [
        'Identify Object ("the diagnostic quiz") and Verb ("solved" -> Simple Past).',
        'Use Simple Past passive auxiliary "was" + V3 ("solved").',
        'Form sentence: "The diagnostic quiz was solved by the students."',
      ],
      conclusion: 'Tense remains Simple Past while focus shifts to the quiz.',
    },
    ncertReference: {
      bookTitle: 'NCERT Honeydew & Grammar Class VIII',
      chapterNumber: 3,
      pageRange: 'pp. 42–48',
    },
  },
  {
    id: 'sst-8-indian-constitution',
    title: 'The Indian Constitution & Key Features',
    classLevel: 8,
    subject: 'Social Science',
    chapter: 'Class 8 Civics Ch 1: The Indian Constitution',
    prerequisiteTopicIds: [],
    learningObjectives: [
      'Explain why a democratic country needs a Constitution',
      'Understand Federalism, Parliamentary Form of Government, Separation of Powers, and Fundamental Rights',
    ],
    estimatedMinutes: 20,
    difficulty: 'Easy',
    isFoundationTopic: false,
    lessonSummary:
      'The Indian Constitution lays down the ideals that form the basis of our country, defines the nature of our political system, and provides safeguards against the misuse of power by authority through Fundamental Rights and Separation of Powers among the Legislature, Executive, and Judiciary.',
    keyFormulasOrRules: [
      'Federalism: Existence of more than one level of government (Centre, State, Panchayati Raj).',
      'Separation of Powers: Legislature makes laws, Executive implements laws, Judiciary interprets laws.',
    ],
    workedExample: {
      problem: 'Which feature of the Indian Constitution prevents any single branch of government from exercising unchecked power?',
      steps: [
        'The Constitution divides State power into three organs: Legislature, Executive, and Judiciary.',
        'Each organ acts as a check on the other organs of government.',
      ],
      conclusion: 'This feature is called the Separation of Powers.',
    },
    ncertReference: {
      bookTitle: 'NCERT Social and Political Life III (Class VIII)',
      chapterNumber: 1,
      pageRange: 'pp. 4–16',
    },
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // 1. Diagnostic Math: Linear Equations in One Variable
  {
    id: 'q-diag-math-linear-1',
    topicId: 'math-8-linear-eq',
    subject: 'Mathematics',
    classLevel: 8,
    chapter: 'Ch 2: Linear Equations in One Variable',
    topicTitle: 'Linear Equations in One Variable',
    questionText: 'What is the value of x that satisfies the linear equation 5x - 7 = 2x + 8?',
    options: ['x = 1/3', 'x = 5', 'x = 3', 'x = 15'],
    correctOptionIndex: 1,
    hints: [
      'Hint 1 (Conceptual Clue): Collect all terms containing the variable x on the Left Hand Side (LHS) and all constant numbers on the Right Hand Side (RHS).',
      'Hint 2 (Rule Pointer): Remember the transposition rule—when you move a term across the "=" sign, its sign flips (+2x becomes -2x, and -7 becomes +7).',
      'Hint 3 (Specific Scaffold): After transposing, you get 5x - 2x = 8 + 7, which simplifies to 3x = 15. Now divide both sides by 3.',
    ],
    expectedReasoningKeywords: ['transpose', 'subtract', '3x', '15', 'both sides', 'divide', 'balance', '8 + 7'],
    misconceptionKeywords: ['guessed', 'random', 'subtracted 7 from 8', 'added 2x'],
    sampleStrongReasoning:
      'I transposed 2x to the LHS to get 5x - 2x = 3x, and transposed -7 to the RHS to get 8 + 7 = 15. Dividing 15 by 3 gives x = 5.',
    sampleWeakReasoning: 'It looked like 5 fit best when I glanced at the options.',
    explanation: {
      whyCorrect:
        'Transposing 2x to the LHS gives 5x - 2x = 3x, and transposing -7 to the RHS gives 8 + 7 = 15. Dividing both sides of 3x = 15 by 3 yields x = 5.',
      whyWrongOptionsFail:
        'Option A (1/3) happens if you forget to flip the sign of -7 (computing 8 - 7 = 1). Option C (3) happens if you add 5x + 2x = 7x or miscalculate 15/3. Option D (15) stops at 3x = 15 without dividing by 3.',
      coreConceptOrFormula: 'Transposition Principle: ax + b = cx + d  =>  (a - c)x = d - b',
      simpleExample: 'In 4x - 3 = x + 6, we write 4x - x = 6 + 3  =>  3x = 9  =>  x = 3.',
    },
    isDiagnostic: true,
  },

  // 2. Diagnostic Math: Algebraic Expressions and Identities
  {
    id: 'q-diag-math-alg-1',
    topicId: 'math-8-algebraic-expr',
    subject: 'Mathematics',
    classLevel: 8,
    chapter: 'Ch 8: Algebraic Expressions and Identities',
    topicTitle: 'Algebraic Expressions and Identities',
    questionText: 'Which expression is the correct expansion of (2x - 3y)^2?',
    options: [
      '4x^2 - 9y^2',
      '4x^2 + 9y^2',
      '4x^2 - 12xy + 9y^2',
      '2x^2 - 6xy + 3y^2',
    ],
    correctOptionIndex: 2,
    hints: [
      'Hint 1 (Conceptual Clue): Squaring a binomial (a - b)^2 means multiplying (a - b) by (a - b) using the distributive property—not just squaring each term separately.',
      'Hint 2 (Rule Pointer): Apply Standard Identity II: (a - b)^2 = a^2 - 2ab + b^2, where a = 2x and b = 3y.',
      'Hint 3 (Specific Scaffold): Square the first term (2x)^2 = 4x^2, subtract twice the product 2*(2x)*(3y) = 12xy, and add (3y)^2 = 9y^2.',
    ],
    expectedReasoningKeywords: ['identity', '2ab', 'middle term', '12xy', 'distributive', 'a^2', 'b^2'],
    misconceptionKeywords: ['guessed', 'squared both', 'lucky'],
    sampleStrongReasoning:
      'Using the identity (a - b)^2 = a^2 - 2ab + b^2 with a = 2x and b = 3y, we get (2x)^2 - 2(2x)(3y) + (3y)^2 = 4x^2 - 12xy + 9y^2.',
    sampleWeakReasoning: 'I picked the longest option with xy in the middle.',
    explanation: {
      whyCorrect:
        'By Identity II, (a - b)^2 = a^2 - 2ab + b^2. Substituting a = 2x and b = 3y gives (2x)^2 - 2(2x)(3y) + (3y)^2 = 4x^2 - 12xy + 9y^2.',
      whyWrongOptionsFail:
        'Options A and B omit the middle term -2ab (-12xy), which is the most common algebraic misconception. Option D forgets to square the numerical coefficients 2 and 3.',
      coreConceptOrFormula: 'Identity II: (a - b)^2 = a^2 - 2ab + b^2',
      simpleExample: '(x - 5)^2 = x^2 - 2(x)(5) + 5^2 = x^2 - 10x + 25.',
    },
    isDiagnostic: true,
  },

  // 3. Diagnostic Science: Force and Pressure
  {
    id: 'q-diag-sci-pressure-1',
    topicId: 'sci-8-force-pressure',
    subject: 'Science',
    classLevel: 8,
    chapter: 'Ch 8: Force and Pressure',
    topicTitle: 'Force and Pressure',
    questionText:
      'A brick weighing 30 N rests on a table. Position X has contact area 0.02 m^2, and Position Y has contact area 0.06 m^2. Which statement is true about the pressure exerted on the table?',
    options: [
      'Position X exerts 3 times more pressure (1500 Pa) than Position Y (500 Pa).',
      'Position Y exerts 3 times more pressure because its surface area is larger.',
      'Both positions exert the exact same pressure because the brick weight is 30 N.',
      'Position X exerts 0.6 Pa while Position Y exerts 1.8 Pa.',
    ],
    correctOptionIndex: 0,
    hints: [
      'Hint 1 (Conceptual Clue): Think about how the same force feels when applied through a sharp needle versus a flat palm.',
      'Hint 2 (Rule Pointer): Use the formula Pressure (P) = Force (F) / Area (A). Notice that Area is in the denominator.',
      'Hint 3 (Specific Scaffold): Calculate P_X = 30 / 0.02 and P_Y = 30 / 0.06, then compare the two values in Pascals.',
    ],
    expectedReasoningKeywords: ['force', 'area', 'divide', '1500', '500', 'smaller area', 'inverse', 'denominator'],
    misconceptionKeywords: ['multiply', 'same weight same pressure'],
    sampleStrongReasoning:
      'Pressure equals Force divided by Area (P = F/A). For Position X, P = 30 / 0.02 = 1500 Pa, and for Position Y, P = 30 / 0.06 = 500 Pa, so smaller area gives 3x higher pressure.',
    sampleWeakReasoning: 'I just chose Option A.',
    explanation: {
      whyCorrect:
        'Since Pressure = Force / Area, P_X = 30 N / 0.02 m^2 = 1500 Pa and P_Y = 30 N / 0.06 m^2 = 500 Pa. Because area is one-third as large in Position X, the pressure is 3 times greater.',
      whyWrongOptionsFail:
        'Option B confuses total area with pressure. Option C confuses total force (weight) with pressure. Option D multiplies Force by Area instead of dividing.',
      coreConceptOrFormula: 'P = F / A (Pressure is inversely proportional to contact area for a constant force).',
      simpleExample: 'A 100 N force over 0.1 m^2 produces 1000 Pa, whereas over 0.5 m^2 it produces only 200 Pa.',
    },
    isDiagnostic: true,
  },

  // 4. Diagnostic Science: Chemical Effects of Electric Current
  {
    id: 'q-diag-sci-chem-1',
    topicId: 'sci-8-chemical-effects',
    subject: 'Science',
    classLevel: 8,
    chapter: 'Ch 11: Chemical Effects of Electric Current',
    topicTitle: 'Chemical Effects of Electric Current',
    questionText:
      'Why does pure distilled water fail to make an LED glow in a conductivity tester, whereas adding a pinch of common salt makes the LED glow brightly?',
    options: [
      'Salt increases the temperature of water so electrons boil off the wires.',
      'Distilled water lacks free ions, whereas dissolved salt dissociates into mobile Na+ and Cl- ions that carry charge.',
      'Distilled water is too dense for electric current to pass through.',
      'Salt coats the tester wires with sodium metal to form a solid wire bridge.',
    ],
    correctOptionIndex: 1,
    hints: [
      'Hint 1 (Conceptual Clue): For electric current to flow through a liquid, there must be charged particles free to move between the electrodes.',
      'Hint 2 (Rule Pointer): Pure distilled water has no dissolved minerals or salts. Think about what happens chemically when NaCl dissolves in water.',
      'Hint 3 (Specific Scaffold): Dissolved salts split into positively and negatively charged ions (electrolytes) that move toward opposite electrodes.',
    ],
    expectedReasoningKeywords: ['ions', 'dissolve', 'salts', 'electrolyte', 'charge', 'distilled'],
    misconceptionKeywords: ['boil', 'density', 'solid bridge'],
    sampleStrongReasoning:
      'Pure distilled water has no dissolved salts so it lacks mobile ions. Dissolving common salt produces free Na+ and Cl- ions that conduct electricity through the solution.',
    sampleWeakReasoning: 'Salt water is known to conduct electricity.',
    explanation: {
      whyCorrect:
        'Conduction in liquids is electrolytic: pure distilled water contains almost no free ions, making it a poor conductor. Adding salt (NaCl), acid, or base provides mobile ions that carry charge between electrodes.',
      whyWrongOptionsFail:
        'Current conduction in salt water does not rely on boiling electrons (A), water density (C), or forming a solid metal wire bridge (D).',
      coreConceptOrFormula: 'Electrolytes conduct electric current via mobile dissolved ions (cations and anions).',
      simpleExample: 'Lemon juice (citric acid) or tap water also conducts electricity due to dissolved ions.',
    },
    isDiagnostic: true,
  },

  // 5. Diagnostic English (Included when English is selected)
  {
    id: 'q-diag-eng-voice-1',
    topicId: 'eng-8-active-passive',
    subject: 'English',
    classLevel: 8,
    chapter: 'Grammar: Active & Passive Voice',
    topicTitle: 'Active and Passive Voice Transformation',
    questionText:
      'Choose the correct Passive Voice transformation for: "The science teacher demonstrated the electroplating experiment."',
    options: [
      'The electroplating experiment is demonstrated by the science teacher.',
      'The electroplating experiment was demonstrated by the science teacher.',
      'The electroplating experiment had been demonstrated by the science teacher.',
      'The science teacher was demonstrating the electroplating experiment.',
    ],
    correctOptionIndex: 1,
    hints: [
      'Hint 1 (Conceptual Clue): First identify the tense of the verb "demonstrated" in the original active sentence.',
      'Hint 2 (Rule Pointer): For Simple Past active verbs (V2), the passive structure is [was / were + Past Participle (V3)].',
      'Hint 3 (Specific Scaffold): Since "The electroplating experiment" is singular and the tense is Simple Past, use "was demonstrated".',
    ],
    expectedReasoningKeywords: ['past', 'was demonstrated', 'object', 'passive', 'singular'],
    misconceptionKeywords: ['present tense'],
    sampleStrongReasoning:
      'The active verb "demonstrated" is in Simple Past tense, and the new subject "The electroplating experiment" is singular, so we use "was + V3" -> "was demonstrated".',
    sampleWeakReasoning: 'Option B sounded grammatical.',
    explanation: {
      whyCorrect:
        '"Demonstrated" is Simple Past tense. Moving the singular object "The electroplating experiment" to the subject position requires the Simple Past passive form "was demonstrated".',
      whyWrongOptionsFail:
        'Option A shifts tense to Simple Present ("is"). Option C shifts to Past Perfect ("had been"). Option D stays in Active Voice (Past Continuous).',
      coreConceptOrFormula: 'Simple Past Passive = Object + was/were + V3 + by + Subject',
      simpleExample: '"Riya wrote a poem" -> "A poem was written by Riya."',
    },
    isDiagnostic: true,
  },

  // 6. Diagnostic Social Science (Included when Social Science is selected)
  {
    id: 'q-diag-sst-const-1',
    topicId: 'sst-8-indian-constitution',
    subject: 'Social Science',
    classLevel: 8,
    chapter: 'Civics Ch 1: The Indian Constitution',
    topicTitle: 'The Indian Constitution & Key Features',
    questionText:
      'Which key feature of the Indian Constitution ensures a balance of power among the Legislature, the Executive, and the Judiciary?',
    options: [
      'Universal Adult Franchise',
      'Separation of Powers',
      'Directive Principles of State Policy',
      'Single Citizenship',
    ],
    correctOptionIndex: 1,
    hints: [
      'Hint 1 (Conceptual Clue): Look at the three organs named in the question—each has a distinct constitutional role.',
      'Hint 2 (Rule Pointer): To prevent misuse of power by any one branch, the Constitution divides authority across these three organs.',
      'Hint 3 (Specific Scaffold): Dividing power among Legislature, Executive, and Judiciary so each checks the others is called Separation of Powers.',
    ],
    expectedReasoningKeywords: ['three organs', 'check', 'balance', 'legislature', 'executive', 'judiciary', 'divide'],
    misconceptionKeywords: ['voting'],
    sampleStrongReasoning:
      'Separation of Powers divides state authority across the Legislature, Executive, and Judiciary so each organ acts as a check and balance on the others.',
    sampleWeakReasoning: 'I remembered the phrase from Civics.',
    explanation: {
      whyCorrect:
        'Under Separation of Powers, the Legislature makes laws, the Executive implements them, and the Judiciary adjudicates disputes—ensuring mutual checks and balances.',
      whyWrongOptionsFail:
        'Universal Adult Franchise guarantees voting rights to adults; Single Citizenship and Directive Principles do not define the division among the three branches.',
      coreConceptOrFormula: 'Separation of Powers = Legislature + Executive + Judiciary with mutual checks.',
      simpleExample: 'Courts (Judiciary) can review whether an executive action violates Constitutional rights.',
    },
    isDiagnostic: true,
  },

  // --- TARGETED PRACTICE QUESTIONS (Used after Foundation Lessons to reassess mastery) ---
  {
    id: 'q-prac-math-linear-2',
    topicId: 'math-8-linear-eq',
    subject: 'Mathematics',
    classLevel: 8,
    chapter: 'Ch 2: Linear Equations in One Variable',
    topicTitle: 'Linear Equations in One Variable',
    questionText: 'Solve the fractional linear equation: (x / 2) - (x / 3) = 4',
    options: ['x = 12', 'x = 24', 'x = 8', 'x = 6'],
    correctOptionIndex: 1,
    hints: [
      'Hint 1 (Conceptual Clue): Clear the fractional denominators first using the Class 6/7 LCM technique!',
      'Hint 2 (Rule Pointer): The denominators are 2 and 3. Their LCM is 6. Multiply every term on both sides by 6.',
      'Hint 3 (Specific Scaffold): 6*(x/2) - 6*(x/3) = 6*4 gives 3x - 2x = 24.',
    ],
    expectedReasoningKeywords: ['lcm', '6', '3x - 2x', '24', 'multiply both sides', 'denominator'],
    misconceptionKeywords: ['subtracted 3 - 2 = 1'],
    sampleStrongReasoning:
      'Multiplying both sides by the LCM of 2 and 3 (which is 6) gives 3x - 2x = 24, so x = 24.',
    sampleWeakReasoning: 'I tried plugging numbers in.',
    explanation: {
      whyCorrect:
        'The LCM of 2 and 3 is 6. Multiplying both sides by 6 gives 6(x/2) - 6(x/3) = 6(4)  =>  3x - 2x = 24  =>  x = 24.',
      whyWrongOptionsFail:
        'Option A (12) forgets to multiply the RHS by 6 properly. Option C (8) adds 3x + 2x instead of subtracting.',
      coreConceptOrFormula: 'Clear fractions first by multiplying every term on LHS and RHS by LCM of denominators.',
      simpleExample: 'Check x = 24: (24/2) - (24/3) = 12 - 8 = 4 = RHS.',
    },
    isDiagnostic: false,
  },
  {
    id: 'q-prac-math-linear-3',
    topicId: 'math-8-linear-eq',
    subject: 'Mathematics',
    classLevel: 8,
    chapter: 'Ch 2: Linear Equations in One Variable',
    topicTitle: 'Linear Equations in One Variable',
    questionText: 'Solve for t: 3(t - 3) = 5(2t + 1)',
    options: ['t = -2', 't = 2', 't = -4/7', 't = -14'],
    correctOptionIndex: 0,
    hints: [
      'Hint 1 (Conceptual Clue): First expand the brackets on both sides using the distributive property.',
      'Hint 2 (Rule Pointer): 3(t - 3) = 3t - 9 on LHS, and 5(2t + 1) = 10t + 5 on RHS.',
      'Hint 3 (Specific Scaffold): Transpose 10t to LHS and -9 to RHS: 3t - 10t = 5 + 9  =>  -7t = 14.',
    ],
    expectedReasoningKeywords: ['expand', '3t - 9', '10t + 5', '-7t', '14', 'transpose'],
    misconceptionKeywords: ['forgot negative'],
    sampleStrongReasoning:
      'Expanding brackets gives 3t - 9 = 10t + 5. Transposing gives -9 - 5 = 10t - 3t, so -14 = 7t and t = -2.',
    sampleWeakReasoning: 'Guessed A.',
    explanation: {
      whyCorrect:
        'Distributing gives 3t - 9 = 10t + 5. Transposing variable terms and constants gives 3t - 10t = 5 + 9  =>  -7t = 14  =>  t = 14 / (-7) = -2.',
      whyWrongOptionsFail:
        'Option B (+2) drops the negative sign when dividing 14 by -7. Option C forgets to distribute 3 and 5 to the second term in each bracket.',
      coreConceptOrFormula: 'Distribute first: a(x + b) = ax + ab, then transpose variables to one side.',
      simpleExample: 'Check t = -2: LHS = 3(-2 - 3) = -15; RHS = 5(2(-2) + 1) = 5(-3) = -15.',
    },
    isDiagnostic: false,
  },
  {
    id: 'q-prac-math-alg-2',
    topicId: 'math-8-algebraic-expr',
    subject: 'Mathematics',
    classLevel: 8,
    chapter: 'Ch 8: Algebraic Expressions and Identities',
    topicTitle: 'Algebraic Expressions and Identities',
    questionText: 'Using the identity (a + b)(a - b) = a^2 - b^2, evaluate 52 * 48 mentally.',
    options: ['2496', '2504', '2400', '2516'],
    correctOptionIndex: 0,
    hints: [
      'Hint 1 (Conceptual Clue): Express 52 and 48 as (50 + 2) and (50 - 2).',
      'Hint 2 (Rule Pointer): Apply Identity III: (a + b)(a - b) = a^2 - b^2 with a = 50 and b = 2.',
      'Hint 3 (Specific Scaffold): Calculate 50^2 - 2^2 = 2500 - 4.',
    ],
    expectedReasoningKeywords: ['50 + 2', '50 - 2', '2500 - 4', 'a^2 - b^2', 'difference of squares'],
    misconceptionKeywords: ['added 4'],
    sampleStrongReasoning:
      'Write 52 * 48 as (50 + 2)(50 - 2) = 50^2 - 2^2 = 2500 - 4 = 2496.',
    sampleWeakReasoning: 'Multiplied on paper.',
    explanation: {
      whyCorrect:
        '52 * 48 = (50 + 2)(50 - 2). Using (a + b)(a - b) = a^2 - b^2 gives 50^2 - 2^2 = 2500 - 4 = 2496.',
      whyWrongOptionsFail:
        'Option B (2504) adds 2^2 instead of subtracting. Option C (2400) forgets the +2 and -2 adjustment.',
      coreConceptOrFormula: 'Identity III: (a + b)(a - b) = a^2 - b^2',
      simpleExample: '103 * 97 = (100 + 3)(100 - 3) = 10000 - 9 = 9991.',
    },
    isDiagnostic: false,
  },
  {
    id: 'q-prac-sci-pressure-2',
    topicId: 'sci-8-force-pressure',
    subject: 'Science',
    classLevel: 8,
    chapter: 'Ch 8: Force and Pressure',
    topicTitle: 'Force and Pressure',
    questionText: 'Why are shoulder straps of school backpacks deliberately made wide rather than thin cords?',
    options: [
      'Wide straps increase the weight of the bag to build muscle.',
      'Wide straps increase the contact area, which reduces the pressure (P = F/A) on the student’s shoulders.',
      'Wide straps increase friction so gravity pulls less on the books.',
      'Wide straps concentrate all force onto a single point.',
    ],
    correctOptionIndex: 1,
    hints: [
      'Hint 1 (Conceptual Clue): Think about the relationship between contact area and pressure when weight (force) stays constant.',
      'Hint 2 (Rule Pointer): In P = F / A, increasing the denominator A makes the pressure P smaller.',
      'Hint 3 (Specific Scaffold): Larger strap area distributes the bag’s weight over more square centimetres, lowering pressure on the shoulder.',
    ],
    expectedReasoningKeywords: ['larger area', 'reduces pressure', 'distribute', 'p = f/a'],
    misconceptionKeywords: ['reduces weight'],
    sampleStrongReasoning:
      'Wide straps have a larger surface area A, which distributes the weight F and reduces pressure (P = F/A) on the shoulders.',
    sampleWeakReasoning: 'Wide straps feel comfortable.',
    explanation: {
      whyCorrect:
        'Since Pressure = Force / Area, increasing the contact area A of the strap spreads the weight of the bag over a wider surface and lowers the pressure on the shoulder.',
      whyWrongOptionsFail:
        'Wide straps do not change the gravitational pull (weight) on the books; they reduce force per unit area.',
      coreConceptOrFormula: 'P = F / A -> Larger Area (A) yields Lower Pressure (P).',
      simpleExample: 'Camels have broad feet so they exert less pressure on desert sand and do not sink.',
    },
    isDiagnostic: false,
  },
];

export const TEXTBOOK_PASSAGES: TextbookPassage[] = [
  {
    id: 'rag-m8-ch2-1',
    board: 'CBSE',
    classLevel: 8,
    subject: 'Mathematics',
    chapter: 'Ch 2: Linear Equations in One Variable',
    pageNumber: 21,
    topicId: 'math-8-linear-eq',
    content:
      'NCERT Class 8 Mathematics, Ch 2 (p. 21): An algebraic equation is an equality involving variables where the expression on the Left Hand Side (LHS) equals the expression on the Right Hand Side (RHS). To solve equations having the variable on both sides, we transpose variable terms to one side and constants to the other. If terms have fractional denominators, multiply both sides by the LCM of the denominators first.',
    simpleSummary:
      'Think of an equation like a balanced seesaw! First clear any fractions by multiplying everything by the LCM of the bottom numbers. Then move all "x" terms to the left side and plain numbers to the right side—remembering to flip "+" and "-" whenever a term crosses the "=" sign.',
    exampleText:
      'Worked Example: Solve x/2 - 3 = x/3 + 1.\n1. LCM of denominators 2 and 3 is 6. Multiply every term by 6:\n   6*(x/2) - 6*(3) = 6*(x/3) + 6*(1)  =>  3x - 18 = 2x + 6.\n2. Transpose 2x to LHS and -18 to RHS:\n   3x - 2x = 6 + 18  =>  x = 24.',
  },
  {
    id: 'rag-m7-ch4-1',
    board: 'CBSE',
    classLevel: 7,
    subject: 'Mathematics',
    chapter: 'Ch 4: Simple Equations (Class 7 Foundation)',
    pageNumber: 82,
    topicId: 'math-7-simple-eq',
    content:
      'NCERT Class 7 Mathematics, Ch 4 (p. 82): Transposing a number (i.e., changing its side in the equation) is the same as adding or subtracting that number from both sides. In doing so, the sign of the number has to be changed: + becomes - and - becomes +.',
    simpleSummary:
      'Whenever a number or variable crosses the "=" bridge, it pays a toll by flipping its operation: addition becomes subtraction, and subtraction becomes addition.',
    exampleText:
      'Worked Example: Solve 3n + 7 = 25.\n1. Transpose +7 from LHS to RHS (it becomes -7): 3n = 25 - 7 = 18.\n2. Divide both sides by 3: n = 18 / 3 = 6.',
  },
  {
    id: 'rag-m8-ch8-1',
    board: 'CBSE',
    classLevel: 8,
    subject: 'Mathematics',
    chapter: 'Ch 8: Algebraic Expressions and Identities',
    pageNumber: 95,
    topicId: 'math-8-algebraic-expr',
    content:
      'NCERT Class 8 Mathematics, Ch 8 (p. 95): While multiplying a polynomial by a monomial or binomial, we use the distributive law: a(b + c) = ab + ac. The three standard identities are: (I) (a + b)^2 = a^2 + 2ab + b^2, (II) (a - b)^2 = a^2 - 2ab + b^2, and (III) (a + b)(a - b) = a^2 - b^2.',
    simpleSummary:
      'When you square (a + b) or (a - b), never just square a and b! Because you are multiplying a bracket by itself, you always get a middle term (+2ab or -2ab).',
    exampleText:
      'Worked Example: Expand (4a - 5b)^2.\nHere x = 4a and y = 5b.\nUsing (x - y)^2 = x^2 - 2xy + y^2:\n= (4a)^2 - 2(4a)(5b) + (5b)^2\n= 16a^2 - 40ab + 25b^2.',
  },
  {
    id: 'rag-s8-ch8-1',
    board: 'CBSE',
    classLevel: 8,
    subject: 'Science',
    chapter: 'Ch 8: Force and Pressure',
    pageNumber: 102,
    topicId: 'sci-8-force-pressure',
    content:
      'NCERT Class 8 Science, Ch 8 (p. 102): The force acting on a unit area of a surface is called pressure: Pressure = Force / Area on which it acts. The smaller the area, the larger the pressure on a surface for the same force. Liquids and gases also exert pressure on the walls of their containers.',
    simpleSummary:
      'Pressure measures how concentrated a push is. Spreading the same force over a big area gives low pressure (like wide bag straps), while squeezing it onto a tiny point gives huge pressure (like the tip of a drawing pin).',
    exampleText:
      'Worked Example: A box weighing 200 N has a base area of 0.5 m^2.\nPressure = Force / Area = 200 N / 0.5 m^2 = 400 Pa.\nIf stood on its narrow side of area 0.1 m^2, Pressure = 200 N / 0.1 m^2 = 2000 Pa (5 times higher!).',
  },
  {
    id: 'rag-s8-ch11-1',
    board: 'CBSE',
    classLevel: 8,
    subject: 'Science',
    chapter: 'Ch 11: Chemical Effects of Electric Current',
    pageNumber: 138,
    topicId: 'sci-8-chemical-effects',
    content:
      'NCERT Class 8 Science, Ch 11 (p. 138): The passage of an electric current through a conducting solution causes chemical reactions. As a result, bubbles of a gas may be formed on the electrodes, deposits of metal may be seen on electrodes, or changes of colour of solutions may occur. The process of depositing a layer of any desired metal on another material by means of electricity is called electroplating.',
    simpleSummary:
      'When electricity flows through water containing dissolved salts or acids, free ions travel to the electrodes and trigger chemical changes—which is how we coat shiny chromium onto bicycle handlebars or gold onto jewelry!',
    exampleText:
      'Worked Example: In copper electroplating, copper sulphate dissociates into Cu^2+ and SO4^2-. The positive Cu^2+ ions move to the negative electrode (cathode) and form a pure copper coating.',
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-diagnostic',
    milestone: 'Diagnostic Pioneer',
    earnedAt: '2026-10-14',
    badgeType: 'starter',
    requiredDays: 1,
    description: 'Completed the combined multi-subject diagnostic quiz with reasoning checks.',
    unlocked: true,
  },
  {
    id: 'ach-foundation',
    milestone: 'Foundation Builder',
    earnedAt: null,
    badgeType: 'starter',
    requiredDays: 1,
    description: 'Completed an earlier-class (Class 6/7) prerequisite foundation bridge lesson.',
    unlocked: false,
  },
  {
    id: 'ach-bronze',
    milestone: 'Bronze Learner (10-Day Streak)',
    earnedAt: null,
    badgeType: 'bronze',
    requiredDays: 10,
    description: 'Completed your daily personalized study goal for 10 consecutive days.',
    unlocked: false,
  },
  {
    id: 'ach-silver',
    milestone: 'Silver Scholar (50-Day Streak)',
    earnedAt: null,
    badgeType: 'silver',
    requiredDays: 50,
    description: 'Completed your daily personalized study goal for 50 consecutive days.',
    unlocked: false,
  },
  {
    id: 'ach-gold',
    milestone: 'Gold Scholar (100-Day Streak)',
    earnedAt: null,
    badgeType: 'gold',
    requiredDays: 100,
    description: 'Completed your daily personalized study goal for 100 consecutive days.',
    unlocked: false,
  },
];
