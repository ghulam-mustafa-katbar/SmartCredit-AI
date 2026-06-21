import pandas as pd
import numpy as np

def generate_synthetic_data(num_samples=1000):
    np.random.seed(42)
    
    # Features
    monthly_income = np.random.normal(50000, 20000, num_samples) # in PKR or local currency
    monthly_expenses = monthly_income * np.random.uniform(0.3, 0.9, num_samples)
    savings_balance = np.random.normal(100000, 50000, num_samples)
    
    # Financial behavior flags
    missed_utility_bills = np.random.poisson(1.5, num_samples)
    transaction_frequency = np.random.poisson(30, num_samples)
    
    # Target variables (derived for synthetic data)
    # Higher income to expense ratio is good, high savings is good, missed bills are bad
    base_score = 600
    income_score = (monthly_income - monthly_expenses) / 1000 * 2
    savings_score = savings_balance / 5000
    penalty = missed_utility_bills * 30
    
    credit_score = base_score + income_score + savings_score - penalty
    credit_score = np.clip(credit_score, 300, 850)
    
    risk_level = ['High' if score < 580 else 'Medium' if score < 670 else 'Low' for score in credit_score]
    
    df = pd.DataFrame({
        'monthly_income': monthly_income,
        'monthly_expenses': monthly_expenses,
        'savings_balance': savings_balance,
        'missed_utility_bills': missed_utility_bills,
        'transaction_frequency': transaction_frequency,
        'credit_score': credit_score,
        'risk_level': risk_level
    })
    
    df.to_csv('synthetic_credit_data.csv', index=False)
    print(f"Generated {num_samples} records of synthetic data.")

if __name__ == "__main__":
    generate_synthetic_data()
