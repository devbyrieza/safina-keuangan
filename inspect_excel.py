import pandas as pd
import json

file1 = "c:/Users/itpua/Dev/Work/al-andalus/safina-keuangan/Data Santri Al Imam.xlsx"
file2 = "c:/Users/itpua/Dev/Work/al-andalus/safina-keuangan/Data_NIS_Santri_Baru_2026_Terpisah.xlsx"

print("--- Data Santri Al Imam ---")
df1 = pd.read_excel(file1)
print("Columns:", df1.columns.tolist())
print(df1.head(2).to_json(orient="records", force_ascii=False))

print("\n--- Data_NIS_Santri_Baru_2026_Terpisah ---")
df2 = pd.read_excel(file2)
print("Columns:", df2.columns.tolist())
print(df2.head(2).to_json(orient="records", force_ascii=False))
