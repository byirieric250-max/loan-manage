import os

file_path = '../Backend/loan/views.py'
with open(file_path, 'r') as f:
    content = f.read()

# Replace aggregate calls
content = content.replace(
    "total=Coalesce(Sum('amount'), Decimal('0.00'))",
    "total=Sum('amount')"
)

# Fix the usage of the aggregated values
content = content.replace(
    "total_payments = Payment.objects.aggregate(\n            total=Sum('amount')\n        )['total']",
    "total_payments_data = Payment.objects.aggregate(total=Sum('amount'))\n        total_payments = total_payments_data['total'] or 0"
)

content = content.replace(
    "total_loan_amount = Loan.objects.aggregate(\n            total=Sum('amount')\n        )['total']",
    "total_loan_amount_data = Loan.objects.aggregate(total=Sum('amount'))\n        total_loan_amount = total_loan_amount_data['total'] or 0"
)

with open(file_path, 'w') as f:
    f.write(content)
