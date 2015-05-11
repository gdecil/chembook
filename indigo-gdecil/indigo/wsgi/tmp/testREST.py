import requests, json

github_url = "http://toxgate.nlm.nih.gov/cgi-bin/sis/search2"
# data = json.dumps({"queryxxx": "benzene", "chemsyn": "1", "database": "hsdb", "Stemming": "1","and":"1", "second_search": "1", "gateway": "1"}) 
#data = '{"queryxxx": "benzene", "chemsyn": "1", "database": "hsdb", "Stemming": "1","and":"1", "second_search": "1", "gateway": "1"}'
data = 'queryxxx=benzene&chemsyn=1&database=hsdb&Stemming=1&and=1&second_search=1&gateway=1'
r = requests.post(github_url, data, headers={'Content-Type': 'application/x-www-form-urlencoded'})
print r.text

# r = requests.get('https://api.github.com/user', auth=('gdecil', 'ugolapa123ale'))
print r.json
