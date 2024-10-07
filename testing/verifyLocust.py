from locust import HttpUser, task, between
import random

class MyUser(HttpUser):
    wait_time = between(6, 10)
    host="https://chennaievents.vit.ac.in"

    @task
    def test_post_request(self):
        if random.randint(1,10)==4:
            serialID="61:F8:E7:FE"
        else:
            serialID=':'.join([random.choice("0123456789ABCDEF") + random.choice("0123456789ABCDEF") for _ in range(6)])
        # endpoint = "/vitchennai_vibrance/registerEvent"
        # endpoint='vitchennai_vibrance/proshow'
        # endpoint='/vitchennai_vibrance'
        endpoint='/vitchennai_vibrance/studentLogin'
        headers = {'Content-Type': 'application/json'} 
        payload = {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHFxeHpzancwMDAwN3J4cWFsbXFweXJoIiwiaWF0IjoxNzA0MzQ4MTYxLCJleHAiOjE3MDcxMTI5NjF9.apfLSl1Wu5ja9kXsWoLYdNYRzUkxuXUfuHOSOuhrBXc",
    "serialNo": serialID,
    "verifyingUser": "clqzfymr6000008l41yzp2pfu",
    "studentID": "21BRS1551",
    "user": {
        "id": "clqzfymr6000008l41yzp2pfu"
    }
}


        response = self.client.get(endpoint)
        print(f"Response status code: {response.status_code}")

