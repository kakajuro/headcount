import requests
import re
from bs4 import BeautifulSoup

def getFirefoxUsers(url:str) -> int:

  print("Fetching Firefox extension page")

  res = requests.get(url)
  soup = BeautifulSoup(res.content, "html.parser")

  print("Page fetched")

  content = soup.find_all("span", class_="Badge-content")

  if content:

    for span in content:
      # Match the end of the span tag for the user count
      # a space, then a letter e.g.
      match = re.search(">[0-9]+ [a-zA-Z]", str(span))

      if match:
        print("Found Firefox user count")
        users = str(match.group(0)).split(" ")[0].split(">")[1]
        return int(users)

    raise Exception("User count not found on Firefox page")

  else:
    raise Exception("User count not found on Firefox page")


def getChromeUsers(url:str) -> int:

  print("Fetching Chrome extension page")

  res = requests.get(url)
  soup = BeautifulSoup(res.content, "html.parser")

  print("Page fetched")

  contentDiv = soup.find("a", {"href": "./category/extensions"}).parent
  text = contentDiv.text

  match = re.search("[0-9]+", str(text))

  if match:
    print("Found Chrome user count")
    return int(match.group(0))
  else:
    raise Exception("User count not found on Chrome page")

def getEdgeUsers(url:str) -> int:

  print("Fetching Edge extension page")

  res = requests.get(url)
  soup = BeautifulSoup(res.content, "html.parser")

  print("Page fetched")

  try:
    users = soup.find("meta", {"itemprop": "userInteractionCount"}).get("content")
    print("Found Edge user count")
    return int(users)
  except Exception as e:
    raise Exception(f"Error finding user count: {e}")

