import os
from pymongo import MongoClient
from dotenv import load_dotenv

# A. Load Configuration
load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI")

# B. Connect to Atlas
client = MongoClient(MONGODB_URI)

# FIX: Specify the database name explicitly here
# If your database is named something else, change 'test' to that name
db = client['test'] 
collection = db['colleges']

# C. College Data
college_data = [
    {
        "name": "ACE College of Engineering",
        "district": "Thiruvananthapuram",
        "program": "UG",
        "degree": "BTech",
        "branch": "Computer Science and Engineering",
        "location": "Thiruvallam, Thiruvananthapuram, Kerala 695027",
        "avgPackage": "₹7.5 LPA",
        "suitability": 88.5,
        "statusBadges": ["KTU Affiliated", "Private"]
    },
    {
        "name": "College of Engineering Trivandrum",
        "district": "Thiruvananthapuram",
        "program": "UG",
        "degree": "BTech",
        "branch": "Computer Science and Engineering",
        "location": "Sreekaryam, Thiruvananthapuram, Kerala 695016",
        "avgPackage": "₹7.8 LPA",
        "suitability": 99.5,
        "statusBadges": ["Government", "Tier-1 Elite"]
    },
    {
        "name": "Government Engineering College, Barton Hill",
        "district": "Thiruvananthapuram",
        "program": "UG",
        "degree": "BTech",
        "branch": "Computer Science and Engineering",
        "location": "Barton Hill, Thiruvananthapuram, Kerala 695035",
        "avgPackage": "₹8.5 LPA",
        "suitability": 98.2,
        "statusBadges": ["KTU Affiliated", "Tier-1 Heavy"]
    },
    {
        "name": "John Cox Memorial CSI Institute of Technology",
        "district": "Thiruvananthapuram",
        "program": "UG",
        "degree": "BTech",
        "branch": "Computer Science and Engineering",
        "location": "Kannammoola, Thiruvananthapuram, Kerala 695011",
        "avgPackage": "₹4.5 LPA",
        "suitability": 78.5,
        "statusBadges": ["Private", "KTU Affiliated"]
    },
    {
        "name": "Mar Baselios College of Engineering and Technology",
        "district": "Thiruvananthapuram",
        "program": "UG",
        "degree": "BTech",
        "branch": "Computer Science and Engineering",
        "location": "Nalanchira, Thiruvananthapuram, Kerala 695015",
        "avgPackage": "₹5.5 LPA",
        "suitability": 94.0,
        "statusBadges": ["Autonomous", "NBA Tier-1"]
    },
    {
        "name": "Marian Engineering College",
        "district": "Thiruvananthapuram",
        "program": "UG",
        "degree": "BTech",
        "branch": "Computer Science and Engineering",
        "location": "Kazhakuttam, Thiruvananthapuram, Kerala 695582",
        "avgPackage": "₹3.6 LPA",
        "suitability": 92.5,
        "statusBadges": ["NBA Accredited", "Self-Financing"]
    },
    {
        "name": "MG College of Engineering",
        "district": "Thiruvananthapuram",
        "program": "UG",
        "degree": "BTech",
        "branch": "Computer Science and Engineering",
        "location": "Thiruvallam, Thiruvananthapuram, Kerala 695027",
        "avgPackage": "₹3.5 LPA",
        "suitability": 72.0,
        "statusBadges": ["Self-Financing", "KTU Affiliated"]
    },
    {
        "name": "Musaliar College of Engineering",
        "district": "Thiruvananthapuram",
        "program": "UG",
        "degree": "BTech",
        "branch": "Computer Science and Engineering",
        "location": "Chirayinkeezhu, Thiruvananthapuram, Kerala 695304",
        "avgPackage": "₹3.8 LPA",
        "suitability": 80.0,
        "statusBadges": ["Private", "AICTE Approved"]
    },
    {
        "name": "Muslim Association College of Engineering",
        "district": "Thiruvananthapuram",
        "program": "UG",
        "degree": "BTech",
        "branch": "Computer Science and Engineering",
        "location": "Venjaramoodu, Thiruvananthapuram, Kerala 695607",
        "avgPackage": "₹4.0 LPA",
        "suitability": 81.5,
        "statusBadges": ["Minority Institution", "Private"]
    },
    {
        "name": "P.A. Aziz College of Engineering and Technology",
        "district": "Thiruvananthapuram",
        "program": "UG",
        "degree": "BTech",
        "branch": "Computer Science and Engineering",
        "location": "Karakulam, Thiruvananthapuram, Kerala 695564",
        "avgPackage": "₹3.5 LPA",
        "suitability": 75.0,
        "statusBadges": ["Private", "KTU Affiliated"]
    },
    {
        "name": "PRS College of Engineering and Technology",
        "district": "Thiruvananthapuram",
        "program": "UG",
        "degree": "BTech",
        "branch": "Computer Science and Engineering",
        "location": "Neyyattinkara, Thiruvananthapuram, Kerala 695125",
        "avgPackage": "₹3.2 LPA",
        "suitability": 79.0,
        "statusBadges": ["Private", "AICTE Approved"]
    },
    {
        "name": "Rajadhani Institute of Engineering and Technology",
        "district": "Thiruvananthapuram",
        "program": "UG",
        "degree": "BTech",
        "branch": "Computer Science and Engineering",
        "location": "Nagaroor, Thiruvananthapuram, Kerala 695601",
        "avgPackage": "₹3.0 LPA",
        "suitability": 84.0,
        "statusBadges": ["Self-Financing", "Wi-Fi Campus"]
    },
    {
        "name": "Sree Chitra Thirunal College of Engineering",
        "district": "Thiruvananthapuram",
        "program": "UG",
        "degree": "BTech",
        "branch": "Computer Science and Engineering",
        "location": "Pappanamcode, Thiruvananthapuram, Kerala 695018",
        "avgPackage": "₹6.0 LPA",
        "suitability": 95.8,
        "statusBadges": ["Government", "KSRTC Aided"]
    },
    {
        "name": "Trinity College of Engineering",
        "district": "Thiruvananthapuram",
        "program": "UG",
        "degree": "BTech",
        "branch": "Computer Science and Engineering",
        "location": "Naruvamoodu, Thiruvananthapuram, Kerala 695528",
        "avgPackage": "₹4.5 LPA",
        "suitability": 81.2,
        "statusBadges": ["Startup Pioneer", "Private"]
    },
    {
        "name": "Valia Koonambaikulathamma College of Engineering and Technology",
        "district": "Thiruvananthapuram",
        "program": "UG",
        "degree": "BTech",
        "branch": "Computer Science and Engineering",
        "location": "Parippally, Thiruvananthapuram, Kerala 691574",
        "avgPackage": "₹3.8 LPA",
        "suitability": 83.5,
        "statusBadges": ["Private", "Unaided"]
    }
]

# D. Upload Execution
try:
    # Clear old data to prevent duplicates
    collection.delete_many({"district": "Thiruvananthapuram"})
    result = collection.insert_many(college_data)
    print(f"Successfully uploaded {len(result.inserted_ids)} colleges to Atlas!")
except Exception as e:
    print(f"Error: {e}")
finally:
    client.close()
