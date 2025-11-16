// constants/questionnaire.ts

export interface QuestionOption {
    label: string
    value: string
}

export interface Question {
    key: string
    title: string
    options: QuestionOption[]
    answer: string | string[] | null
    multiple?: boolean
    correctAnswer?: string
}

export const onboardingQuestions: Question[] = [
    // ---------------- 2.1 LANGUAGE ----------------
    {
        key: 'language',
        title: 'In which language do you prefer to receive answers?',
        options: [
            { label: 'Italiano', value: 'it' },
            { label: 'English', value: 'en' },
        ],
        answer: null,
    },

    // ---------------- 2.1 CONTEXT ----------------
    {
        key: 'context',
        title: 'Which situation describes you best?',
        options: [
            { label: 'Student', value: 'student' },
            { label: 'Employee', value: 'employee' },
            { label: 'Freelancer / Entrepreneur', value: 'freelancer' },
            { label: 'Looking for a job', value: 'jobseeker' },
            { label: 'Other', value: 'other' },
        ],
        answer: null,
    },

    // ---------------- 2.2 SELF-EVALUATION ----------------
    {
        key: 'selfEval',
        title: 'How would you rate your personal finance knowledge?',
        options: [
            { label: 'Very low', value: 'very_low' },
            { label: 'Low', value: 'low' },
            { label: 'Average', value: 'average' },
            { label: 'Good', value: 'good' },
            { label: 'Very good', value: 'very_good' },
        ],
        answer: null,
    },

    {
        key: 'reading',
        title: 'How often do you consume finance content (articles, videos, books)?',
        options: [
            { label: 'Almost never', value: 'never' },
            { label: 'Sometimes', value: 'sometimes' },
            { label: 'Often', value: 'often' },
        ],
        answer: null,
    },

    // ---------------- 2.2 MINI-QUIZ ----------------
    {
        key: 'quiz1',
        title:
            'If you take a fixed-rate loan, what happens to the monthly payment if market interest rates rise?',
        options: [
            { label: 'It increases', value: 'increase' },
            { label: 'It decreases', value: 'decrease' },
            { label: 'It stays the same', value: 'same' },
            { label: "I don't know", value: 'unknown' },
        ],
        answer: null,
        correctAnswer: 'same',
    },

    {
        key: 'quiz2',
        title: 'An ETF is:',
        options: [
            { label: 'A bank deposit account', value: 'deposit_account' },
            {
                label: 'A fund traded on an exchange that tracks an index',
                value: 'etf_fund',
            },
            { label: 'A type of credit card', value: 'credit_card' },
            { label: "I don't know", value: 'unknown' },
        ],
        answer: null,
        correctAnswer: 'etf_fund',
    },

    {
        key: 'quiz3',
        title:
            'If you invest €1,000 at a 5% annual return, with interest reinvested each year, after 10 years you would have approximately:',
        options: [
            { label: '€1,500', value: '1500' },
            { label: '€1,630', value: '1630' },
            { label: '€2,000', value: '2000' },
            { label: "I don't know", value: 'unknown' },
        ],
        answer: null,
        correctAnswer: '1630',
    },

    // ---------------- 2.3 GOALS, TIME, MONEY, RISK ----------------
    {
        key: 'goal',
        title: 'What is your main financial goal right now?',
        options: [
            { label: 'Understand basic financial concepts', value: 'basics' },
            { label: 'Improve budgeting and save more', value: 'budgeting' },
            { label: 'Start investing', value: 'investing' },
            { label: 'Plan a specific goal (trip, house, etc.)', value: 'specific' },
            { label: 'Other', value: 'other' },
        ],
        answer: [],
        multiple: true,  
    },

    {
        key: 'horizon',
        title: 'What is the time horizon for your main goal?',
        options: [
            { label: 'Less than 12 months', value: 'lt_12m' },
            { label: 'Between 1 and 5 years', value: '1_5y' },
            { label: 'More than 5 years', value: 'gt_5y' },
        ],
        answer: null,
    },

    {
        key: 'income',
        title: 'Which range best describes your monthly net income?',
        options: [
            { label: '< €1,000', value: 'lt_1000' },
            { label: '€1,000–2,000', value: '1000_2000' },
            { label: '€2,000–3,000', value: '2000_3000' },
            { label: '> €3,000', value: 'gt_3000' },
            { label: 'Prefer not to say', value: 'no_answer' },
        ],
        answer: null,
    },

    {
        key: 'saving',
        title:
            'How much do you usually save monthly (as % of your net income)?',
        options: [
            { label: '0–5%', value: '0_5' },
            { label: '5–15%', value: '5_15' },
            { label: '15–30%', value: '15_30' },
            { label: '>30%', value: 'gt_30' },
        ],
        answer: null,
    },

    {
        key: 'risk',
        title:
            'How comfortable are you with investment risk (value fluctuations)?',
        options: [
            {
                label: 'I want to avoid any loss',
                value: 'avoid_loss',
            },
            {
                label: 'I accept small fluctuations',
                value: 'small_risk',
            },
            {
                label: 'I accept large fluctuations for higher returns',
                value: 'high_risk',
            },
            {
                label: "I am not sure",
                value: 'not_sure',
            },
        ],
        answer: null,
    },
]
