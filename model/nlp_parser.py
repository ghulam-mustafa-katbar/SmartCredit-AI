import re

class SMSParser:
    def __init__(self):
        # English, Urdu, Roman Urdu patterns
        self.patterns = {
            'credit': [
                r'(?i)credited with (?:rs\.?|pkr)\s*([\d,]+)',
                r'(?i)account .* credited by (?:rs\.?|pkr)\s*([\d,]+)',
                r'(?i)deposit of (?:rs\.?|pkr)\s*([\d,]+)',
                r'(?i)aapke account me (?:rs\.?|pkr)\s*([\d,]+) jama hue', # Roman Urdu
                r'جمع کرائے گئے.*Rs\.?\s*([\d,]+)' # Urdu snippet
            ],
            'debit': [
                r'(?i)debited with (?:rs\.?|pkr)\s*([\d,]+)',
                r'(?i)spent (?:rs\.?|pkr)\s*([\d,]+)',
                r'(?i)withdrawal of (?:rs\.?|pkr)\s*([\d,]+)',
                r'(?i)aapke account se (?:rs\.?|pkr)\s*([\d,]+) nikle', # Roman Urdu
                r'نکلوائے گئے.*Rs\.?\s*([\d,]+)' # Urdu snippet
            ],
            'bill': [
                r'(?i)bill payment of (?:rs\.?|pkr)\s*([\d,]+)',
                r'(?i)paid utility (?:rs\.?|pkr)\s*([\d,]+)'
            ]
        }

    def parse_sms(self, sms_text):
        """
        Parses an SMS text and returns transaction details if matched.
        Returns a dict: {'type': 'credit'|'debit'|'bill', 'amount': float}
        """
        for category, regex_list in self.patterns.items():
            for pattern in regex_list:
                match = re.search(pattern, sms_text)
                if match:
                    amount_str = match.group(1).replace(',', '')
                    return {
                        'type': category,
                        'amount': float(amount_str)
                    }
        return None

# Example usage:
if __name__ == "__main__":
    parser = SMSParser()
    test_messages = [
        "Your account was credited with Rs. 50,000 for Salary.",
        "Aapke account me PKR 15,000 jama hue hain.",
        "Bill payment of Rs. 3,500 successful."
    ]
    for msg in test_messages:
        print(f"Message: {msg}")
        print(f"Parsed: {parser.parse_sms(msg)}\n")
