import requests, json
from bs4 import BeautifulSoup

def fetch_hopasports():
    url = "https://www.hopasports.com/en/search?category=running&country=ae"
    html = requests.get(url).text
    soup = BeautifulSoup(html, "html.parser")
    races = []
    for card in soup.select(".event-list .event"):
        name = card.select_one(".event-title").get_text(strip=True)
        date = card.select_one(".event-date").get_text(strip=True)
        link = "https://www.hopasports.com" + card.select_one("a")["href"]
        races.append({"name": name, "date": date, "location": "UAE", "registration": link, "source": "Hopasports"})
    return races

def fetch_premieronline():
    url = "https://www.premieronline.com/events"
    html = requests.get(url).text
    soup = BeautifulSoup(html, "html.parser")
    races = []
    for card in soup.select(".event-card"):
        name = card.select_one(".title").get_text(strip=True)
        date = card.select_one(".date").get_text(strip=True)
        link = "https://www.premieronline.com" + card.select_one("a")["href"]
        races.append({"name": name, "date": date, "location": "UAE", "registration": link, "source": "PremierOnline"})
    return races

def fetch_supersports():
    url = "https://www.supersportsuae.com/events"
    html = requests.get(url).text
    soup = BeautifulSoup(html, "html.parser")
    races = []
    for card in soup.select(".event"):
        name = card.get_text(strip=True)
        link = card["href"] if card.has_attr("href") else url
        races.append({"name": name, "date": "TBD", "location": "UAE", "registration": link, "source": "SuperSports"})
    return races

def fetch_endurance():
    url = "https://www.endurancesportsservices.com/upcoming-events"
    html = requests.get(url).text
    soup = BeautifulSoup(html, "html.parser")
    races = []
    for card in soup.select(".event-box"):
        name = card.select_one(".event-title").get_text(strip=True)
        date = card.select_one(".event-date").get_text(strip=True)
        link = card.select_one("a")["href"]
        if not link.startswith("http"):
            link = "https://www.endurancesportsservices.com" + link
        races.append({"name": name, "date": date, "location": "UAE", "registration": link, "source": "Endurance Sports Services"})
    return races

def fetch_spinneys():
    url = "https://www.hopasports.com/en/search?term=spinneys"
    html = requests.get(url).text
    soup = BeautifulSoup(html, "html.parser")
    races = []
    for card in soup.select(".event-list .event"):
        name = card.select_one(".event-title").get_text(strip=True)
        date = card.select_one(".event-date").get_text(strip=True)
        link = "https://www.hopasports.com" + card.select_one("a")["href"]
        races.append({"name": name, "date": date, "location": "Dubai", "registration": link, "source": "Spinneys Community Run"})
    return races

def main():
    all_races = []
    all_races.extend(fetch_hopasports())
    all_races.extend(fetch_premieronline())
    all_races.extend(fetch_supersports())
    all_races.extend(fetch_endurance())
    all_races.extend(fetch_spinneys())

    with open("races.json", "w") as f:
        json.dump(all_races, f, indent=2)

if __name__ == "__main__":
    main()


