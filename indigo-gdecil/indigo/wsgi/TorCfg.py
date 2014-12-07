import psycopg2
global con 
con = psycopg2.connect(host='localhost', database='postgres', user='postgres', password='postgres', port=5432)
