"""Personal Expense Calculator
Accepts income and expenses, categorizes them, calculates savings
and prints a summary report."""

CATEGORIES = ["Food", "Transport", "Rent", "Education", "Entertainment", "Other"]


def read_amount(prompt):
    """Keep asking until the user enters a valid non-negative number."""
    while True:
        try:
            value = float(input(prompt))
            if value < 0:
                print("  Amount cannot be negative.")
            else:
                return value
        except ValueError:
            print("  Please enter a number.")


def choose_category():
    """Show the category menu and return the chosen category."""
    for i, name in enumerate(CATEGORIES, start=1):
        print(f"  {i}. {name}")
    while True:
        choice = input("Choose category number: ").strip()
        if choice.isdigit() and 1 <= int(choice) <= len(CATEGORIES):
            return CATEGORIES[int(choice) - 1]
        print("  Invalid choice, try again.")


def collect_expenses():
    """Loop to add expenses until the user types 'done'."""
    expenses = []
    while True:
        name = input("\nExpense name (or 'done' to finish): ").strip()
        if name.lower() == "done":
            break
        if not name:
            print("  Name cannot be empty.")
            continue
        amount = read_amount("Amount (Rs): ")
        category = choose_category()
        expenses.append({"name": name, "amount": amount, "category": category})
    return expenses


def total_by_category(expenses):
    """Return a dictionary of category -> total spent."""
    totals = {}
    for e in expenses:
        totals[e["category"]] = totals.get(e["category"], 0) + e["amount"]
    return totals


def savings_message(income, savings):
    """Give feedback based on the savings percentage."""
    if income == 0:
        return "No income entered."
    rate = savings / income * 100
    if savings < 0:
        return "Warning: you are overspending!"
    elif rate >= 20:
        return "Great job! You are saving 20% or more."
    elif rate >= 10:
        return "Good, but try to save a little more."
    return "Low savings. Review your expenses."


def print_report(income, expenses):
    total_expense = sum(e["amount"] for e in expenses)
    savings = income - total_expense
    totals = total_by_category(expenses)

    print("\n" + "=" * 40)
    print("        EXPENSE SUMMARY REPORT")
    print("=" * 40)
    print(f"Total income   : Rs {income:,.2f}")
    print(f"Total expenses : Rs {total_expense:,.2f}")
    print(f"Savings        : Rs {savings:,.2f}")
    print("-" * 40)
    print("Expenses by category:")
    for category, amount in sorted(totals.items(), key=lambda x: x[1], reverse=True):
        percent = amount / total_expense * 100 if total_expense else 0
        print(f"  {category:<15} Rs {amount:>10,.2f}  ({percent:.1f}%)")
    if totals:
        top = max(totals, key=totals.get)
        print(f"\nHighest spending: {top}")
    print(savings_message(income, savings))
    print("=" * 40)


def main():
    print("Personal Expense Calculator")
    income = read_amount("Enter your monthly income (Rs): ")
    expenses = collect_expenses()
    print_report(income, expenses)


if __name__ == "__main__":
    main()
