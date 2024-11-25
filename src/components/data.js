const terms = [
    // Categoría A
    { category: "A", term: "Account Balance", description: "The total amount of money in a bank account, including credits and debits." },
    { category: "A", term: "ATM (Automated Teller Machine)", description: "A machine used to withdraw cash, check balances, or perform other banking transactions." },
    { category: "A", term: "Asset", description: "Anything owned that has value, like property, savings, or investments." },
    { category: "A", term: "Annual Percentage Rate (APR)", description: "The yearly cost of borrowing money, expressed as a percentage." },
    { category: "A", term: "Authentication", description: "Security measures, like PINs or biometrics, to verify a user’s identity." },
  
    // Categoría B
    { category: "B", term: "Bank Statement", description: "A detailed summary of all transactions in a bank account over a specific period." },
    { category: "B", term: "Beneficiary", description: "A person or entity designated to receive funds or benefits, such as from a savings account or insurance policy." },
    { category: "B", term: "Budgeting", description: "The process of creating a plan to manage income and expenses." },
    { category: "B", term: "Branch Number", description: "A unique identifier for a bank’s branch in Canada." },
    { category: "B", term: "Balance Inquiry", description: "A service to check the current balance of a bank account, often via ATMs." },
  
    // Categoría C
    { category: "C", term: "Credit Score", description: "A numerical representation of a person’s creditworthiness." },
    { category: "C", term: "Chequing Account", description: "A type of bank account for day-to-day financial transactions." },
    { category: "C", term: "Compound Interest", description: "Interest calculated on both the initial principal and accumulated interest." },
    { category: "C", term: "Currency Exchange", description: "The conversion of one country's currency to another's." },
    { category: "C", term: "Canadian Deposit Insurance Corporation (CDIC)", description: "Protects eligible bank deposits in Canada up to a certain limit." },
  
    // Categoría D
    { category: "D", term: "Debit Card", description: "A card linked to a bank account, used for transactions or withdrawals." },
    { category: "D", term: "Direct Deposit", description: "A method of transferring funds electronically into a bank account." },
    { category: "D", term: "Debt", description: "Money owed by an individual or entity to another party." },
    { category: "D", term: "Discretionary Spending", description: "Non-essential expenses like entertainment or dining out." },
    { category: "D", term: "Diversification", description: "The strategy of spreading investments to reduce risk." },
  
    // Categoría E
    { category: "E", term: "E-Transfer (Interac)", description: "An electronic transfer of funds between Canadian bank accounts." },
    { category: "E", term: "Emergency Fund", description: "Savings set aside for unexpected expenses." },
    { category: "E", term: "Exchange Rate", description: "The value of one currency compared to another." },
    { category: "E", term: "Equity", description: "The value of ownership in an asset, minus liabilities." },
    { category: "E", term: "Expense Ratio", description: "The cost of managing investments as a percentage of assets." },
  
    // Categoría F
    { category: "F", term: "Fixed Deposit", description: "A savings account with a fixed term and higher interest rate." },
    { category: "F", term: "Financial Institution", description: "Organizations like banks or credit unions providing financial services." },
    { category: "F", term: "Fraud Alert", description: "A warning added to a credit file to prevent identity theft." },
    { category: "F", term: "Fiscal Year", description: "A 12-month period used for accounting and financial reporting." },
    { category: "F", term: "Fee Schedule", description: "A list of charges for services provided by a financial institution." },
  
    // Categoría G
    { category: "G", term: "GIC (Guaranteed Investment Certificate)", description: "A Canadian investment that offers a fixed return." },
    { category: "G", term: "Gross Income", description: "Total earnings before deductions like taxes." },
    { category: "G", term: "Grace Period", description: "A timeframe to pay a debt without incurring penalties." },
    { category: "G", term: "Grant", description: "Non-repayable financial aid, often for education or business." },
    { category: "G", term: "Government Bonds", description: "Debt securities issued by a government to raise funds." },
  
    // Categoría H
    { category: "H", term: "Holding Period", description: "The time an investment is held before selling." },
    { category: "H", term: "HST (Harmonized Sales Tax)", description: "A combined tax in certain Canadian provinces." },
    { category: "H", term: "Home Equity", description: "The portion of a home’s value owned outright." },
    { category: "H", term: "Hard Inquiry", description: "A credit check that affects a credit score." },
    { category: "H", term: "High-Interest Savings Account", description: "A savings account with a higher interest rate." },

    // Categoría I
    { category: "I", term: "Interest Rate", description: "The cost of borrowing or earning money, expressed as a percentage." },
    { category: "I", term: "Investment Portfolio", description: "A collection of investments owned by an individual." },
    { category: "I", term: "Inflation", description: "The rate at which prices for goods and services rise over time." },
    { category: "I", term: "Income Tax", description: "A tax on earnings paid to federal or provincial governments." },
    { category: "I", term: "Insufficient Funds", description: "When an account lacks enough money for a transaction." },

    // Categoría J
    { category: "J", term: "Joint Account", description: "A bank account shared by two or more individuals." },
    { category: "J", term: "Jumbo Loan", description: "A loan exceeding standard borrowing limits." },
    { category: "J", term: "Judgment Debt", description: "A court-ordered payment obligation." },
    { category: "J", term: "Just-In-Time (JIT)", description: "A budgeting method focused on minimizing excess funds." },
    { category: "J", term: "Junior Savings Account", description: "Accounts designed for minors to learn financial habits." },

    // Categoría K
    { category: "K", term: "Know Your Customer (KYC)", description: "A process to verify the identity of customers." },
    { category: "K", term: "Key Performance Indicator (KPI)", description: "Metrics to assess financial performance." },
    { category: "K", term: "Kiting", description: "A fraudulent practice involving the misrepresentation of checks." },
    { category: "K", term: "Knowledge Economy", description: "An economy based on intellectual capital." },
    { category: "K", term: "Keeper Rate", description: "A favorable interest rate offered by banks to loyal customers." },

    // Categoría L
    { category: "L", term: "Line of Credit", description: "A flexible loan with a borrowing limit." },
    { category: "L", term: "Liquidity", description: "The ease of converting assets into cash." },
    { category: "L", term: "Loan-to-Value Ratio (LTV)", description: "The percentage of a loan compared to an asset’s value." },
    { category: "L", term: "Liability", description: "Debts or financial obligations." },
    { category: "L", term: "Late Fee", description: "A penalty for missed payments." },

    // Categoría M
    { category: "M", term: "Minimum Balance", description: "The lowest amount required in an account to avoid fees." },
    { category: "M", term: "Mutual Fund", description: "A pooled investment managed by professionals." },
    { category: "M", term: "Mortgage", description: "A loan for purchasing property." },
    { category: "M", term: "Mobile Banking", description: "Banking services accessed via smartphones." },
    { category: "M", term: "Market Capitalization", description: "The total market value of a company’s shares." },

    // Categoría N
    { category: "N", term: "Net Worth", description: "The difference between assets and liabilities." },
    { category: "N", term: "Non-Sufficient Funds (NSF)", description: "A term indicating a bounced check." },
    { category: "N", term: "Nominee Account", description: "An account held in another person’s name for convenience." },
    { category: "N", term: "No-Fee Banking", description: "Accounts without monthly maintenance charges." },
    { category: "N", term: "Negotiable Instrument", description: "A document guaranteeing payment, like a check." },

    // Categoría O
    { category: "O", term: "Overdraft", description: "A facility allowing account holders to withdraw more than their balance." },
    { category: "O", term: "Online Banking", description: "Internet-based financial transactions." },
    { category: "O", term: "Outstanding Balance", description: "The unpaid amount on a loan or credit card." },
    { category: "O", term: "Overpayment", description: "Paying more than the required amount for a debt." },
    { category: "O", term: "Open-End Credit", description: "A revolving credit line, like a credit card." },

    // Categoría P
    { category: "P", term: "PIN (Personal Identification Number)", description: "A secure code used for ATM and account access." },
    { category: "P", term: "Principal", description: "The original amount of a loan or investment." },
    { category: "P", term: "Prepaid Card", description: "A card loaded with funds for specific spending." },
    { category: "P", term: "Portfolio Diversification", description: "Spreading investments across different assets." },
    { category: "P", term: "Payday Loan", description: "A short-term, high-interest loan." },

    // Categoría Q
    { category: "Q", term: "Quarterly Statement", description: "A summary of account activity issued every three months." },
    { category: "Q", term: "Qualifying Income", description: "Earnings that meet the criteria for loans." },
    { category: "Q", term: "Quarters", description: "Financial periods, dividing a year into four." },
    { category: "Q", term: "Quota", description: "A target or limit for savings or investments." },
    { category: "Q", term: "Quick Ratio", description: "A measure of financial health using liquid assets." },

    // Categoría R
    { category: "R", term: "RRSP (Registered Retirement Savings Plan)", description: "A Canadian retirement savings account." },
    { category: "R", term: "Recurring Payment", description: "Automatic payments set for regular intervals." },
    { category: "R", term: "Reconciliation", description: "Matching financial records with bank statements." },
    { category: "R", term: "Risk Assessment", description: "Evaluating the potential for loss in investments." },
    { category: "R", term: "Rollover", description: "Extending the terms of a financial agreement." },

    // Categoría S
    { category: "S", term: "Savings Account", description: "A deposit account earning interest." },
    { category: "S", term: "Service Charge", description: "Fees for banking services." },
    { category: "S", term: "Stock", description: "Shares representing ownership in a company." },
    { category: "S", term: "Secured Loan", description: "A loan backed by collateral." },
    { category: "S", term: "Student Loan", description: "A loan specifically for education expenses." },

    // Categoría T
    { category: "T", term: "Transaction Fee", description: "A charge for a banking transaction." },
    { category: "T", term: "Tax-Free Savings Account (TFSA)", description: "A Canadian account with tax-free growth." },
    { category: "T", term: "Term Deposit", description: "Money held in an account for a fixed period." },
    { category: "T", term: "Transfer", description: "Moving funds between accounts." },
    { category: "T", term: "Third-Party Payments", description: "Transactions involving an intermediary." },

    // Categoría U
    { category: "U", term: "Unsecured Loan", description: "A loan without collateral." },
    { category: "U", term: "Universal Basic Income (UBI)", description: "A proposed guaranteed income for citizens." },
    { category: "U", term: "Underwriting", description: "Assessing the risk of lending or insuring." },
    { category: "U", term: "Upfront Fee", description: "An initial cost paid before receiving services." },
    { category: "U", term: "Utility Bill Payments", description: "Payments for essential services like electricity or water." },

    // Categoría V
    { category: "V", term: "Variable Interest Rate", description: "An interest rate that fluctuates." },
    { category: "V", term: "Virtual Banking", description: "Online-only banking services." },
    { category: "V", term: "Value-Added Tax (VAT)", description: "A tax on goods and services." },
    { category: "V", term: "Volatility", description: "The degree of variation in investment prices." },
    { category: "V", term: "Vesting Period", description: "The time required to gain full ownership of benefits." },

    // Categoría W
    { category: "W", term: "Withdrawal Limit", description: "The maximum amount that can be withdrawn in a day." },
    { category: "W", term: "Wire Transfer", description: "A method of sending money electronically." },
    { category: "W", term: "Wealth Management", description: "Financial planning services for high net-worth individuals." },
    { category: "W", term: "Withholding Tax", description: "Tax deducted at the source of income." },
    { category: "W", term: "Write-Off", description: "A deduction for uncollectible debt or losses." },

    // Categoría X
    { category: "X", term: "XIRR", description: "Extended Internal Rate of Return, used in financial modeling." },

    // Categoría Y
    { category: "Y", term: "Yield", description: "The earnings generated on an investment." },
    { category: "Y", term: "Year-To-Date (YTD)", description: "Financial data from the start of the year to now." },
    { category: "Y", term: "Yellow Pages Banking", description: "Outdated or manual banking services." },
    { category: "Y", term: "Young Investors Account", description: "Accounts aimed at encouraging financial habits in youth." },
    { category: "Y", term: "Yield Spread", description: "The difference in yields between two securities." },

    // Categoría Z
    { category: "Z", term: "Zero Balance Account (ZBA)", description: "Accounts maintained at zero, funded as needed." },
    { category: "Z", term: "Zero Liability Policy", description: "Protection from fraudulent charges." },
    { category: "Z", term: "Zero-Based Budgeting", description: "A budgeting method where every dollar is allocated." },
    { category: "Z", term: "Zero-Coupon Bond", description: "A bond sold at a discount and repaid at face value." },
    { category: "Z", term: "Zone-Based Banking", description: "Banking based on regional or time-specific needs." }

  ];
  
  export default terms;
  