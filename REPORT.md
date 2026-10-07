# Personal Expense Calculator – Report

## 1. Problem statement
Write a program that accepts income and expense details, categorizes expenses, calculates savings and displays a summary report.

## 2. Pseudocode (AI-generated from the problem statement)
```
START
  DEFINE categories = [Food, Transport, Rent, Education, Entertainment, Other]
  INPUT income (repeat until valid number >= 0)
  SET expenses = empty list
  LOOP
    INPUT name
    IF name = "done" THEN EXIT LOOP
    INPUT amount (repeat until valid number >= 0)
    INPUT category (repeat until valid choice)
    ADD (name, amount, category) to expenses
  END LOOP
  total_expense = SUM of all amounts
  savings = income - total_expense
  FOR each category: category_total = SUM of amounts in that category
  IF savings < 0 THEN message = "Overspending"
  ELSE IF savings >= 20% of income THEN message = "Great saving"
  ELSE IF savings >= 10% of income THEN message = "Good, save more"
  ELSE message = "Low savings"
  DISPLAY income, total_expense, savings, category totals with %, message
END
```

## 3. Flowchart
See `flowchart.png`.

## 4. Program
`expense_calculator.py` (Python). Run: `python expense_calculator.py`

| Concept | Where used |
|---|---|
| Variables | `income`, `total_expense`, `savings` |
| Loops | `while` for input and expense entry, `for` for totals and report |
| Conditions | input validation, savings message (`if/elif/else`) |
| Functions | `read_amount`, `choose_category`, `collect_expenses`, `total_by_category`, `savings_message`, `print_report`, `main` |
| Data structures | list of dictionaries, dictionary of category totals |

## 5. Sample output
```
Total income   : Rs 30,000.00
Total expenses : Rs 13,100.00
Savings        : Rs 16,900.00
  Rent            Rs   8,000.00  (61.1%)
  Food            Rs   3,000.00  (22.9%)
  Transport       Rs   1,200.00  (9.2%)
  Entertainment   Rs     900.00  (6.9%)
Highest spending: Rent
Great job! You are saving 20% or more.
```

## 6. Human vs AI comparison
Fill the "Human" column with your own first attempt (write your own pseudocode before reading the AI version).

| Aspect | Human (my solution) | AI-generated |
|---|---|---|
| Input validation | _write yours_ | Repeats until a valid non-negative number |
| Structure | _write yours_ | Small reusable functions |
| Categories | _write yours_ | Fixed menu list, totals by dictionary |
| Edge cases | _write yours_ | Handles zero income, no expenses, overspending |
| Time taken | _write yours_ | Seconds |

**Conclusion:** AI gives a complete, well-structured first draft quickly and covers edge cases, but the human must verify the logic, test it, and adapt it to real needs (for example, adding monthly saving goals).
