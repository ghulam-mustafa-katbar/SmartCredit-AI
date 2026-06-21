import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import shap
import pickle
import os

def train_model():
    data_path = 'synthetic_credit_data.csv'
    if not os.path.exists(data_path):
        print("Data not found. Run data_generator.py first.")
        return

    df = pd.read_csv(data_path)
    
    # Features and Target
    X = df[['monthly_income', 'monthly_expenses', 'savings_balance', 'missed_utility_bills', 'transaction_frequency']]
    y = df['credit_score']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train XGBoost Model
    print("Training XGBoost Model...")
    model = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=100, learning_rate=0.1)
    model.fit(X_train, y_train)
    
    # Evaluate
    preds = model.predict(X_test)
    mse = mean_squared_error(y_test, preds)
    r2 = r2_score(y_test, preds)
    print(f"Model MSE: {mse:.2f}")
    print(f"Model R2 Score: {r2:.2f}")
    
    # Fit SHAP Explainer
    print("Fitting SHAP explainer for Explainable AI...")
    explainer = shap.TreeExplainer(model)
    
    # Save Model and Explainer
    os.makedirs('saved_models', exist_ok=True)
    with open('saved_models/xgboost_credit_model.pkl', 'wb') as f:
        pickle.dump(model, f)
        
    with open('saved_models/shap_explainer.pkl', 'wb') as f:
        pickle.dump(explainer, f)
        
    print("Models saved successfully in 'saved_models/' directory.")

if __name__ == "__main__":
    train_model()
